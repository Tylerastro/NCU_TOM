from django.urls import path

from observations.views import (
    LulinCodeView,
    LulinRunViewSet,
    ObservationViewSet,
    get_lulin_compiled_codes,
    get_observation_stats,
    get_observatories,
)

urlpatterns = [
    path('observations/', ObservationViewSet.as_view({'get': 'list', 'post': 'create', 'delete': 'bulk_delete'})),
    path('observations/stats/', get_observation_stats),
    path('observations/lulin/code/', get_lulin_compiled_codes),
    path('observations/<int:pk>/', ObservationViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'})),
    path('observations/<int:pk>/duplicate/', ObservationViewSet.as_view({'post': 'duplicate'})),
    path('observations/<int:pk>/messages/', ObservationViewSet.as_view({'get': 'messages', 'post': 'messages'})),
    path('observations/<int:pk>/altaz/', ObservationViewSet.as_view({'post': 'altaz'})),
    path('observations/<int:observation_pk>/lulin/', LulinRunViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('observations/lulin/<int:pk>/', LulinRunViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'})),
    path('observations/<int:pk>/lulin/code/', LulinCodeView.as_view()),
    path('observatories/', get_observatories),
]
