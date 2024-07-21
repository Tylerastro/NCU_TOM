from django.urls import path, re_path
from drf_spectacular.views import (SpectacularAPIView, SpectacularRedocView,
                                   SpectacularSwaggerView)
from rest_framework import routers

from .views import (AnnouncementsView, EditUserRole, LogoutView,
                    TagsDetailView, TagsView, TomProviderAuthView,
                    TomTokenObtainPairView, TomTokenRefreshView,
                    TomTokenVerifyView, UserDetailView, UserView)

router = routers.DefaultRouter()


urlpatterns = [
    re_path(r'^o/(?P<provider>\S+)/$',
            TomProviderAuthView.as_view(), name="o_auth"),
    path("jwt/create/", TomTokenObtainPairView.as_view()),
    path("jwt/refresh/", TomTokenRefreshView.as_view()),
    path("jwt/verify/", TomTokenVerifyView.as_view()),
    path("logout/", LogoutView.as_view(), name="Logout"),
    path("tags/", TagsView.as_view(), name="tags"),
    path("announcements/", AnnouncementsView.as_view(), name="announcements"),
    path("announcements/<int:pk>/edit/",
         AnnouncementsView.as_view(), name="announcements"),
    path("announcements/<int:pk>/delete/",
         AnnouncementsView.as_view(), name="announcements"),
    path("tags/<int:pk>/", TagsDetailView.as_view(),),
    path("list/users/", UserView.as_view()),
    path("user/<int:pk>/", EditUserRole),
    path("user/<int:pk>/edit/", UserDetailView.as_view()),
    path("user/<int:pk>/delete/", UserDetailView.as_view()),
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('schema/swagger-ui/',
         SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
