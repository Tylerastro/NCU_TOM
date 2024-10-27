import targets.views as views
from django.urls import path

urlpatterns = [
    path('targets/', views.TargetsView.as_view()),
    path('targets/<int:pk>/', views.TargetDetailView.as_view()),
    path('targets/<int:pk>/simbad/', views.get_target_simbad),
    path('targets/<int:pk>/sed/', views.get_target_SED),
    path('targets/bulk/', views.targets_creation),
    path('targets/moon/altaz/', views.get_moon_altaz),
]
