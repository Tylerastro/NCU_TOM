from drf_spectacular.views import (SpectacularAPIView, SpectacularRedocView,
                                   SpectacularSwaggerView)
from django.urls import path, re_path
from rest_framework import routers

from .views import (AnnouncementsView, EditUserRole, LogoutView,
                    TagsDetailView, TagsView, TomProviderAuthView,
                    TomTokenObtainPairView, TomTokenRefreshView,
                    TomTokenVerifyView, UserView)

router = routers.DefaultRouter()


# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    re_path(r'^o/(?P<provider>\S+)/$',
            TomProviderAuthView.as_view(), name="o_auth"),
    path("jwt/create/", TomTokenObtainPairView.as_view()),
    path("jwt/refresh/", TomTokenRefreshView.as_view()),
    path("jwt/verify/", TomTokenVerifyView.as_view()),
    path("logout/", LogoutView.as_view(), name="Logout"),
    path("tags/", TagsView.as_view(), name="tags"),
    path("announcements/", AnnouncementsView.as_view(), name="announcements"),
    path("tags/<int:pk>/", TagsDetailView.as_view(),),
    path("list/users/", UserView.as_view()),
    path("user/<int:pk>/", EditUserRole),
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('schema/swagger-ui/',
         SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
