import os

import pandas as pd
from dataproducts.models import LulinDataProduct
from django.core.exceptions import ValidationError
from django.core.management.base import BaseCommand
from django.db import transaction
from observations.lulin_models import Filters, Instruments
from targets.models import Target

FILE_PATH = os.getenv("PHOTOMETRY_PATH", None)


class Command(BaseCommand):
    help = 'Import Lulin data from CSV file'

    def handle(self, *args, **options):

        # Get the most recent CSV file in the directory
        csv_files = [f for f in os.listdir(FILE_PATH) if f.endswith('.csv')]
        if not csv_files:
            self.stdout.write(self.style.ERROR(
                f'No CSV files found in {FILE_PATH}'))
            return

        for file in csv_files:
            csv_file_path = os.path.join(FILE_PATH, file)

            try:
                df = pd.read_csv(csv_file_path)
            except Exception as e:
                self.stdout.write(self.style.ERROR(
                    f'Error reading CSV file: {str(e)}'))
                return

            with transaction.atomic():
                for _, row in df.iterrows():
                    self.stdout.write(f"Processing row: {row}")
                    try:
                        target = Target.objects.get(name=row['object'])
                    except Target.DoesNotExist:
                        self.stdout.write(self.style.WARNING(
                            f"Target '{row['object']}' not found. "))
                        target = None

                    try:
                        filter_choice = Filters[row['filter']].value
                    except KeyError:
                        self.stdout.write(self.style.WARNING(
                            f"Invalid filter '{row['filter']}' for target '{row['object']}'. Skipping row."))
                        continue

                    try:
                        instrument_choice = Instruments[row['telescope']].value
                    except KeyError:
                        self.stdout.write(self.style.WARNING(
                            f"Invalid instrument '{row['telescope']}' for target '{row['object']}'. Skipping row."))
                        continue

                    try:
                        LulinDataProduct.objects.create(
                            name=row['object'],
                            file_name=row['complete_info_filename'],
                            target=target,
                            mjd=float(row['obs_midMJD']),
                            mag=float(row['mag']),
                            source_ra=float(row['RA_fit']),
                            source_dec=float(row['Dec_fit']),
                            exposure_time=float(row['intexptime']),
                            zp=float(row['optimized_zeropoint_mag']),
                            filter=filter_choice,
                            instrument=instrument_choice,
                            FWHM=float(row['estimated_FWHM']),
                        )
                        self.stdout.write(self.style.SUCCESS(
                            f"Successfully imported data for target '{row['object']}'"))
                    except ValidationError as e:
                        self.stdout.write(self.style.WARNING(
                            f"Validation error for target '{row['object']}': {str(e)}. Skipping row: {row}"))
                        continue

            self.stdout.write(self.style.SUCCESS(
                f'Lulin data imported successfully from {file}'))
