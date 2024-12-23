from allauth.socialaccount.views import ConnectionsView
from dj_rest_auth.jwt_auth import get_refresh_view
from dj_rest_auth.views import LoginView, LogoutView
from django.urls import path
from drf_spectacular.views import (SpectacularAPIView, SpectacularRedocView,
                                   SpectacularSwaggerView)
from rest_framework_simplejwt.views import TokenVerifyView
from system.views import (EditUser, GitHubLogin, GoogleLogin,
                          TOMUserDetailsView, UserDetailView, UserView)

urlpatterns = [
    # Authentication Routes
    path("login/", LoginView.as_view(), name="rest_login"),
    path("logout/", LogoutView.as_view(), name="rest_logout"),

    # Token Management Routes
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    path("token/refresh/", get_refresh_view().as_view(), name="token_refresh"),

    # OAuth Routes
    path("oauth/google/", GoogleLogin.as_view(), name="google_login"),
    path("oauth/github/", GitHubLogin.as_view(), name="github_login"),

    # User Management Routes
    path("user/", TOMUserDetailsView.as_view(), name="rest_user_details"),
    path("users/", UserView.as_view(), name="user_list"),
    path("user/link/", ConnectionsView.as_view(), name="user_connections"),

    # User-Specific Routes
    path("user/<int:pk>/", EditUser, name="user_profile"),
    path("user/<int:pk>/edit/", UserDetailView.as_view(), name="user_edit"),
    path("user/<int:pk>/delete/", UserDetailView.as_view(), name="user_delete"),

    # API Documentation Routes
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('schema/swagger-ui/',
         SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
