from django_filters import rest_framework as filters

from .models import Observation


class ObservationFilter(filters.FilterSet):
    observatory = filters.NumberFilter()
    status = filters.BaseInFilter(field_name='status', lookup_expr='in')
    name = filters.CharFilter(lookup_expr='icontains')
    users = filters.BaseInFilter(field_name='user', lookup_expr='in')
    tags = filters.BaseInFilter(field_name='tags', lookup_expr='in')

    class Meta:
        model = Observation
        fields = ['observatory', 'status', 'name', 'users', 'tags']
