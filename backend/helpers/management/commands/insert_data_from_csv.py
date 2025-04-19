import os
import uuid
from datetime import datetime
from pathlib import Path

import pandas as pd
from dataproducts.models import ETLLogs, LulinDataProduct
from django.core.exceptions import ValidationError
from django.core.management.base import BaseCommand
from django.db import transaction
from observations.lulin_models import Filters, Instruments
from observations.models import Observatories
from system.models import User
from targets.models import Target

FILE_PATH = os.getenv("PHOTOMETRY_PATH", "/app/data")


class Command(BaseCommand):
    help = 'Insert data from CSV file into LulinDataProduct table'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='Path to the CSV file')
        parser.add_argument(
            '--user_id', type=int, help='User ID to associate with the data products', default=1)

    @staticmethod
    def find_target_by_name(name):
        try:
            return Target.objects.get(name=name, deleted_at__isnull=True)
        except Target.DoesNotExist:
            return None

    @staticmethod
    def find_or_create_filter(filter_name):
        filter_obj, created = Filters.objects.get_or_create(name=filter_name)
        return filter_obj

    @staticmethod
    def find_or_create_instrument(instrument_name):
        instrument_obj, created = Instruments.objects.get_or_create(
            name=instrument_name)
        return instrument_obj

    def handle(self, *args, **options):
        csv_file_path = options['csv_file']
        user_id = options['user_id']

        # Create ETL log entry
        etl_log = ETLLogs.objects.create(
            name=str(uuid.uuid4())[:8],
            observatory=Observatories.LULIN,
            success=False
        )

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR(
                f'User with ID {user_id} does not exist'))
            return

        # Check if file exists
        file_path = Path(csv_file_path)
        if not file_path.is_absolute():
            file_path = Path(FILE_PATH) / csv_file_path

        if not file_path.exists():
            self.stdout.write(self.style.ERROR(
                f'File {file_path} does not exist'))
            etl_log.error_message = f'File {file_path} does not exist'
            etl_log.save()
            return

        # Read CSV file
        try:
            df = pd.read_csv(file_path)
            self.stdout.write(self.style.SUCCESS(
                f'Successfully read {len(df)} rows from {file_path}'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(
                f'Error reading CSV file: {str(e)}'))
            etl_log.error_message = f'Error reading CSV file: {str(e)}'
            etl_log.save()
            return

        # Process data
        created_count = 0
        error_count = 0

        with transaction.atomic():
            for _, row in df.iterrows():
                try:
                    # Find target by name if provided
                    target = None
                    if 'target_name' in row and pd.notna(row['target_name']):
                        target = self.find_target_by_name(row['target_name'])

                    # Get filter and instrument as integer values
                    filter_id = None
                    instrument_id = None

                    if 'filter' in row and pd.notna(row['filter']):
                        try:
                            # Try to convert string filter name to enum value
                            filter_value = row['filter'].lower().strip()
                            # Default to first filter if not found
                            filter_id = 1

                            # Map common filter names to Filters enum values
                            if 'u' in filter_value:
                                filter_id = Filters.up_Astrodon_2019
                            elif 'g' in filter_value:
                                filter_id = Filters.gp_Astrodon_2019
                            elif 'r' in filter_value:
                                filter_id = Filters.rp_Astrodon_2019
                            elif 'i' in filter_value:
                                filter_id = Filters.ip_Astrodon_2019
                            elif 'z' in filter_value:
                                filter_id = Filters.zp_Astrodon_2019
                        except (ValueError, AttributeError):
                            # If conversion fails, use default
                            filter_id = 1

                    if 'instrument' in row and pd.notna(row['instrument']):
                        try:
                            # Try to convert string instrument name to enum value
                            instrument_value = row['instrument'].upper(
                            ).strip()
                            # Default to first instrument if not found
                            instrument_id = 1

                            # Map common instrument names to Instruments enum values
                            if 'LOT' in instrument_value:
                                instrument_id = Instruments.LOT
                            elif 'SLT' in instrument_value:
                                instrument_id = Instruments.SLT
                            elif 'TRIPOL' in instrument_value:
                                instrument_id = Instruments.TRIPOL
                        except (ValueError, AttributeError):
                            # If conversion fails, use default
                            instrument_id = 1

                    # Create data product with all required fields
                    data_product = LulinDataProduct(
                        name=row.get('name', f'Data_{uuid.uuid4()}'),
                        file_name=row.get('file_name', ''),
                        user=user,
                        target=target,
                        mjd=row.get('mjd', 0.0),  # Required field
                        mag=row.get('mag', 0.0),  # Required field
                        source_ra=row.get('source_ra', row.get('ra', 0.0)),
                        source_dec=row.get('source_dec', row.get('dec', 0.0)),
                        exposure_time=row.get('exposure_time', 0.0),
                        zp=row.get('zp', 0.0),  # Required field
                        filter=filter_id,
                        instrument=instrument_id,
                        FWHM=row.get('FWHM', 0.0),  # Required field
                    )

                    # Store observation_date in the data field if available
                    data = row.to_dict()
                    if 'observation_date' in row and pd.notna(row['observation_date']):
                        try:
                            observation_date = datetime.strptime(
                                row['observation_date'], '%Y-%m-%d %H:%M:%S')
                            data['observation_date'] = observation_date.isoformat()
                        except ValueError:
                            pass

                    data_product.data = data
                    data_product.save()
                    created_count += 1

                except Exception as e:
                    self.stdout.write(self.style.WARNING(
                        f'Error processing row: {str(e)}'))
                    error_count += 1

        # Update ETL log
        etl_log.success = error_count == 0
        etl_log.processed_count = created_count
        etl_log.error_count = error_count
        etl_log.error_message = f'{error_count} errors occurred' if error_count > 0 else None
        etl_log.save()

        # Print summary
        self.stdout.write(self.style.SUCCESS(
            f'Successfully created {created_count} data products'))
        if error_count > 0:
            self.stdout.write(self.style.WARNING(
                f'Encountered {error_count} errors'))
