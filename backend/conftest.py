"""
Global pytest configuration and fixtures for NCU TOM backend testing.

This file contains shared fixtures and configuration that can be used
across all test modules in the project.
"""

import pytest
from django.contrib.auth import get_user_model
from django.test import Client
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token

User = get_user_model()


# ============================================================================
# Database and Django Setup
# ============================================================================

# Remove autouse database access - let tests opt-in with markers or fixtures
# This prevents database connection issues for pure unit tests


@pytest.fixture(scope='session')
def django_db_setup():
    """
    Custom database setup for testing.
    Database configuration is handled in test_settings.py
    """
    # Any additional setup can go here if needed
    pass


# ============================================================================
# User Fixtures
# ============================================================================

@pytest.fixture
def user():
    """Create a regular user for testing."""
    return User.objects.create_user(
        email='test@example.com',  # Email is required first
        username='testuser',
        password='testpass123',
        role=User.roles.USER,
        institute='Test Institute',
        first_name='Test',
        last_name='User',
        is_active=True  # Make sure user is active
    )


@pytest.fixture
def admin_user():
    """Create an admin user for testing."""
    return User.objects.create_user(
        email='admin@example.com',  # Email is required first
        username='admin',
        password='adminpass123',
        role=User.roles.ADMIN,
        institute='Admin Institute',
        first_name='Admin',
        last_name='User',
        is_staff=True,
        is_superuser=True,
        is_active=True
    )


@pytest.fixture
def faculty_user():
    """Create a faculty user for testing."""
    return User.objects.create_user(
        email='faculty@example.com',  # Email is required first
        username='faculty',
        password='facultypass123', 
        role=User.roles.FACULTY,
        institute='Faculty Institute',
        first_name='Faculty',
        last_name='User',
        is_active=True
    )


# ============================================================================
# Client Fixtures  
# ============================================================================

@pytest.fixture
def client():
    """Django test client."""
    return Client()


@pytest.fixture  
def api_client():
    """DRF API test client."""
    return APIClient()


@pytest.fixture
def authenticated_client(api_client, user):
    """API client authenticated as regular user."""
    api_client.force_authenticate(user=user)
    return api_client


@pytest.fixture
def admin_client(api_client, admin_user):
    """API client authenticated as admin user.""" 
    api_client.force_authenticate(user=admin_user)
    return api_client


@pytest.fixture
def faculty_client(api_client, faculty_user):
    """API client authenticated as faculty user."""
    api_client.force_authenticate(user=faculty_user)
    return api_client


# ============================================================================
# Authentication Fixtures
# ============================================================================

@pytest.fixture
def user_token(user):
    """Create authentication token for user."""
    token, created = Token.objects.get_or_create(user=user)
    return token


@pytest.fixture
def admin_token(admin_user):
    """Create authentication token for admin user."""
    token, created = Token.objects.get_or_create(user=admin_user)
    return token


# ============================================================================
# Utility Fixtures
# ============================================================================

@pytest.fixture
def mock_settings(settings):
    """Fixture to easily override Django settings in tests."""
    return settings


@pytest.fixture(autouse=True)
def setup_test_environment(settings):
    """
    Automatically configure settings for testing environment.
    This fixture runs for every test.
    """
    # Disable caching during tests
    settings.CACHES = {
        'default': {
            'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
        }
    }
    
    # Use in-memory email backend for testing
    settings.EMAIL_BACKEND = 'django.core.mail.backends.locmem.EmailBackend'
    
    # Disable external API calls by default (can be overridden in specific tests)
    settings.TESTING = True


# ============================================================================
# Test Data Utilities
# ============================================================================

@pytest.fixture
def sample_coordinates():
    """Sample astronomical coordinates for testing."""
    return {
        'valid': [
            {'ra': 0, 'dec': 0},
            {'ra': 180, 'dec': 45},  
            {'ra': 360, 'dec': 90},
            {'ra': 123.456789, 'dec': -67.890123}
        ],
        'invalid': [
            {'ra': 361, 'dec': 45},  # RA > 360
            {'ra': -1, 'dec': 45},   # RA < 0
            {'ra': 180, 'dec': 91},  # Dec > 90
            {'ra': 180, 'dec': -91}  # Dec < -90
        ]
    }


@pytest.fixture
def sample_observation_dates():
    """Sample dates for observation testing."""
    from datetime import datetime, timedelta
    from django.utils import timezone
    
    now = timezone.now()
    return {
        'future_start': now + timedelta(days=1),
        'future_end': now + timedelta(days=2),
        'past_start': now - timedelta(days=2), 
        'past_end': now - timedelta(days=1),
        'invalid_end': now + timedelta(hours=1),  # End before start
    }