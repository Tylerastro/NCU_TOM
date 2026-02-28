from abc import ABC, abstractmethod
from dataclasses import dataclass
from urllib.parse import parse_qs, urlparse

from astropy.coordinates import SkyCoord

from .simbad import SimbadService


@dataclass
class ResolvedTarget:
    name: str
    ra: float
    dec: float
    source: str


class BaseResolver(ABC):
    @abstractmethod
    def can_handle(self, url: str) -> bool:
        ...

    @abstractmethod
    def extract_identifier(self, url: str) -> str:
        ...

    @abstractmethod
    def resolve(self, identifier: str) -> ResolvedTarget | None:
        ...


class SimbadResolver(BaseResolver):
    HOSTS = {"simbad.u-strasbg.fr", "simbad.cds.unistra.fr"}

    def can_handle(self, url: str) -> bool:
        try:
            parsed = urlparse(url)
            return parsed.hostname in self.HOSTS
        except Exception:
            return False

    def extract_identifier(self, url: str) -> str:
        parsed = urlparse(url)
        params = parse_qs(parsed.query)
        ident = params.get("Ident") or params.get("ident")
        if not ident:
            raise ValueError("URL does not contain an 'Ident' query parameter")
        return ident[0]

    def resolve(self, identifier: str) -> ResolvedTarget | None:
        service = SimbadService()
        obj = service.get_target(identifier)
        if obj is None:
            return None

        data = obj.to_dict()
        ra_str = data.get("RA")
        dec_str = data.get("DEC")
        if ra_str is None or dec_str is None:
            return None

        name = data.get("MAIN_ID", identifier)

        coord = SkyCoord(ra_str, dec_str, unit=("hourangle", "deg"))
        return ResolvedTarget(
            name=name,
            ra=round(coord.ra.deg, 6),
            dec=round(coord.dec.deg, 6),
            source="simbad",
        )


RESOLVERS: list[BaseResolver] = [
    SimbadResolver(),
]


def resolve_url(url: str) -> ResolvedTarget | None:
    for resolver in RESOLVERS:
        if resolver.can_handle(url):
            identifier = resolver.extract_identifier(url)
            return resolver.resolve(identifier)
    raise ValueError("Unsupported URL: no resolver found for this source")
