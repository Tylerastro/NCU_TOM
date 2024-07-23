import observations.views as views
from django.urls import path
from helpers.views import send_observation_mail
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'observations', views.ObservationsView,
                basename='observations')


urlpatterns = [
    path('observations/', views.ObservationsView.as_view()),
    path('observations/<int:pk>/', views.ObservationDetailView.as_view()),
    path('observations/<int:pk>/messages/',
         views.ObservationMessagesView.as_view()),
    path('observations/<int:pk>/altaz/', views.GetObservationAltAz),
    path('observations/lulin/', views.LulinView.as_view()),
    path('observations/lulin/<int:id>/code/', views.CodeView.as_view()),
    path('observations/lulin/code/', views.GetCodes),
    path('observations/<int:pk>/lulin/', views.LulinView.as_view()),
    path('observations/stats/', views.getObservationStats),
    path('observations/submit/lulin/', send_observation_mail),
]
