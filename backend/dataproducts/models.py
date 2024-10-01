import uuid

from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils.translation import gettext_lazy as _
from observations.lulin_models import Filters, Instruments
from observations.models import Observatories


class DataProducts(models.Model):

    name = models.CharField(max_length=100, null=False, blank=True)
    observatory = models.IntegerField(choices=Observatories.choices)
    user = models.ForeignKey(
        'helpers.User', on_delete=models.CASCADE, null=True)
    path = models.FileField(upload_to='dataproducts/', null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    shareable = models.BooleanField(default=False)

    @property
    def download_path(self):

        uuid_str = str(uuid.uuid5(uuid.NAMESPACE_DNS, self.path.name))
        # TODO setup download folder and path
        return f"dataproducts/{uuid_str}"


class LulinDataProduct(models.Model):

    name = models.CharField(max_length=100, null=False, blank=True)
    file_name = models.CharField(max_length=100, null=False, blank=True)
    target = models.ForeignKey(
        'targets.Target', on_delete=models.CASCADE, null=True)
    mjd = models.FloatField(null=False)
    mag = models.FloatField(null=False)
    source_ra = models.FloatField(null=False, validators=[
        MinValueValidator(0), MaxValueValidator(360)
    ])
    source_dec = models.FloatField(null=False, validators=[
        MinValueValidator(-90), MaxValueValidator(90)])
    exposure_time = models.FloatField(null=False)
    zp = models.FloatField(null=False)
    instrument_mag = models.FloatField(null=False)
    photometric_band = models.CharField(max_length=100, null=False, blank=True)
    filter = models.IntegerField(
        _("Filter"), choices=Filters.choices, default=1, null=True)
    instrument = models.IntegerField(
        _("Instruments"), choices=Instruments.choices, default=1, null=True)
    FWHM = models.FloatField(null=False)
    user = models.ForeignKey(
        'helpers.User', on_delete=models.CASCADE, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        db_table = 'LulinDataProduct'
