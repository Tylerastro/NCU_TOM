"""Tests for the targets app: Target model, serializers, and CRUD API."""

import pytest
from django.db import IntegrityError
from rest_framework import status


# ============================================================================
# Model Tests
# ============================================================================


@pytest.mark.django_db
class TestTargetModel:
    def test_create_target(self, sample_target):
        assert sample_target.name == "M31"
        assert sample_target.ra == 10.6847
        assert sample_target.dec == 41.2687

    def test_target_str(self, sample_target):
        assert str(sample_target) == "M31"

    def test_coordinates_property(self, sample_target):
        coords = sample_target.coordinates
        assert isinstance(coords, str)
        assert " " in coords  # "ra_str dec_str"

    def test_soft_delete(self, sample_target):
        sample_target.delete()
        assert sample_target.deleted_at is not None
        assert sample_target.is_deleted is True

    def test_unique_name_per_user(self, user):
        from targets.models import Target

        Target.objects.create(name="NGC1", ra=10.0, dec=20.0, user=user)
        with pytest.raises(IntegrityError):
            Target.objects.create(name="NGC1", ra=15.0, dec=25.0, user=user)

    def test_different_users_same_name(self, user, admin_user):
        from targets.models import Target

        t1 = Target.objects.create(name="NGC1", ra=10.0, dec=20.0, user=user)
        t2 = Target.objects.create(name="NGC1", ra=10.0, dec=20.0, user=admin_user)
        assert t1.name == t2.name
        assert t1.user != t2.user


# ============================================================================
# Serializer Tests
# ============================================================================


@pytest.mark.django_db
class TestTargetSerializers:
    def test_target_get_serializer_output_shape(self, sample_target):
        from targets.serializers import TargetGetSerializer

        data = TargetGetSerializer(sample_target).data
        assert "id" in data
        assert "name" in data
        assert "ra" in data
        assert "dec" in data
        assert "coordinates" in data
        assert "user" in data

    def test_target_post_serializer_valid_data(self, user, rf):
        from targets.serializers import TargetPostSerializer

        request = rf.post("/api/targets/")
        request.user = user
        serializer = TargetPostSerializer(
            data={"name": "M42", "ra": 83.8221, "dec": -5.3911},
            context={"request": request},
        )
        assert serializer.is_valid(), serializer.errors

    def test_target_post_serializer_invalid_ra(self, user, rf):
        from targets.serializers import TargetPostSerializer

        request = rf.post("/api/targets/")
        request.user = user
        serializer = TargetPostSerializer(
            data={"name": "Bad", "ra": 400.0, "dec": 0.0},
            context={"request": request},
        )
        assert not serializer.is_valid()


# ============================================================================
# API Tests
# ============================================================================


@pytest.mark.django_db
class TestTargetsAPI:
    def test_unauthenticated_rejected(self, api_client):
        response = api_client.get("/api/targets/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_list_targets(self, authenticated_client, sample_target):
        response = authenticated_client.get("/api/targets/")
        assert response.status_code == status.HTTP_200_OK

    def test_create_target(self, authenticated_client):
        response = authenticated_client.post(
            "/api/targets/",
            {"name": "M42", "ra": 83.8221, "dec": -5.3911},
            format="json",
        )
        assert response.status_code == status.HTTP_201_CREATED

    def test_retrieve_target(self, authenticated_client, sample_target):
        response = authenticated_client.get(f"/api/targets/{sample_target.pk}/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["name"] == "M31"

    def test_delete_target(self, authenticated_client, sample_target):
        response = authenticated_client.delete(
            "/api/targets/",
            {"target_ids": [sample_target.pk]},
            format="json",
        )
        assert response.status_code == status.HTTP_200_OK
