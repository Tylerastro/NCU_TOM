from django.conf import settings
from django.contrib.auth.models import (AbstractUser, BaseUserManager,
                                        PermissionsMixin)
from django.db import models
from django.db.models import UniqueConstraint


def get_default_is_active() -> bool:
    return settings.DEBUG


class Tags(models.Model):
    user = models.ForeignKey('helpers.User',
                             on_delete=models.CASCADE)
    name = models.CharField(max_length=100, null=False, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        UniqueConstraint(fields=['user', 'name'], name='user_unique_tag')


class Comments(models.Model):
    user = models.ForeignKey(
        'helpers.User', on_delete=models.CASCADE, null=True)
    context = models.TextField(max_length=500, null=False, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Announcement(models.Model):

    class Meta:
        ordering = ['-created_at']
        db_table = 'Announcement'

    class types(models.IntegerChoices):
        INFO = 1
        WARNING = 2
        ERROR = 3
        URGENT = 4

    user = models.ForeignKey('helpers.User',
                             on_delete=models.CASCADE)
    title = models.CharField(max_length=100, null=False, blank=False)
    context = models.TextField(max_length=1000, null=False, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(null=True)
    type = models.IntegerField(
        choices=types.choices, null=False, blank=False, default=types.INFO)


class UserManager(BaseUserManager):
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

    class Meta:
        ordering = ['id']
        db_table = 'User'

    class roles(models.IntegerChoices):
        ADMIN = 1
        FACULTY = 2
        USER = 3
        VISITOR = 4

    username = models.CharField(max_length=100, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    institute = models.CharField(max_length=100)
    email = models.EmailField(unique=True, verbose_name='email address')
    role = models.IntegerField(choices=roles.choices, default=roles.VISITOR)
    created_at = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)
    use_demo_targets = models.BooleanField(default=True)
    is_active = models.BooleanField(default=get_default_is_active())
    deleted_at = models.DateTimeField(null=True)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'role',
                       'institute', 'email', 'use_demo_targets']

    def __str__(self):
        return self.username


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

    def __str__(self):
        return f"{self.method} {self.path} ({self.timestamp})"

    class Meta:
        indexes = [
            models.Index(fields=["path"], name="api_path"),
        ]
        db_table = 'RequestLog'
