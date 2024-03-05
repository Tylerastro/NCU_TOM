from django.urls import path, re_path
from rest_framework import routers

from .views import (LogoutView, TagsDetailView, TagsView, TomProviderAuthView,
                    TomTokenObtainPairView, TomTokenRefreshView,
                    TomTokenVerifyView)

router = routers.DefaultRouter()


# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    # path('helpers/'),
    re_path(r'^o/(?P<provider>\S+)/$',
            TomProviderAuthView.as_view(), name="o_auth"),
    path("jwt/create/", TomTokenObtainPairView.as_view()),
    path("jwt/refresh/", TomTokenRefreshView.as_view()),
    path("jwt/verify/", TomTokenVerifyView.as_view()),
    path("logout/", LogoutView.as_view(), name="Logout"),
    path("tags/", TagsView.as_view(), name="tags"),
    path("tags/<int:pk>/", TagsDetailView.as_view(),),
]
