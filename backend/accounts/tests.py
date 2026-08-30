import pytest
from django.contrib.auth.models import User


def valid_user_payload():
    return {
        "username": "newuser",
        "email": "newuser@example.com",
        "password": "StrongPass123",
    }


@pytest.mark.django_db
def test_register_success_201(client):
    """
    Function checks if a user is created successfully and returns HTTP 201
    """
    response = client.post("/api/register/", valid_user_payload(), format="json")

    assert response.status_code == 201
    assert User.objects.filter(username="newuser").count() == 1


@pytest.mark.django_db
def test_register_duplicate_email_400(client):
    """
    Function checks that registering with an email already in use
    returns HTTP 400
    """
    client.post("/api/register/", valid_user_payload(), format="json")
    response = client.post("/api/register/", valid_user_payload(), format="json")

    assert response.status_code == 400


@pytest.mark.django_db
def test_register_weak_password_400(client):
    """
    Function checks that registering with a password failing validation
    returns HTTP 400
    """
    payload = valid_user_payload()
    payload["password"] = "123"

    response = client.post("/api/register/", payload, format="json")

    assert response.status_code == 400
