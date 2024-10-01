from django.db import models
from django.utils.translation import gettext_lazy as _


class Filters(models.IntegerChoices):
    U = 1, _('u')
    G = 2, _('g')
    R = 3, _('r')
    I = 4, _('i')
    Z = 5, _('z')


class Instruments(models.IntegerChoices):
    LOT = 1, _('LOT')
    SLT = 2, _('SLT')
    TRIPOL = 3, _('TRIPOL')
