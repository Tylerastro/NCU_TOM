from django.apps import AppConfig


class ObservationsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'observations'

    def ready(self) -> None:
        import observations.signals  # noqa: F401
        import observations.lulin_code_generator  # noqa: F401

        from observations.models import LulinRun, Observatories
        from observations.observatory_config import register_run_model
        register_run_model(Observatories.LULIN, LulinRun)
