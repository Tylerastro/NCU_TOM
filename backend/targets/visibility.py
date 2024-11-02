from typing import List

import astropy.units as u
import numpy as np
from astropy.coordinates import AltAz, EarthLocation, SkyCoord, get_body
from astropy.time import Time, TimeDelta
from targets.models import Target


class AltAzData:
    def __init__(self):
        self.time = []
        self.alt = []
        self.az = []


class AirmassData:
    def __init__(self):
        self.time = []
        self.airmass = []


class TargetAltAz:
    def __init__(self, name, altAz: AltAzData, airmass: AirmassData):
        self.name = name
        self.altaz = altAz
        self.airmass = airmass

    def to_dict(self):
        data = []
        for i in range(len(self.altaz.time)):
            data.append({
                'time': self.altaz.time[i],
                'alt': self.altaz.alt[i],
                'az': self.altaz.az[i],
                'airmass': self.airmass.airmass[i]
            })

        return {
            'name': self.name,
            'data': data
        }


class Visibility:
    LULIN = (23.469444, 120.872639, 2862)

    def __init__(self, lat, lon, height, time_offset=8 * u.hour, avoidance_angle=30 * u.deg, time_resolution=15 * u.minute):
        self.observatory_location = EarthLocation(
            lat=lat * u.deg, lon=lon * u.deg, height=height * u.m)
        self.avoidance_angle = avoidance_angle
        self.time_resolution = time_resolution
        self.time_offset = time_offset

    def _get_time_resolution(self, start_time: Time, end_time: Time):
        time_diff = end_time - start_time
        if time_diff < 2 * u.day:
            return 15 * u.minute
        elif time_diff < 3 * u.day:
            return 25 * u.minute
        elif time_diff < 4 * u.day:
            return 35 * u.minute
        else:
            return 45 * u.minute

    def is_moon_interfering(self, target, observation_time) -> bool:
        moon = get_body('moon', observation_time,
                        location=self.observatory_location)
        target = SkyCoord(ra=target.ra, dec=target.dec, frame='icrs')

        separation = moon.separation(target)
        return separation < self.avoidance_angle

    def get_moon_altaz(self, start_time: Time, end_time: Time) -> TargetAltAz:
        time_resolution = TimeDelta(self.time_resolution).to(u.day).value
        jd_range = np.arange(start_time.jd, end_time.jd +
                             time_resolution, time_resolution)

        observation_times = Time(jd_range, format='jd', scale='utc')
        # * Given UTC inputs
        moon_altaz = get_body('moon', observation_times, location=self.observatory_location).transform_to(
            AltAz(obstime=observation_times, location=self.observatory_location))

        altaz_data = AltAzData()
        airmass_data = AirmassData()

        altaz_data.time = observation_times.isot.tolist()
        altaz_data.alt = moon_altaz.alt.deg.tolist()
        altaz_data.az = moon_altaz.az.deg.tolist()
        airmass_data.time = observation_times.isot.tolist()
        airmass_data.airmass = moon_altaz.secz
        return TargetAltAz(name='Moon', altAz=altaz_data, airmass=airmass_data)

    def get_target_altaz(self, name, ra, dec, start_time: Time, end_time: Time) -> TargetAltAz:
        target = SkyCoord(ra=ra*u.deg, dec=dec*u.deg, frame='icrs')
        time_resolution = TimeDelta(self._get_time_resolution(
            start_time, end_time)).to(u.day).value
        jd_range = np.arange(start_time.jd, end_time.jd +
                             time_resolution, time_resolution)
        observation_times = Time(jd_range, format='jd', scale='utc')
        # * Given UTC inputs
        altaz = target.transform_to(
            AltAz(obstime=observation_times, location=self.observatory_location))

        altaz_data = AltAzData()
        airmass_data = AirmassData()
        altaz_data.time = observation_times.isot.tolist()
        altaz_data.alt = altaz.alt.deg.tolist()
        altaz_data.az = altaz.az.deg.tolist()
        airmass_data.time = observation_times.isot.tolist()
        airmass_data.airmass = altaz.secz
        return TargetAltAz(name, altaz_data, airmass_data)

    def get_targets_altaz(self, targets: List[Target], start_time: Time, end_time: Time) -> List[TargetAltAz]:
        targets_altaz = []
        for target in targets:
            target_altaz = self.get_target_altaz(target.name,
                                                 target.ra, target.dec, start_time, end_time)
            targets_altaz.append(target_altaz)

        return targets_altaz

    def get_airmass(self, ra, dec, start_time, end_time):
        target = SkyCoord(ra=ra*u.deg, dec=dec*u.deg, frame='icrs')
        observation_times = Time(np.arange(
            start_time.jd, end_time.jd, self.time_resolution.to(u.day).value), format='jd')

        airmasses = []
        for time in observation_times:
            if not self.is_moon_interfering(target, time):
                altaz = target.transform_to(
                    AltAz(obstime=time, location=self.observatory_location))
                airmasses.append(altaz.secz)
            else:
                airmasses.append(np.inf)

        return airmasses

    def get_targets_airmass(self, targets: List[Target], start_time: Time, end_time: Time) -> List[List[float]]:
        targets_airmass = []
        for target in targets:
            target_airmass = self.get_airmass(
                target.ra, target.dec, start_time, end_time)
            targets_airmass.append(target_airmass)

        return targets_airmass
