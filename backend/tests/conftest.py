"""Shared pytest fixtures for the NCU TOM backend test suite."""

import os
from datetime import timedelta

import pytest
from django.utils import timezone
from rest_framework.test import APIClient

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "tom.settings")
os.environ.setdefault("ENGINE", "django.db.backends.sqlite3")


# ============================================================================
# Settings Override
# ============================================================================


@pytest.fixture(autouse=True)
def _jwt_test_settings(settings):
    """Ensure SIMPLE_JWT has a valid signing key for tests."""
    settings.SIMPLE_JWT = {
        **settings.SIMPLE_JWT,
        "SIGNING_KEY": settings.SECRET_KEY,
        "ALGORITHM": "HS256",
    }


# ============================================================================
# User Fixtures
# ============================================================================


@pytest.fixture
def user(db):
    from system.models import User

    return User.objects.create_user(
        email="test@example.com",
        password="testpass123",
        username="testuser",
        first_name="Test",
        last_name="User",
        institute="NCU",
        role=User.Roles.USER,
        is_active=True,
    )


@pytest.fixture
def admin_user(db):
    from system.models import User

    return User.objects.create_user(
        email="admin@example.com",
        password="adminpass123",
        username="adminuser",
        first_name="Admin",
        last_name="User",
        institute="NCU",
        role=User.Roles.ADMIN,
        is_active=True,
    )


@pytest.fixture
def faculty_user(db):
    from system.models import User

    return User.objects.create_user(
        email="faculty@example.com",
        password="facultypass123",
        username="facultyuser",
        first_name="Faculty",
        last_name="User",
        institute="NCU",
        role=User.Roles.FACULTY,
        is_active=True,
    )


@pytest.fixture
def inactive_user(db):
    from system.models import User

    return User.objects.create_user(
        email="inactive@example.com",
        password="inactivepass123",
        username="inactiveuser",
        first_name="Inactive",
        last_name="User",
        institute="NCU",
        role=User.Roles.USER,
        is_active=False,
    )


# ============================================================================
# Client Fixtures
# ============================================================================


def _make_authenticated_client(user_obj):
    """Create an APIClient with JWT Bearer auth for the given user."""
    from rest_framework_simplejwt.tokens import RefreshToken

    client = APIClient()
    refresh = RefreshToken.for_user(user_obj)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
    return client


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def authenticated_client(user):
    return _make_authenticated_client(user)


@pytest.fixture
def admin_client(admin_user):
    return _make_authenticated_client(admin_user)


@pytest.fixture
def faculty_client(faculty_user):
    return _make_authenticated_client(faculty_user)


# ============================================================================
# Model Factory Fixtures
# ============================================================================


@pytest.fixture
def sample_target(user):
    from targets.models import Target

    return Target.objects.create(
        name="M31",
        ra=10.6847,
        dec=41.2687,
        user=user,
    )


@pytest.fixture
def sample_observation(user, sample_target):
    from observations.models import Observation

    now = timezone.now()
    obs = Observation.objects.create(
        user=user,
        start_date=now + timedelta(days=1),
        end_date=now + timedelta(days=2),
        status=Observation.statuses.PREP,
    )
    obs.targets.add(sample_target)
    return obs


@pytest.fixture
def sample_tag(user):
    from helpers.models import Tags

    return Tags.objects.create(name="galaxy", user=user)


@pytest.fixture
def sample_comment(user):
    from helpers.models import Comments

    return Comments.objects.create(context="Test comment content", user=user)


@pytest.fixture
def sample_announcement(admin_user):
    from helpers.models import Announcement

    return Announcement.objects.create(
        title="Test Announcement",
        context="This is a test announcement.",
        type=Announcement.types.INFO,
        user=admin_user,
    )


# ============================================================================
# Data Helper Fixtures (no DB)
# ============================================================================


@pytest.fixture
def sample_coordinates():
    return {
        "valid": [
            {"ra": 0, "dec": 0},
            {"ra": 180, "dec": 45},
            {"ra": 360, "dec": 90},
            {"ra": 10.6847, "dec": -41.2687},
        ],
        "invalid": [
            {"ra": -1, "dec": 0},
            {"ra": 361, "dec": 0},
            {"ra": 180, "dec": 91},
            {"ra": 180, "dec": -91},
        ],
    }


@pytest.fixture
def sample_observation_dates():
    now = timezone.now()
    return {
        "future_start": now + timedelta(days=1),
        "future_end": now + timedelta(days=2),
        "past_start": now - timedelta(days=2),
        "past_end": now - timedelta(days=1),
    }
