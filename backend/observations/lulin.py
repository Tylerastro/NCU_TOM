
from datetime import datetime
from typing import List

import astropy.units as u
from astropy.coordinates import Angle
from astropy.time import Time
from observations.models import LulinRun, Observation
from targets.models import Target
from targets.visibility import Visibility


class LulinScheduler:
    LULIN = (23.469444, 120.872639)
    TIME_OFFSET = +8 * u.hour

    def __init__(self, time_resolution=1 * u.minute, avoidance_angle=30 * u.deg):
        self.visibility = Visibility(
            lat=self.LULIN[0],
            lon=self.LULIN[1],
            height=2862,
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
        hours = angle_in_degrees.hms.h
        minutes = angle_in_degrees.hms.m
        seconds = angle_in_degrees.hms.s
        return f"{hours:02.0f}:{minutes:02.0f}:{seconds:06.3f}"

    @staticmethod
    def convert_dec(degrees: float) -> str:
        angle_in_degrees = Angle(degrees, u.deg)
        declination = angle_in_degrees.to_string(unit=u.degree, sep=':')

        return declination

    def schedule(self, targets: List[Target], start_time: Time, end_time: Time):
        sorted_targets: List[Target] = sorted(
            targets, key=lambda target: target.name, reverse=True)

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
        observations = LulinRun.objects.filter(observation=observation_id)

        targets_dict = {}
        for obs in observations:
            target_name = obs.target.name
            if target_name not in targets_dict:
                targets_dict[target_name] = {
                    'target': obs.target,
                    'binning': [],
                    'frames': [],
                    'exposure_times': [],
                    'filters': []
                }

            # Add this observation's values
            targets_dict[target_name]['binning'].append(str(obs.binning))
            targets_dict[target_name]['frames'].append(str(obs.frames))
            targets_dict[target_name]['exposure_times'].append(
                str(obs.exposure_time))
            targets_dict[target_name]['filters'].append(
                obs.get_filter_display())

        # Generate the code with consolidated blocks
        code = ""
        for target_name, target_data in targets_dict.items():
            target = target_data['target']

            # Join values with commas
            binning = ", ".join(sorted(target_data['binning']))
            frames = ", ".join(target_data['frames'])
            exposure_times = ", ".join(target_data['exposure_times'])
            filters = ", ".join(target_data['filters'])

            # Create single block for target
            tmp = f"""
    #REPEAT 1
    #BINNING {binning}
    #COUNT {frames}
    #INTERVAL {exposure_times}
    #FILTER {filters}
    {target.name}    {self.convert_ra(target.ra)}    {self.convert_dec(target.dec)}
    #WAITFOR 1
            """
            code += tmp

        return code

    def get_codes(self, start_date: str, end_date: str):

        start_date = datetime.strptime(start_date, '%Y-%m-%dT%H:%M:%S.%fZ')
        end_date = datetime.strptime(end_date, '%Y-%m-%dT%H:%M:%S.%fZ')

        observations = Observation.objects.filter(
            start_date__lte=start_date,
            end_date__gte=end_date,
            status=Observation.statuses.IN_PROGRESS

        )
        tmp = ""
        for obs in observations:
            tmp += obs.code if obs.code else '\n'

        return tmp
