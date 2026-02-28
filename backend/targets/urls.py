from django.urls import path

from targets.views import TargetViewSet, get_moon_altaz

urlpatterns = [
    path('targets/', TargetViewSet.as_view({'get': 'list', 'post': 'create', 'delete': 'bulk_delete'})),
    path('targets/query/', TargetViewSet.as_view({'post': 'resolve_url_action'})),
    path('targets/bulk/', TargetViewSet.as_view({'post': 'bulk_create'})),
    path('targets/moon/altaz/', get_moon_altaz),
    path('targets/<int:pk>/', TargetViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'})),
    path('targets/<int:pk>/simbad/', TargetViewSet.as_view({'get': 'simbad'})),
    path('targets/<int:pk>/sed/', TargetViewSet.as_view({'get': 'sed'})),
]
