from typing import Any, Dict, List

import astropy.units as u
import numpy as np
from astroquery.simbad import Simbad


class AstronomicalObject:
    def __init__(self, data: Dict[str, Any]):
        self.data = {key: self._handle_masked(
            value) for key, value in data.items()}

    def _handle_masked(self, value):
        if isinstance(value, np.ma.MaskedArray):
            if np.ma.is_masked(value):
                return None
            else:
                return value.data.item()
        elif isinstance(value, float) and np.isnan(value):
            return None
        return value

    def __str__(self):
        return str(self.data)

    def to_dict(self):
        return self.data


class SimbadService:
    def __init__(self, fields: List[str] = ["distance",
                                            "flux(U)",
                                            "flux(B)",
                                            "flux(V)",
                                            "flux(G)",
                                            "flux(I)",
                                            "flux(J)",
                                            "flux(H)",
                                            "flux(K)",
                                            "flux(u)",
                                            "flux(g)",
                                            "flux(r)",
                                            "flux(i)",
                                            "flux(z)",
                                            "flux_error(U)",
                                            "flux_error(B)",
                                            "flux_error(V)",
                                            "flux_error(G)",
                                            "flux_error(I)",
                                            "flux_error(J)",
                                            "flux_error(H)",
                                            "flux_error(K)",
                                            "flux_error(u)",
                                            "flux_error(g)",
                                            "flux_error(r)",
                                            "flux_error(i)",
                                            "flux_error(z)",
                                            "morphtype",
                                            "otype",
                                            "parallax",
                                            "pm",
                                            "pmra",
                                            "pmdec",
                                            "velocity",
                                            "z_value"]):
        self.service = Simbad()
        self.service.TIMEOUT = 60
        self.service.remove_votable_fields()
        self.service.add_votable_fields(*fields)

    def show_votable_fields(self):
        return self.service.get_votable_fields()

    def get_votable_field(self, field):
        return self.get_field_description(field)

    def list_votable_fields(self):
        return self.service.list_votable_fields()

    def get_target(self, target_name: str) -> AstronomicalObject:
        result_table = self.service.query_object(target_name)
        if result_table is None or len(result_table) == 0:
            return None
        data_row = result_table[0]
        data = {col: data_row[col] for col in result_table.colnames}

        return AstronomicalObject(data)
