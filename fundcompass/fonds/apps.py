from django.apps import AppConfig


class FondsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "fonds"

    def ready(self):
        # Load model once at startup so the first request isn't slow.
        # Skipped during migrations and management commands that don't need it.
        try:
            from .embedding import get_model
            get_model()
        except Exception:
            pass  # never crash startup over model loading
