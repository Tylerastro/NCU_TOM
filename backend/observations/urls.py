from django.urls import path

import observations.views as views

urlpatterns = [
    path('observations/', views.ObservationsView.as_view()),
    path('observations/<int:pk>/', views.ObservationDetailView.as_view()),
    path('observations/<int:pk>/duplicate/', views.duplicate_observation),
    path('observations/<int:pk>/messages/',
         views.ObservationMessagesView.as_view()),
    path('observations/<int:pk>/altaz/', views.get_observation_altaz),
    path('observations/<int:pk>/lulin/', views.LulinView.as_view()),
    path('observations/lulin/<int:pk>/', views.LulinDetailView.as_view()),
    path('observations/<int:pk>/lulin/code/', views.LulinCodeView.as_view()),
    path('observations/lulin/code/', views.get_lulin_compiled_codes),
    path('observations/stats/', views.get_observation_stats),
]
