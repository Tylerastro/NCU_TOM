
from urllib.parse import quote

from astropy.table import Table
from targets.models import Target


class SedData:
    def __init__(self):
        self.filter = []
        self.flux = []
        self.fluxe = []
        self.frequency = []

    def to_dict(self):
        flux_to_w_m2_hz = [flux * 1e-26 for flux in self.flux]
        vf = [freq * flux for
              freq, flux in zip(self.frequency, flux_to_w_m2_hz)]

        fluxMin = [flux - fluxe if flux - fluxe >
                   0 else 0 for flux, fluxe in zip(self.flux, self.fluxe)]
        fluxMax = [flux + fluxe if flux + fluxe >
                   0 else 0 for flux, fluxe in zip(self.flux, self.fluxe)]

        vfMin = [freq * flux * 1e-26 for
                 freq, flux in zip(self.frequency, fluxMin)]
        vfMax = [freq * flux * 1e-26 for
                 freq, flux in zip(self.frequency, fluxMax)]

        return {
            'filter': self.filter,
            'flux': self.flux,
            'fluxe': self.fluxe,
            'frequency': self.frequency,
            'fluxv': vf,
            'fluxMin': vfMin,
            'fluxMax': vfMax
        }


class VizierService:

    RETRIES = 3

    def __init__(self):
        self.radius = 2  # arcsecond

    def get_sed(self, target: Target) -> SedData:
        sed_data = SedData()
        coord = target.coordinates
        coord.replace(":", " ")
        url = f"https://vizier.cds.unistra.fr/viz-bin/sed?-c={quote(coord)}&-c.rs={self.radius}"

        for _ in range(self.RETRIES):
            try:
                sed = Table.read(url)
                break
            except Exception as e:
                print(f"Exception: {e}")
        else:
            return sed_data

        sed_freq = list(sed['sed_freq'])  # GHz
        sed_flux = list(sed['sed_flux'])
        sed_fluxe = list(sed['sed_eflux'])
        sed_filter = list(sed['sed_filter'])

        sed_data.filter = sed_filter
        sed_data.flux = sed_flux
        sed_data.fluxe = sed_fluxe
        sed_data.frequency = sed_freq

        return sed_data
