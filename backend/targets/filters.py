from django_filters import rest_framework as filters

from .models import Target


class TargetFilter(filters.FilterSet):
    name = filters.CharFilter(lookup_expr='icontains')
    ra_min = filters.NumberFilter(field_name='ra', lookup_expr='gte')
    ra_max = filters.NumberFilter(field_name='ra', lookup_expr='lte')
    dec_min = filters.NumberFilter(field_name='dec', lookup_expr='gte')
    dec_max = filters.NumberFilter(field_name='dec', lookup_expr='lte')
    tags = filters.BaseInFilter(field_name='tags', lookup_expr='in')

    class Meta:
        model = Target
        fields = ['name', 'ra_min', 'ra_max', 'dec_min', 'dec_max', 'tags']
