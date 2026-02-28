from django.contrib.auth.models import AbstractUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone

from helpers.managers import SoftDeleteQuerySet


class UserManager(BaseUserManager):
    def get_queryset(self):
        return SoftDeleteQuerySet(self.model, using=self._db).filter(deleted_at__isnull=True)

    def create_user(self, email, password=None, **kwargs):
        if not email:
            raise ValueError("Users must have an email address")
        user = self.model(
            email=self.normalize_email(email),
            **kwargs
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **kwargs):
        user = self.create_user(
            email,
            password=password,
            **kwargs
        )
        user.is_admin = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractUser, PermissionsMixin):
    objects = UserManager()
    all_objects = models.Manager()

    class Meta:
        ordering = ['id', '-created_at']
        db_table = 'User'

    class Roles(models.IntegerChoices):
        ADMIN = 1
        FACULTY = 2
        USER = 3

    username = models.CharField(max_length=100, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    institute = models.CharField(max_length=100)
    email = models.EmailField(unique=True, verbose_name='email address')
    role = models.IntegerField(choices=Roles.choices, default=Roles.USER)
    created_at = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'role',
                       'institute', 'email']

    def __str__(self):
        return self.username

    def delete(self, *args, **kwargs):
        """Soft-delete this user."""
        self.deleted_at = timezone.now()
        self.is_active = False
        self.save(update_fields=["deleted_at", "is_active"])

    def hard_delete(self, *args, **kwargs):
        """Permanently delete this user."""
        super().delete(*args, **kwargs)

    def restore(self):
        """Restore a soft-deleted user."""
        self.deleted_at = None
        self.save(update_fields=["deleted_at"])


class RequestLog(models.Model):
    path = models.CharField(max_length=255)
    method = models.CharField(max_length=10)
    query_params = models.TextField(null=True, blank=True)
    body = models.TextField(null=True, blank=True)
    headers = models.TextField(null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    response_status = models.PositiveIntegerField(null=True, blank=True)
    response_body = models.TextField(null=True, blank=True)
    processing_time = models.FloatField(
        null=True, blank=True)  # in milliseconds
    request_size = models.PositiveIntegerField(
        null=True, blank=True)  # in bytes
    error_occurred = models.BooleanField(default=False)
    error_type = models.CharField(max_length=255, null=True, blank=True)
    error_message = models.TextField(null=True, blank=True)
    stack_trace = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.method} {self.path} ({self.timestamp})"

    class Meta:
        indexes = [
            models.Index(fields=["path"], name="api_path"),
            models.Index(fields=["timestamp"], name="request_timestamp"),
            models.Index(fields=["error_occurred"], name="error_occurred"),
        ]
        db_table = 'RequestLog'
