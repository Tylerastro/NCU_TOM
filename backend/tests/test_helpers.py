"""Tests for the helpers app: Tags, Comments, Announcements, and SoftDelete."""

import pytest
from rest_framework import status


# ============================================================================
# Model Tests — Tags
# ============================================================================


@pytest.mark.django_db
class TestTagsModel:
    def test_create_tag(self, sample_tag):
        assert sample_tag.name == "galaxy"
        assert sample_tag.pk is not None

    def test_tag_belongs_to_user(self, sample_tag, user):
        assert sample_tag.user == user


# ============================================================================
# Model Tests — Comments
# ============================================================================


@pytest.mark.django_db
class TestCommentsModel:
    def test_create_comment(self, sample_comment):
        assert sample_comment.context == "Test comment content"
        assert sample_comment.pk is not None

    def test_soft_delete_comment(self, sample_comment):
        sample_comment.delete()
        assert sample_comment.deleted_at is not None
        assert sample_comment.is_deleted is True

    def test_restore_comment(self, sample_comment):
        sample_comment.delete()
        sample_comment.restore()
        assert sample_comment.deleted_at is None
        assert sample_comment.is_deleted is False


# ============================================================================
# Model Tests — Announcement
# ============================================================================


@pytest.mark.django_db
class TestAnnouncementModel:
    def test_create_announcement(self, sample_announcement):
        assert sample_announcement.title == "Test Announcement"
        assert sample_announcement.type == 1  # INFO

    def test_soft_delete_announcement(self, sample_announcement):
        sample_announcement.delete()
        assert sample_announcement.deleted_at is not None


# ============================================================================
# SoftDelete Base Tests
# ============================================================================


@pytest.mark.django_db
class TestSoftDeleteQuerySet:
    def test_alive_queryset(self, sample_comment):
        from helpers.models import Comments

        sample_comment.delete()
        # Default manager already filters soft-deleted; use .all() queryset method
        assert Comments.objects.filter(pk=sample_comment.pk).count() == 0

    def test_dead_queryset(self, sample_comment):
        from helpers.models import Comments

        sample_comment.delete()
        assert Comments.all_objects.filter(
            pk=sample_comment.pk, deleted_at__isnull=False
        ).count() == 1

    def test_hard_delete_permanent(self, sample_comment):
        from helpers.models import Comments

        pk = sample_comment.pk
        sample_comment.hard_delete()
        assert not Comments.all_objects.filter(pk=pk).exists()


# ============================================================================
# Serializer Tests
# ============================================================================


@pytest.mark.django_db
class TestHelperSerializers:
    def test_tags_serializer_valid(self, user, rf):
        from helpers.serializers import TagsSerializer

        request = rf.post("/api/tags/")
        request.user = user
        serializer = TagsSerializer(
            data={"name": "nebula"},
            context={"request": request},
        )
        assert serializer.is_valid(), serializer.errors

    def test_announcements_serializer_output(self, sample_announcement):
        from helpers.serializers import AnnouncementsSerializer

        data = AnnouncementsSerializer(sample_announcement).data
        assert "id" in data
        assert "title" in data
        assert "user" in data
        assert "type" in data


# ============================================================================
# API Tests
# ============================================================================


@pytest.mark.django_db
class TestHelpersAPI:
    def test_list_tags(self, authenticated_client, sample_tag):
        response = authenticated_client.get("/api/tags/")
        assert response.status_code == status.HTTP_200_OK

    def test_create_tag(self, authenticated_client):
        response = authenticated_client.post(
            "/api/tags/",
            {"name": "supernova"},
            format="json",
        )
        assert response.status_code == status.HTTP_201_CREATED

    def test_announcements_list_public(self, api_client, sample_announcement):
        response = api_client.get("/api/announcements/")
        assert response.status_code == status.HTTP_200_OK

    def test_regular_user_cannot_create_announcement(self, authenticated_client):
        response = authenticated_client.post(
            "/api/announcements/",
            {"title": "Hack", "context": "No access", "type": 1},
            format="json",
        )
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_admin_can_create_announcement(self, admin_client):
        response = admin_client.post(
            "/api/announcements/",
            {"title": "Outage Notice", "context": "Scheduled maintenance.", "type": 1},
            format="json",
        )
        assert response.status_code == status.HTTP_201_CREATED
