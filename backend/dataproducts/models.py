import uuid

from django.db import models
from helpers.models import Observatories


class DataProducts(models.Model):

    name = models.CharField(max_length=100, null=False, blank=True)
    observatory = models.IntegerField(choices=Observatories.choices)
    user = models.ForeignKey(
        'helpers.Users', on_delete=models.CASCADE, null=True)
    path = models.FileField(upload_to='dataproducts/', null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def download_path(self):

        uuid_str = str(uuid.uuid5(uuid.NAMESPACE_DNS, self.path.name))
        return f"dataproducts/{uuid_str}"
