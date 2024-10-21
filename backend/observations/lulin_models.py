from django.db import models
from django.utils.translation import gettext_lazy as _


class Filters(models.IntegerChoices):
    up_Astrodon_2019 = 1, _('u')
    gp_Astrodon_2019 = 2, _('g')
    rp_Astrodon_2019 = 3, _('r')
    ip_Astrodon_2019 = 4, _('i')
    zp_Astrodon_2019 = 5, _('z')


class Instruments(models.IntegerChoices):
    LOT = 1, _('LOT')
    SLT = 2, _('SLT')
    TRIPOL = 3, _('TRIPOL')
