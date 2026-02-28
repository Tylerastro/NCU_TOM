"""Tests for the system app: User model, permissions, and auth API."""

from unittest.mock import Mock

import pytest
from rest_framework import status


# ============================================================================
# Model Tests
# ============================================================================


@pytest.mark.django_db
class TestUserModel:
    def test_create_user(self, user):
        assert user.username == "testuser"
        assert user.email == "test@example.com"
        assert user.is_active is True
        assert user.check_password("testpass123")

    def test_user_roles(self, user, admin_user, faculty_user):
        from system.models import User

        assert user.role == User.Roles.USER
        assert admin_user.role == User.Roles.ADMIN
        assert faculty_user.role == User.Roles.FACULTY

    def test_user_str(self, user):
        assert str(user) == "testuser"

    def test_soft_delete(self, user):
        user.delete()
        assert user.deleted_at is not None
        assert user.is_active is False

    def test_hard_delete(self, user):
        from system.models import User

        pk = user.pk
        user.hard_delete()
        assert not User.all_objects.filter(pk=pk).exists()

    def test_restore(self, user):
        user.delete()
        assert user.deleted_at is not None
        user.restore()
        assert user.deleted_at is None

    def test_create_user_without_email_raises(self):
        from system.models import User

        with pytest.raises(ValueError, match="email"):
            User.objects.create_user(email="", password="pass123", username="nomail")


# ============================================================================
# Permission Tests
# ============================================================================


class TestPermissions:
    def _make_request(self, user_obj):
        request = Mock()
        request.user = user_obj
        return request

    @pytest.mark.django_db
    def test_is_admin_allows_admin(self, admin_user):
        from system.permissions import IsAdmin

        perm = IsAdmin()
        request = self._make_request(admin_user)
        assert perm.has_permission(request, None) is True

    @pytest.mark.django_db
    def test_is_admin_denies_regular_user(self, user):
        from system.permissions import IsAdmin

        perm = IsAdmin()
        request = self._make_request(user)
        assert perm.has_permission(request, None) is False

    @pytest.mark.django_db
    def test_is_admin_or_faculty_allows_faculty(self, faculty_user):
        from system.permissions import IsAdminOrFaculty

        perm = IsAdminOrFaculty()
        request = self._make_request(faculty_user)
        assert perm.has_permission(request, None) is True

    @pytest.mark.django_db
    def test_is_activated_allows_active(self, user):
        from system.permissions import IsActivated

        perm = IsActivated()
        request = self._make_request(user)
        assert perm.has_permission(request, None) is True

    @pytest.mark.django_db
    def test_is_owner_or_admin_or_faculty(self, user, admin_user):
        from system.permissions import IsOwnerOrAdminOrFaculty

        perm = IsOwnerOrAdminOrFaculty()
        obj = Mock()
        obj.user = user

        # Owner can access
        request = self._make_request(user)
        assert perm.has_object_permission(request, None, obj) is True

        # Admin can access
        request = self._make_request(admin_user)
        assert perm.has_object_permission(request, None, obj) is True


# ============================================================================
# API Tests
# ============================================================================


@pytest.mark.django_db
class TestSystemAPI:
    def test_unauthenticated_user_detail_rejected(self, api_client):
        response = api_client.get("/api/user/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_authenticated_get_user_details(self, authenticated_client):
        response = authenticated_client.get("/api/user/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["username"] == "testuser"

    def test_admin_list_users(self, admin_client):
        response = admin_client.get("/api/users/")
        assert response.status_code == status.HTTP_200_OK

    def test_regular_user_list_users_forbidden(self, authenticated_client):
        response = authenticated_client.get("/api/users/")
        assert response.status_code == status.HTTP_403_FORBIDDEN
