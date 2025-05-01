from math import radians

from dataproducts.models import LulinDataProduct
from django.core.management.base import BaseCommand
from django.db.models import F
from django.db.models.functions import ACos, Cos, Radians, Sin
from targets.models import Target


class Command(BaseCommand):
    help = 'Import Lulin data from CSV file'

    @staticmethod
    def find_targets_within_radius(ra, dec, radius_degrees):
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
    def find_target_by_name(name):
        try:
            return Target.objects.get(name=name, deleted_at__isnull=True)
        except Target.DoesNotExist:
            return None

    def find_target(self, name, ra, dec):
        target = self.find_target_by_name(name)
        if not target:
            target = self.find_closest_target(ra, dec)
        return target

    def handle(self, *args, **options):
        # First, check for datasets with deleted targets and remove the foreign key
        data_sets_with_deleted_targets = LulinDataProduct.objects.filter(
            target__deleted_at__isnull=False
        )

        deleted_count = data_sets_with_deleted_targets.count()
        if deleted_count > 0:
            self.stdout.write(self.style.WARNING(
                f'Found {deleted_count} data sets with deleted targets'
            ))
            for data_set in data_sets_with_deleted_targets:
                data_set.target = None
                data_set.save()
            self.stdout.write(self.style.SUCCESS(
                f'Removed target reference from {deleted_count} data sets'
            ))

        # Now process data sets without targets
        data_sets = LulinDataProduct.objects.filter(target__isnull=True)

        total = data_sets.count()
        self.stdout.write(self.style.NOTICE(f'Processing {total} data sets'))
        found_count = 0
        for data_set in data_sets:
            self.stdout.write(
                self.style.NOTICE(
                    f'Processing {data_set.name}'
                ))
            target = self.find_target(
                data_set.name, data_set.source_ra, data_set.source_dec)
            if target and target.deleted_at is None:
                data_set.target = target
                data_set.save()
                found_count += 1

        self.stdout.write(self.style.SUCCESS(
            f'Processed {total} data sets'))
        self.stdout.write(self.style.SUCCESS(
            f'Found {found_count} data sets'))
        self.stdout.write(self.style.WARNING(
            f'Not found: {total - found_count}'))
