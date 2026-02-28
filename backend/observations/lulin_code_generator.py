from datetime import datetime

import astropy.units as u
from astropy.coordinates import Angle

from observations.code_generators import BaseCodeGenerator, register_code_generator
from observations.models import LulinRun, Observation, Observatories


class LulinCodeGenerator(BaseCodeGenerator):

    FILTER_FULL_NAMES = {
        'u': 'up_Astrodon_2019',
        'g': 'gp_Astrodon_2019',
        'r': 'rp_Astrodon_2019',
        'i': 'ip_Astrodon_2019',
        'z': 'zp_Astrodon_2019',
    }

    FILTER_ORDER = ['u', 'g', 'r', 'i', 'z']

    @staticmethod
    def _convert_ra(degrees: float) -> str:
        angle = Angle(degrees, u.deg)
        hours = angle.hms.h
        minutes = angle.hms.m
        seconds = angle.hms.s
        return f"{hours:02.0f}:{minutes:02.0f}:{seconds:06.3f}"

    @staticmethod
    def _convert_dec(degrees: float) -> str:
        angle = Angle(degrees, u.deg)
        return angle.to_string(unit=u.degree, sep=':')

    def _get_filter_full_name(self, short: str) -> str:
        return self.FILTER_FULL_NAMES[short]

    def _build_target_block(self, target, target_data) -> str:
        filters_short = target_data['filters']
        filters_sorted = [f for f in self.FILTER_ORDER if f in filters_short]
        filters = ",".join(self._get_filter_full_name(f) for f in filters_sorted)

        binning = ",".join(sorted(target_data['binning']))
        frames = ",".join(target_data['frames'])
        exposure_times = ",".join(target_data['exposure_times'])

        return f"""
#REPEAT 1
#BINNING {binning}
#COUNT {frames}
#INTERVAL {exposure_times}
#FILTER {filters}

{target.name}\t{self._convert_ra(target.ra)}\t{self._convert_dec(target.dec)}
#WAITFOR 1
                """

    def gen_code(self, observation_id) -> str:
        observation = Observation.objects.get(id=observation_id)
        observation_runs = LulinRun.objects.filter(observation=observation_id)

        # Extract unique targets
        targets = [obs.target for obs in observation_runs]
        unique_targets = []
        for target in targets:
            if target.name not in [t.name for t in unique_targets]:
                unique_targets.append(target)

        # Sort unique targets by RA
        sorted_targets_by_ra = sorted(unique_targets, key=lambda t: t.ra)
        sorted_target_names = [t.name for t in sorted_targets_by_ra]

        # Build target data dict
        targets_dict = {}
        for obs in observation_runs:
            target_name = obs.target.name
            if target_name not in targets_dict:
                targets_dict[target_name] = {
                    'target': obs.target,
                    'binning': [],
                    'frames': [],
                    'exposure_times': [],
                    'filters': [],
                }

            targets_dict[target_name]['binning'].append(str(obs.binning))
            targets_dict[target_name]['frames'].append(str(obs.frames))
            targets_dict[target_name]['exposure_times'].append(str(obs.exposure_time))
            targets_dict[target_name]['filters'].append(obs.get_filter_display())

        # Generate code blocks in RA order
        code = ""
        for target_name in sorted_target_names:
            if target_name in targets_dict:
                td = targets_dict[target_name]
                code += self._build_target_block(td['target'], td)

        # Any remaining targets not in sorted list (safety)
        remaining = set(targets_dict.keys()) - set(sorted_target_names)
        for target_name in remaining:
            td = targets_dict[target_name]
            code += self._build_target_block(td['target'], td)

        return code

    def get_codes(self, start_date: str, end_date: str) -> str:
        start_date_dt = datetime.strptime(start_date, '%Y-%m-%dT%H:%M:%S.%fZ')
        end_date_dt = datetime.strptime(end_date, '%Y-%m-%dT%H:%M:%S.%fZ')

        observations = Observation.objects.filter(
            start_date__lte=start_date_dt,
            end_date__gte=end_date_dt,
            status=Observation.statuses.IN_PROGRESS,
        )
        tmp = ""
        for obs in observations:
            tmp += obs.code if obs.code else '\n'
        return tmp


# Register
register_code_generator(Observatories.LULIN, LulinCodeGenerator())
