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
        self.alt_threshold = 20  # Minimum altitude for observation in degrees

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

    def get_earliest_suitable_time(self, target_altaz):
        """
        Determine the earliest time a target reaches a suitable altitude for observation.
        Returns the time index and ISO time string.
        """
        for i, alt in enumerate(target_altaz.altaz.alt):
            if alt > self.alt_threshold:
                return i, target_altaz.altaz.time[i]
        return float('inf'), None  # Target never reaches suitable altitude

    def gen_code(self, observation_id):
        # Get the observation to retrieve time range
        observation = Observation.objects.get(id=observation_id)
        observations_runs = LulinRun.objects.filter(observation=observation_id)

        # Extract unique targets
        targets = [obs.target for obs in observations_runs]
        unique_targets = []
        for target in targets:
            if target.name not in [t.name for t in unique_targets]:
                unique_targets.append(target)

        # Get alt/az data for each target
        start_time = Time(observation.start_date)
        end_time = Time(observation.end_date)
        targets_altaz = self.visibility.get_targets_altaz(
            targets=unique_targets,
            start_time=start_time,
            end_time=end_time
        )

        # Sort targets by the earliest time they reach a suitable altitude
        targets_with_times = []
        for target_altaz in targets_altaz:
            idx, earliest_time = self.get_earliest_suitable_time(target_altaz)
            targets_with_times.append((target_altaz.name, idx, earliest_time))

        # Sort by time index (earlier is better)
        sorted_target_names = [t[0] for t in sorted(
            targets_with_times, key=lambda x: x[1])]

        # Create dictionary of target data, preserving original observation parameters
        targets_dict = {}
        for obs in observations_runs:
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

        # Generate the code with consolidated blocks, in order of target appearance
        code = ""
        for target_name in sorted_target_names:
            if target_name in targets_dict:
                target_data = targets_dict[target_name]
                target = target_data['target']

                # Join values with commas
                binning = ", ".join(sorted(target_data['binning']))
                frames = ", ".join(target_data['frames'])
                exposure_times = ", ".join(target_data['exposure_times'])
                filters = ", ".join(self.get_filter_full_name(f)
                                    for f in target_data['filters'])

                # Create single block for target
                tmp = f"""
#REPEAT 1
#BINNING {binning}
#COUNT {frames}
#INTERVAL {exposure_times}
#FILTER {filters}

{target.name}\t{self.convert_ra(target.ra)}\t{self.convert_dec(target.dec)}
#WAITFOR 1
                """
                code += tmp

        # Add any remaining targets that didn't have altitude data
        remaining_targets = set(targets_dict.keys()) - set(sorted_target_names)
        for target_name in remaining_targets:
            target_data = targets_dict[target_name]
            target = target_data['target']

            # Join values with commas
            binning = ", ".join(sorted(target_data['binning']))
            frames = ", ".join(target_data['frames'])
            exposure_times = ", ".join(target_data['exposure_times'])
            filters = ", ".join(self.get_filter_full_name(f)
                                for f in target_data['filters'])

            # Create single block for target
            tmp = f"""
#REPEAT 1
#BINNING {binning}
#COUNT {frames}
#INTERVAL {exposure_times}
#FILTER {filters}

{target.name}\t{self.convert_ra(target.ra)}\t{self.convert_dec(target.dec)}
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
