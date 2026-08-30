import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient


@pytest.fixture
def client():
    """
    Override pytest-django's default client with DRF's APIClient so tests
    can post with format="json" and use force_authenticate.
    """
    return APIClient()


@pytest.fixture
def user(db):
    return User.objects.create_user(
        username="testuser", email="testuser@example.com", password="StrongPass123"
    )


@pytest.fixture
def auth_client(client, user):
    client.force_authenticate(user=user)
    return client
