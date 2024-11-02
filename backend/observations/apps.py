from django.apps import AppConfig


class ObservationsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'observations'

    def ready(self) -> None:
        import observations.signals  # noqa: F401
