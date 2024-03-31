from django.contrib.auth.models import (AbstractUser, BaseUserManager,
                                        PermissionsMixin)
from django.db import models


class Observatories(models.IntegerChoices):
    LULIN = 1


class Tags(models.Model):
    user = models.ForeignKey('helpers.Users',
                             on_delete=models.CASCADE)
    name = models.CharField(max_length=100, null=False, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)


class Comments(models.Model):
    user = models.ForeignKey(
        'helpers.Users', on_delete=models.CASCADE, null=True)
    context = models.TextField(max_length=500, null=False, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Announcements(models.Model):
    class types(models.IntegerChoices):
        INFO = 1
        WARNING = 2
        ERROR = 3
        URGENT = 4

    user = models.ForeignKey('helpers.Users',
                             on_delete=models.CASCADE)
    title = models.CharField(max_length=100, null=False, blank=False)
    context = models.TextField(max_length=1000, null=False, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    type = models.IntegerField(choices=types.choices, null=False, blank=False)


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


class Users(AbstractUser, PermissionsMixin):
    objects = UserManager()

    class roles(models.IntegerChoices):
        ADMIN = 1
        FACULTY = 2
        USER = 3

    username = models.CharField(max_length=100, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    institute = models.CharField(max_length=100)
    email = models.EmailField(unique=True, verbose_name='email address')
    role = models.IntegerField(choices=roles.choices)
    created_at = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now=True)
    use_demo_targets = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['first_name', 'last_name',
                       'institute', 'email', 'role', 'use_demo_targets']

    def __str__(self):
        return self.username
