from dataclasses import dataclass, field
from typing import Optional

import pytz

from observations.models import Observatories


@dataclass(frozen=True)
class ObservatoryConfig:
    id: int
    name: str
    code: str
    latitude: float
    longitude: float
    height: float
    timezone: str
    utc_offset_hours: int
    email_recipients_env: str
    cc_emails: list[str] = field(default_factory=list)
    alt_threshold: float = 20.0
    airmass_threshold: float = 15.0

    @property
    def tz(self):
        return pytz.timezone(self.timezone)


# --- Observatory config registry ---

OBSERVATORY_CONFIGS: dict[int, ObservatoryConfig] = {}


def register_observatory(config: ObservatoryConfig):
    OBSERVATORY_CONFIGS[config.id] = config


def get_observatory_config(observatory_id: int) -> ObservatoryConfig:
    try:
        return OBSERVATORY_CONFIGS[observatory_id]
    except KeyError:
        raise ValueError(f"No observatory config registered for id={observatory_id}")


def get_default_observatory() -> ObservatoryConfig:
    return get_observatory_config(Observatories.LULIN)


# --- Run model registry ---

RUN_MODELS: dict[int, type] = {}


def register_run_model(observatory_id: int, model_class: type):
    RUN_MODELS[observatory_id] = model_class


def get_run_model(observatory_id: int) -> type:
    try:
        return RUN_MODELS[observatory_id]
    except KeyError:
        raise ValueError(f"No run model registered for observatory id={observatory_id}")


# --- Register Lulin ---

register_observatory(ObservatoryConfig(
    id=Observatories.LULIN,
    name="Lulin Observatory",
    code="lulin",
    latitude=23.469444,
    longitude=120.872639,
    height=2862,
    timezone="Asia/Taipei",
    utc_offset_hours=8,
    email_recipients_env="LULIN_MAIL",
    cc_emails=["w39398898@gmail.com"],
    alt_threshold=20,
    airmass_threshold=15,
))
