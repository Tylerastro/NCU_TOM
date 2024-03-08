from astropy import units as u
from astropy.coordinates import SkyCoord
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Target(models.Model):
    user = models.ForeignKey('helpers.Users',
                             on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    ra = models.FloatField(null=False, validators=[
                           MinValueValidator(0), MaxValueValidator(360)])
    dec = models.FloatField(null=False, validators=[
                            MinValueValidator(-90), MaxValueValidator(90)])
    redshift = models.FloatField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
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
