"""Tests for the observations app: Observation, LulinRun, and API endpoints."""

from datetime import timedelta

import pytest
from django.core.exceptions import ValidationError
from django.utils import timezone
from rest_framework import status


# ============================================================================
# Model Tests — Observation
# ============================================================================


@pytest.mark.django_db
class TestObservationModel:
    def test_create_observation_auto_name(self, sample_observation):
        assert len(sample_observation.name) == 8

    def test_observation_str(self, sample_observation):
        assert str(sample_observation) == sample_observation.name

    def test_default_status_prep(self, sample_observation):
        from observations.models import ObservationStatuses

        assert sample_observation.status == ObservationStatuses.PREP

    def test_target_count(self, sample_observation):
        assert sample_observation.target_count == 1

    def test_clean_validates_dates(self, user):
        from observations.models import Observation

        now = timezone.now()
        obs = Observation(
            user=user,
            start_date=now + timedelta(days=2),
            end_date=now + timedelta(days=1),
        )
        with pytest.raises(ValidationError, match="Start date must be before end date"):
            obs.clean()

    def test_soft_delete(self, sample_observation):
        sample_observation.delete()
        assert sample_observation.deleted_at is not None
        assert sample_observation.is_deleted is True


# ============================================================================
# Model Tests — LulinRun
# ============================================================================


@pytest.mark.django_db
class TestLulinRunModel:
    def test_create_lulin_run(self, sample_observation, sample_target):
        from observations.models import LulinRun

        run = LulinRun.objects.create(
            observation=sample_observation,
            target=sample_target,
            filter=LulinRun.Filters.up_Astrodon_2019,
            instrument=LulinRun.Instruments.LOT,
        )
        assert run.pk is not None
        assert run.filter == LulinRun.Filters.up_Astrodon_2019


# ============================================================================
# Serializer Tests
# ============================================================================


@pytest.mark.django_db
class TestObservationSerializers:
    def test_observation_get_serializer_output(self, sample_observation):
        from observations.serializers import ObservationGetSerializer

        data = ObservationGetSerializer(sample_observation).data
        assert "id" in data
        assert "name" in data
        assert "user" in data
        assert "targets" in data
        assert "start_date" in data
        assert "status" in data


# ============================================================================
# API Tests
# ============================================================================


@pytest.mark.django_db
class TestObservationsAPI:
    def test_unauthenticated_rejected(self, api_client):
        response = api_client.get("/api/observations/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_list_observations(self, authenticated_client, sample_observation):
        response = authenticated_client.get("/api/observations/")
        assert response.status_code == status.HTTP_200_OK

    def test_create_observation(self, authenticated_client, sample_target):
        now = timezone.now()
        response = authenticated_client.post(
            "/api/observations/",
            {
                "start_date": (now + timedelta(days=1)).isoformat(),
                "end_date": (now + timedelta(days=2)).isoformat(),
                "targets": [sample_target.pk],
            },
            format="json",
        )
        assert response.status_code == status.HTTP_201_CREATED

    def test_stats_endpoint_public(self, api_client):
        response = api_client.get("/api/observations/stats/")
        assert response.status_code == status.HTTP_200_OK

    def test_observatories_endpoint_public(self, api_client):
        response = api_client.get("/api/observatories/")
        assert response.status_code == status.HTTP_200_OK
