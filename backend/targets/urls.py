import targets.views as views
from django.urls import path
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'targets', views.TargetsView, basename='targets')


# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('targets/', views.TargetsView.as_view()),
    path('targets/<int:pk>/simbad/', views.getTargetSimbad),
    path('targets/<int:pk>/sed/', views.getTargetSED),
    path('targets/<int:pk>/edit/', views.TargetsView.as_view()),
    path('targets/bulk/', views.bulkTargetCreation),
    path('targets/delete/', views.TargetsView.as_view()),
    path('targets/moon/altaz/', views.getMoonAltAz),
]
