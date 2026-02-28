from django.db import models
from django.utils import timezone


class SoftDeleteQuerySet(models.QuerySet):
    """QuerySet that supports soft deletion."""

    def delete(self):
        """Soft-delete all objects in the queryset."""
        return self.update(deleted_at=timezone.now())

    def hard_delete(self):
        """Permanently delete all objects in the queryset."""
        return super().delete()

    def alive(self):
        """Return only non-deleted objects."""
        return self.filter(deleted_at__isnull=True)

    def dead(self):
        """Return only soft-deleted objects."""
        return self.exclude(deleted_at__isnull=True)


class SoftDeleteManager(models.Manager):
    """Manager that filters out soft-deleted objects by default."""

    def get_queryset(self):
        return SoftDeleteQuerySet(self.model, using=self._db).filter(deleted_at__isnull=True)


class SoftDeleteModel(models.Model):
    """Abstract model providing soft-delete functionality."""

    deleted_at = models.DateTimeField(null=True, blank=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()

    class Meta:
        abstract = True

    def delete(self, *args, **kwargs):
        """Soft-delete this object."""
        self.deleted_at = timezone.now()
        self.save(update_fields=["deleted_at"])

    def hard_delete(self, *args, **kwargs):
        """Permanently delete this object."""
        super().delete(*args, **kwargs)

    def restore(self):
        """Restore a soft-deleted object."""
        self.deleted_at = None
        self.save(update_fields=["deleted_at"])

    @property
    def is_deleted(self):
        return self.deleted_at is not None
