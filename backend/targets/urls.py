import targets.views as views
from django.urls import path
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'targets', views.TargetsView, basename='targets')


# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('targets/', views.TargetsView.as_view()),
    path('targets/<int:pk>/simbad/', views.GetTargetSimbad),
    path('targets/<int:pk>/sed/', views.GetTargetSED),
    path('targets/<int:pk>/edit/', views.TargetsView.as_view()),
    path('targets/bulk/', views.BulkTargetCreation),
    path('targets/<int:pk>/delete/', views.DeleteTarget),
    path('targets/moon/altaz/', views.GetMoonAltAz),
    path('targets/delete/bulk/', views.DeleteBulkTargets),
]
