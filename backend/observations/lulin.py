
from datetime import datetime
from typing import List

import astropy.units as u
from astropy.coordinates import Angle
from astropy.time import Time
from observations.models import Lulin, Observation
from targets.models import Target
from targets.visibility import Visibility


class LulinScheduler:
    LULIN = (23.469444, 120.872639)
    TIME_OFFSET = +8 * u.hour

    def __init__(self, time_resolution=1 * u.minute, avoidance_angle=30 * u.deg):
        self.visibility = Visibility(
            lat=self.LULIN[0],
            lon=self.LULIN[1],
            time_resolution=time_resolution,
            avoidance_angle=avoidance_angle
        )

        self.airmass_threshold = 15
        self.alt_threshold = 20

    def get_filter_full_name(self, filter):
        mapping = {
            'u': 'up_Astrodon_2019',
            'g': 'gp_Astrodon_2019',
            'r': 'rp_Astrodon_2019',
            'i': 'ip_Astrodon_2019',
            'z': 'zp_Astrodon_2019'
        }
        return mapping[filter]

    @staticmethod
    def convert_ra(degrees: float) -> str:
        angle_in_degrees = Angle(degrees, u.deg)
        right_ascension = angle_in_degrees.to_string(unit=u.hour, sep=':')

        return right_ascension

    @staticmethod
    def convert_dec(degrees: float) -> str:
        angle_in_degrees = Angle(degrees, u.deg)
        declination = angle_in_degrees.to_string(unit=u.degree, sep=':')

        return declination

    def schedule(self, targets: List[Target], start_time: Time, end_time: Time):
        sorted_targets: List[Target] = sorted(
            targets, key=lambda target: target.priority, reverse=True)

        schedule = {}

        for target in sorted_targets:
            # Get target visibility and airmass
            target_visibility = self.get_altaz(
                target.ra, target.dec, start_time, end_time)
            target_airmass = self.get_airmass(
                target.ra, target.dec, start_time, end_time)

            suitable_slots = []
            for i in range(len(target_visibility)):
                if target_visibility[i] > self.alt_threshold and target_airmass[i] < self.airmass_threshold:
                    pass

            if suitable_slots:
                schedule[target] = suitable_slots

        return schedule

    def gen_code(self, observation_id):
        observations = Lulin.objects.filter(
            observation=observation_id)

        code = ""

        for obs in observations:
            binning = ""
            frames = ""
            exposure = ""
            filters = ""

            for key, val in obs.filters.items():
                if val:
                    filters += self.get_filter_full_name(key) + ","
                    binning += str(obs.binning) + ","
                    frames += str(obs.frames) + ","
                    exposure += str(obs.exposure_time) + ","

            tmp = f"""
#REPEAT 1
#BINNING {binning} 
#COUNT {frames}
#INTERVAL {exposure}
#FILTER {filters}

{obs.target.name}    {self.convert_ra(obs.target.ra)}    {self.convert_dec(obs.target.dec)}
#WAITFOR 1
            """

            code += tmp

        return code

    def get_codes(self, start_date: datetime, end_date: datetime):

        observations = Observation.objects.filter(
            start_date__gte=start_date,
            end_date__lte=end_date
        )

        tmp = ""

        for obs in observations:
            tmp += obs.code

        return tmp
