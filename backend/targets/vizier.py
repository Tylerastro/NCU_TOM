from urllib.parse import quote

from astropy.table import Table
from targets.models import Target


class VizierService:
    RETRIES = 3

    def __init__(self):
        self.radius = 2  # arcsecond

    def get_sed(self, target: Target):
        coord = target.coordinates
        coord = coord.replace(":", " ")
        url = f"https://vizier.cds.unistra.fr/viz-bin/sed?-c={quote(coord)}&-c.rs={self.radius}"

        for _ in range(self.RETRIES):
            try:
                sed = Table.read(url)
                break
            except Exception as e:
                print(f"Exception: {e}")
        else:
            return None

        sed_freq = list(sed['sed_freq'])  # GHz
        sed_flux = list(sed['sed_flux'])
        sed_fluxe = list(sed['sed_eflux'])
        sed_filter = list(sed['sed_filter'])

        aggregated_data = {}

        for f, flux, fluxe, freq in zip(sed_filter, sed_flux, sed_fluxe, sed_freq):
            if f not in aggregated_data:
                aggregated_data[f] = []
            flux_to_w_m2_hz = flux * 1e-26
            fluxv = freq * flux_to_w_m2_hz
            aggregated_data[f].append({
                'flux': flux,
                'fluxe': fluxe,
                'fluxv': fluxv,
                'frequency': freq
            })

        result = []
        for filter_name, data_list in aggregated_data.items():
            result.append({
                'filter': filter_name,
                'flux': [item['flux'] for item in data_list],
                'fluxe': [item['fluxe'] for item in data_list],
                'fluxv': [item['fluxv'] for item in data_list],
                'frequency': [item['frequency'] for item in data_list][0],
            })

        return result
