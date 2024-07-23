import targets.views as views
from django.urls import path
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'targets', views.TargetsView, basename='targets')


# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('targets/', views.TargetsView.as_view()),
    path('targets/<int:pk>/', views.TargetDetailView.as_view()),
    path('targets/<int:pk>/simbad/', views.get_target_simbad),
    path('targets/<int:pk>/sed/', views.get_target_SED),
    path('targets/bulk/', views.targets_creation),
    path('targets/moon/altaz/', views.get_moon_altaz),
]
