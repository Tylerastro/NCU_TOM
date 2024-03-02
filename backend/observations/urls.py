import observations.views as views
from django.urls import include, path
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'observations', views.ObservationsView,
                basename='observaitons')


# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('observations/', views.ObservationsView.as_view()),
    path('observations/<int:pk>/delete/', views.DeleteObservation),
    path('observations/<int:pk>/messages/',
         views.ObservationMessagesView.as_view()),
    path('observations/<int:pk>/edit/', views.ObservationsView.as_view()),
    path('observations/<int:pk>/lulin/', views.LulinView.as_view()),
    path('observations/<int:pk>/lulin/altaz/', views.GetObservationAltAz),
    path('observations/<int:id>/lulin/code/', views.CodeView.as_view()),
    path('observations/lulin/<int:pk>/', views.LulinView.as_view()),
]
