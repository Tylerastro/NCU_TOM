# yourapp/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from helpers.models import User

from .models import Target

DEFAULT_TARGETS = [
    {"name": "M87", "ra": 187.70593, "dec": 12.391123,
        "notes": "M87 known as Virgo A"},
    {"name": "NGC 4783", "ra": 193.45792, "dec": -12.58158},
    {"name": "Orion Nebula", "ra": 83.82208, "dec": -
     5.39111, "notes": "Orion Nebula known as M42"},
    {"name": "Andromeda Galaxy", "ra": 10.6847083,
     "dec": 41.26875, "notes": "Andromeda Galaxy known as M31"},
    {"name": "Sombrero Galaxy", "ra": 189.99763, "dec": -
     11.62306, "notes": "Sombrero Galaxy known as M104"},
    {"name": "Whirlpool Galaxy", "ra": 202.46957, "dec": 47.19517,
     "notes": "Whirlpool Galaxy known as M51"},
    {"name": "Horsehead Nebula", "ra": 85.284, "dec": -2.45},
    {"name": "Crab Nebula", "ra": 83.63308, "dec": 22.0145,
     "notes": "Crab Nebula known as M1"},
    {"name": "Betelgeuse", "ra": 88.7929389, "dec": 7.407064,
     "notes": "Betelgeuse known as Alpha Orionis"},
    {"name": "Sirius", "ra": 101.2871553, "dec": -16.7161159,
     "notes": "Sirius known as Alpha Canis Majoris"}
]


@receiver(post_save, sender=User)
def create_user_default_targets(sender, instance, created, **kwargs):
    if created and instance.use_demo_targets:
        for target_data in DEFAULT_TARGETS:
            Target.objects.create(user=instance, **target_data)
