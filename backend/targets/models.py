from datetime import datetime

from astropy import units as u
from astropy.coordinates import SkyCoord
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Target(models.Model):

    class Meta:
        db_table = 'Target'

    user = models.ForeignKey('helpers.User',
                             on_delete=models.CASCADE, related_name='targets')
    name = models.CharField(max_length=100)
    ra = models.FloatField(null=False, validators=[
                           MinValueValidator(0), MaxValueValidator(360)])
    dec = models.FloatField(null=False, validators=[
                            MinValueValidator(-90), MaxValueValidator(90)])
    redshift = models.FloatField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True)
    sed = models.JSONField(null=True, blank=True)
    hashed_sed = models.CharField(max_length=64, null=True, blank=True)
    simbad = models.JSONField(null=True, blank=True)
    hashed_simbad = models.CharField(max_length=64, null=True, blank=True)
    tags = models.ManyToManyField('helpers.Tags', related_name='targets')
    notes = models.TextField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.name

    def formatted_created_at(self):
        return self.created_at.strftime("%Y-%m-%d %H:%M:%S")

    def formatted_updated_at(self):
        return self.updated_at.strftime("%Y-%m-%d %H:%M:%S")

    @property
    def coordinates(self):
        c = SkyCoord(ra=self.ra*u.degree, dec=self.dec*u.degree, frame='icrs')
        ra = c.ra.to_string(unit=u.hour, sep=':')
        dec = c.dec.to_string(unit=u.degree, sep=':')
        return f"{ra} {dec}"

    @property
    def is_deleted(self):
        return self.deleted_at is not None

    def delete(self):
        self.deleted_at = datetime.now()
        self.save()
