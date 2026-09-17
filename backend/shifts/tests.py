import pytest
from django.contrib.auth.models import User
from .models import Shift

@pytest.mark.django_db
def test_shift_list_requires_auth_401(client):
    response = client.get("/api/shifts/")

    assert response.status_code == 401

@pytest.mark.django_db
def test_shift_create_success_201(auth_client, user):
    response = auth_client.post(
        "/api/shifts/",
        {"date": "2026-09-17",
         "start_time": "12:00:00",
         "end_time": "16:00:00",
         "break_minutes": 30,
         "hourly_rate": "14.90"
        },
        format="json"
    )
    
    assert response.status_code == 201
    assert Shift.objects.count() == 1

    shift = Shift.objects.get()
    assert shift.user == user

@pytest.mark.django_db
def test_shift_end_time_before_start_time_400(auth_client):
    payload = {
        "date": "2026-09-17",
        "start_time": "16:00:00",
        "end_time": "12:00:00",
        "break_minutes": 30,
        "hourly_rate": "14.90",
    }

    response = auth_client.post(
        "/api/shifts/",
        payload,
        format="json",
    )

    assert response.status_code == 400
    assert Shift.objects.count() == 0

@pytest.mark.django_db
def test_shift_list_only_returns_users_shifts(auth_client, user):
    other_user = User.objects.create_user(
        username="otheruser",
        password="StrongPass123",
    )

    Shift.objects.create(
        user=user,
        date="2026-09-17",
        start_time="12:00:00",
        end_time="16:00:00",
        break_minutes=30,
        hourly_rate="14.90",
    )

    Shift.objects.create(
        user=other_user,
        date="2026-09-18",
        start_time="10:00:00",
        end_time="17:00:00",
        break_minutes=30,
        hourly_rate="14.90",
    )

    response = auth_client.get("/api/shifts/")

    assert response.status_code == 200
    assert len(response.data) == 1