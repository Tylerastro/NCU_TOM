import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        User = get_user_model()
        if not User.objects.filter(is_superuser=True).exists():
            User.objects.create_superuser(
                username=os.environ.get("DJANGO_SUPERUSER_USERNAME", "Admin"),
                email=os.environ.get(
                    "DJANGO_SUPERUSER_EMAIL", "admin@example.com"),
                password=os.environ.get(
                    "DJANGO_SUPERUSER_PASSWORD", "Password"),
                first_name=os.environ.get(
                    "DJANGO_SUPERUSER_FIRST_NAME", "tom"),
                last_name=os.environ.get(
                    "DJANGO_SUPERUSER_LAST_NAME", "astro"),
                role=int(os.environ.get("DJANGO_SUPERUSER_ROLE", 1)),
                institute=os.environ.get("DJANGO_SUPERUSER_INSTITUTE", "NCU"),
                use_demo_targets=bool(os.environ.get(
                    "DJANGO_SUPERUSER_USE_DEMO_TARGETS", "True")),
            )
            self.stdout.write(self.style.SUCCESS('Superuser created'))
        else:
            self.stdout.write(self.style.WARNING('Superuser already exists'))
