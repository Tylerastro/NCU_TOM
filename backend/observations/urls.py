import observations.views as views
from django.urls import path
from helpers.views import send_observation_mail
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'observations', views.ObservationsView,
                basename='observations')


# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('observations/', views.ObservationsView.as_view()),
    path('observations/<int:pk>/delete/', views.DeleteObservation),
    path('observations/<int:pk>/messages/',
         views.ObservationMessagesView.as_view()),
    path('observations/<int:pk>/edit/', views.ObservationsView.as_view()),
    path('observations/<int:pk>/altaz/', views.GetObservationAltAz),
    path('observations/lulin/<int:id>/code/', views.CodeView.as_view()),
    path('observations/lulin/code/', views.GetCodes),
    path('observations/<int:pk>/lulin/', views.LulinView.as_view()),
    path('observations/lulin/', views.LulinView.as_view()),
    path('observations/submit/lulin/', send_observation_mail),
]
