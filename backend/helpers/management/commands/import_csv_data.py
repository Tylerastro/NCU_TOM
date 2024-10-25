import os
from math import radians

import pandas as pd
from dataproducts.models import ETLLogs, LulinDataProduct
from django.core.exceptions import ValidationError
from django.core.management.base import BaseCommand
from django.db import transaction
from django.db.models import F
from django.db.models.functions import ACos, Cos, Radians, Sin
from observations.lulin_models import Filters, Instruments
from observations.models import Observatories
from targets.models import Target

from backend.helpers.models import User

FILE_PATH = os.getenv("PHOTOMETRY_PATH", None)


class Command(BaseCommand):
    help = 'Import Lulin data from CSV file'

    @staticmethod
    def find_targets_within_radius(self, ra, dec, radius_degrees):
        # Convert to radians for calculation
        ra1_rad = radians(ra)
        dec1_rad = radians(dec)

        targets = Target.objects.annotate(
            # Convert target coordinates to radians
            ra2_rad=Radians(F('ra')),
            dec2_rad=Radians(F('dec')),

            # Calculate the separation using spherical law of cosines
            separation_cos=(
                Sin(dec1_rad) * Sin('dec2_rad') +
                Cos(dec1_rad) * Cos('dec2_rad') *
                Cos(ra1_rad - F('ra2_rad'))
            ),

            # Convert to degrees
            separation=ACos('separation_cos') * 180.0 / 3.141592653589793
        ).filter(
            separation__lte=radius_degrees
        ).order_by('separation')

        return targets

    def find_closest_target(self, ra, dec, max_radius_degrees=1/3600):
        targets = self.find_targets_within_radius(ra, dec, max_radius_degrees)
        return targets.first()

    @staticmethod
    def find_target_by_name(self, name):
        try:
            return Target.objects.get(name=name)
        except Target.DoesNotExist:
            return None

    def find_target(self, name, ra, dec):
        target = self.find_target_by_name(name)
        if not target:
            target = self.find_closest_target(ra, dec)
        return target

    def handle(self, *args, **options):
        # Get the most recent CSV file in the directory
        csv_files = [f for f in os.listdir(FILE_PATH) if f.endswith('.csv')]
        if not csv_files:
            error_message = f'No CSV files found in {FILE_PATH}'
            self.stdout.write(self.style.ERROR(error_message))
            return

        for file in csv_files:
            etl_log = ETLLogs.objects.create(
                name=file,
                observatory=Observatories.LULIN,
                success=False
            )

            csv_file_path = os.path.join(FILE_PATH, file)

            try:
                df = pd.read_csv(csv_file_path)
            except Exception as e:
                error_message = f'Error reading CSV file: {str(e)}'
                self.stdout.write(self.style.ERROR(error_message))
                etl_log.error_message = error_message
                etl_log.save()
                continue

            try:
                with transaction.atomic():
                    error_messages = []  # Collect all warnings and errors

                    for idx, row in df.iterrows():
                        self.stdout.write(f"Processing row: {idx}")
                        try:
                            target = self.find_target(
                                row['object'], row['RA_fit'], row['Dec_fit'])
                        except Target.DoesNotExist:
                            warning = f"Target '{row['object']}' not found. Creating new target."
                            self.stdout.write(self.style.WARNING(warning))
                            error_messages.append(warning)
                            target = Target.objects.create(
                                name=row['object'],
                                ra=row['RA_fit'],
                                dec=row['Dec_fit'],
                                user=User.objects.get(username='admin')
                            )

                        try:
                            filter_choice = Filters[row['filter']].value
                        except KeyError:
                            warning = f"Invalid filter '{row['filter']}' for target '{row['object']}'. Skipping row."
                            self.stdout.write(self.style.WARNING(warning))
                            error_messages.append(warning)
                            continue

                        try:
                            instrument_choice = Instruments[row['telescope']].value
                        except KeyError:
                            warning = f"Invalid instrument '{row['telescope']}' for target '{row['object']}'. Skipping row."
                            self.stdout.write(self.style.WARNING(warning))
                            error_messages.append(warning)
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
                            warning = f"Validation error for target '{row['object']}': {str(e)}. Skipping row: {row}"
                            self.stdout.write(self.style.WARNING(warning))
                            error_messages.append(warning)
                            continue

                    # If we get here, the transaction completed successfully
                    success_message = f'Lulin data imported successfully from {file}'
                    self.stdout.write(self.style.SUCCESS(success_message))

                    # Update ETL log with success and any warnings
                    etl_log.success = True
                    if error_messages:
                        etl_log.error_message = "\n".join(error_messages)
                    etl_log.save()

            except Exception as e:
                # Handle any unexpected errors during the transaction
                error_message = f"Error processing file {file}: {str(e)}"
                self.stdout.write(self.style.ERROR(error_message))
                etl_log.error_message = error_message
                etl_log.save()
                continue
