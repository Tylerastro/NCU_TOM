import math
from typing import List

from astropy import units as u
from astropy.coordinates import SkyCoord
from django.db import transaction
from helpers.models import Tags
from helpers.serializers import (TagsGetSerializer, TagsSerializer,
                                 UserSerializer)
from observations.models import Observation
from rest_framework import serializers

from .models import Target


class ObservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Observation
        fields = ('id', 'name', 'observatory',
                  'start_date', 'end_date', 'status')


class TargetGetSerializer(serializers.ModelSerializer):
    tags = TagsGetSerializer(many=True, required=False)
    user = UserSerializer()
    coordinates = serializers.SerializerMethodField()
    observations = serializers.SerializerMethodField()

    class Meta:
        model = Target
        fields = ('id', 'name', 'ra', 'dec', 'coordinates', 'observations', 'redshift', 'tags',  'notes',
                  'user', 'created_at')

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if 'created_at' in data:
            data['created_at'] = instance.created_at.strftime(
                "%Y-%m-%d %H:%M:%S")
        return data

    def get_coordinates(self, instance):
        c = SkyCoord(ra=instance.ra*u.degree,
                     dec=instance.dec*u.degree, frame='icrs')
        ra = c.ra.to_string(unit=u.hour, sep=':')
        dec = c.dec.to_string(unit=u.degree, sep=':')
        return f"{ra} {dec}"

    def get_observations(self, instance):
        observations = instance.observation_set.all()
        return ObservationSerializer(observations, many=True).data


class TargetPostSerializer(serializers.ModelSerializer):
    tags = TagsSerializer(many=True, required=False)

    class Meta:
        model = Target
        fields = ('name', 'ra', 'dec', 'redshift', 'user', 'tags')
        extra_kwargs = {'user': {'read_only': True}}

    def create(self, validated_data):
        tags_data = validated_data.pop('tags', [])
        user = self.context['request'].user
        target = Target.objects.create(**validated_data, user=user)

        if tags_data:
            with transaction.atomic():
                for tag_data in tags_data:
                    tag, _ = Tags.objects.get_or_create(
                        name=tag_data['name'],
                        user=target.user
                    )
                    target.tags.add(tag)

        return target

    def update(self, instance: Target, validated_data):
        tags_data = validated_data.pop('tags', [])
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        self.update_tags(instance, tags_data)
        return instance

    def update_tags(self, target: Target, tags_data: List[Tags]):
        existing_tag_names = [tag['name'] for tag in tags_data]

        with transaction.atomic():
            for tag_data in tags_data:
                tag, _ = Tags.objects.get_or_create(
                    name=tag_data['name'],
                    user=target.user
                )
                target.tags.add(tag)

        for tag in target.tags.all():
            if tag.name not in existing_tag_names:
                target.tags.remove(tag)


class NestedAltAzDataSerializer(serializers.Serializer):
    time = serializers.DateTimeField()
    alt = serializers.FloatField()
    az = serializers.FloatField()


class AltAzDataSerializer(serializers.ListField):
    child = NestedAltAzDataSerializer()


class TargetAltAzSerializer(serializers.Serializer):
    name = serializers.CharField()
    data = AltAzDataSerializer()


class TargetSimbadDataSerializer(serializers.Serializer):
    RA = serializers.CharField(required=True)
    DEC = serializers.CharField(required=True)
    distance = serializers.FloatField(required=False, default=None)
    morphtype = serializers.CharField(required=False, default=None)
    otype = serializers.CharField(required=False, default=None)
    parallax = serializers.FloatField(required=False, default=None)
    pm = serializers.FloatField(required=False, default=None)
    pmra = serializers.FloatField(required=False, default=None)
    pmdec = serializers.FloatField(required=False, default=None)
    velocity = serializers.FloatField(required=False, default=None)
    z_value = serializers.FloatField(required=False, default=None)
    flux_U = serializers.FloatField(required=False, default=None)
    flux_B = serializers.FloatField(required=False, default=None)
    flux_V = serializers.FloatField(required=False, default=None)
    flux_R = serializers.FloatField(required=False, default=None)
    flux_I = serializers.FloatField(required=False, default=None)
    flux_J = serializers.FloatField(required=False, default=None)
    flux_H = serializers.FloatField(required=False, default=None)
    flux_K = serializers.FloatField(required=False, default=None)
    flux_u = serializers.FloatField(required=False, default=None)
    flux_g = serializers.FloatField(required=False, default=None)
    flux_r = serializers.FloatField(required=False, default=None)
    flux_i = serializers.FloatField(required=False, default=None)
    flux_z = serializers.FloatField(required=False, default=None)

    def to_internal_value(self, data):

        return {
            'RA': data.get('RA', None),
            'DEC': data.get('DEC', None),
            'distance': data.get('Distance_distance', None),
            'morphtype': data.get('MORPH_TYPE', None),
            'otype': data.get('OTYPE', None),
            'parallax': data.get('PLX_VALUE', None),
            'pm': None,  # Update with appropriate data mapping
            'pmra': data.get('PMRA', None),
            'pmdec': data.get('PMDEC', None),
            'velocity': data.get('RVZ_RADVEL', None),
            'z_value': data.get('Z_VALUE', None),
            'flux_U': data.get('FLUX_U', None),
            'flux_B': data.get('FLUX_B', None),
            'flux_V': data.get('FLUX_V', None),
            'flux_R': data.get('FLUX_R', None),
            'flux_I': data.get('FLUX_I', None),
            'flux_J': data.get('FLUX_J', None),
            'flux_H': data.get('FLUX_H', None),
            'flux_K': data.get('FLUX_K', None),
            'flux_u': data.get('FLUX_u', None),
            'flux_g': data.get('FLUX_g', None),
            'flux_r': data.get('FLUX_r', None),
            'flux_i': data.get('FLUX_i', None),
            'flux_z': data.get('FLUX_z', None)
        }


class TargetSEDSerializer(serializers.Serializer):
    filter = serializers.ListField(child=serializers.CharField())
    flux = serializers.ListField(child=serializers.FloatField())
    fluxe = serializers.ListField(child=serializers.FloatField())
    fluxv = serializers.ListField(child=serializers.FloatField())
    frequency = serializers.ListField(child=serializers.FloatField())
    fluxMin = serializers.ListField(child=serializers.FloatField())
    fluxMax = serializers.ListField(child=serializers.FloatField())

    def to_internal_value(self, data):
        return {
            'filter': data.get('filter', None),
            'flux': data.get('flux', None),
            'fluxe': data.get('fluxe', None),
            'frequency': data.get('frequency', None),
            'fluxv': data.get('fluxv', None),
            'fluxMin': data.get('fluxMin', None),
            'fluxMax': data.get('fluxMax', None)
        }

    def to_representation(self, instance):
        """
        Convert `instance` into a JSON-compliant format, handling non-compliant float values.
        """
        ret = super().to_representation(instance)
        # Iterate over float fields and replace non-compliant values
        for field in ['flux', 'fluxe', 'frequency', 'fluxv']:
            if field in ret:
                ret[field] = [self.handle_non_compliant_float(
                    value) for value in ret[field]]
        return ret

    def handle_non_compliant_float(self, value):
        """
        Replace non-JSON-compliant float values with None (or other logic as needed).
        """
        if value is not None and (math.isinf(value) or math.isnan(value)):
            return None
        return value
        return value
        return value
