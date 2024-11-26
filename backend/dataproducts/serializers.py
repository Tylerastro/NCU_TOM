from datetime import datetime, timedelta

from rest_framework import serializers
from targets.serializers import TargetSimpleSerializer

from .models import ETLLogs, LulinDataProduct


class ETLLogsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ETLLogs
        fields = ('name', 'observatory', 'success', 'file_processed',
                  'row_processed', 'created_at')


class LulinDataProductSerializer(serializers.ModelSerializer):
    target = TargetSimpleSerializer()
    obs_date = serializers.SerializerMethodField()

    class Meta:
        model = LulinDataProduct
        fields = ('name', 'target', 'mjd', 'obs_date', 'mag', 'source_ra', 'source_dec',
                  'exposure_time', 'zp', 'filter', 'instrument', 'FWHM', 'created_at')

    def get_obs_date(self, obj):
        if obj.mjd is None:
            return None

        # MJD epoch starts from November 17, 1858
        mjd_epoch = datetime(1858, 11, 17, 0, 0, 0)

        # Convert MJD to timedelta and add to epoch
        days = timedelta(days=float(obj.mjd))
        date = mjd_epoch + days

        return date.isoformat()
