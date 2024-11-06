from django.conf import settings
from django.db import models
from django.db.models import UniqueConstraint
from system.models import User


class Tags(models.Model):
    user = models.ForeignKey('system.User',
                             on_delete=models.CASCADE)
    name = models.CharField(max_length=100, null=False, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        UniqueConstraint(fields=['user', 'name'], name='user_unique_tag')
        db_table = 'Tag'


class Comments(models.Model):
    user = models.ForeignKey(
        'system.User', on_delete=models.CASCADE, null=True)
    context = models.TextField(max_length=500, null=False, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'Comment'


class Announcement(models.Model):

    class Meta:
        ordering = ['-created_at']
        db_table = 'Announcement'

    class types(models.IntegerChoices):
        INFO = 1
        WARNING = 2
        ERROR = 3
        URGENT = 4

    user = models.ForeignKey('system.User',
                             on_delete=models.CASCADE)
    title = models.CharField(max_length=100, null=False, blank=False)
    context = models.TextField(max_length=1000, null=False, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(null=True)
    type = models.IntegerField(
        choices=types.choices, null=False, blank=False, default=types.INFO)


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
