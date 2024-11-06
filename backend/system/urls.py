from django.urls import path, re_path
from drf_spectacular.views import (SpectacularAPIView, SpectacularRedocView,
                                   SpectacularSwaggerView)

from .views import (EditUserRole, LogoutView, TomProviderAuthView,
                    TomTokenObtainPairView, TomTokenRefreshView,
                    TomTokenVerifyView, UserDetailView, UserView)

urlpatterns = [
    re_path(r'^o/(?P<provider>\S+)/$',
            TomProviderAuthView.as_view(), name="o_auth"),
    path("jwt/create/", TomTokenObtainPairView.as_view()),
    path("jwt/refresh/", TomTokenRefreshView.as_view()),
    path("jwt/verify/", TomTokenVerifyView.as_view()),
    path("logout/", LogoutView.as_view(), name="Logout"),
    path("list/users/", UserView.as_view()),
    path("user/<int:pk>/", EditUserRole),
    path("user/<int:pk>/edit/", UserDetailView.as_view()),
    path("user/<int:pk>/delete/", UserDetailView.as_view()),
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('schema/swagger-ui/',
         SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
