import pytest
from django.contrib.auth.models import User
from .models import Shift
from decimal import Decimal
from datetime import date, time

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
def test_shift_overnight_end_before_start_treated_as_next_day_201(auth_client):
    payload = {
        "date": "2026-09-17",
        "start_time": "22:00:00",
        "end_time": "06:00:00",
        "break_minutes": 30,
        "hourly_rate": "14.90",
    }

    response = auth_client.post(
        "/api/shifts/",
        payload,
        format="json",
    )

    assert response.status_code == 201
    assert Shift.objects.count() == 1
    assert Decimal(str(response.data["paid_hours"])) == Decimal("7.50")


@pytest.mark.django_db
def test_shift_overnight_paid_hours_wraps_past_midnight(user):
    shift = Shift.objects.create(
        user=user,
        date=date(2026, 9, 17),
        start_time=time(22, 0),
        end_time=time(6, 0),
        break_minutes=30,
        hourly_rate=Decimal("14.90"),
    )

    assert shift.paid_hours == Decimal("7.5")

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


@pytest.mark.django_db
def test_shift_calculates_hours_and_pay(user):
    shift = Shift.objects.create(
        user=user,
        date=date(2026, 9, 17),
        start_time=time(10, 0),
        end_time=time(17, 0),
        break_minutes=30,
        hourly_rate=Decimal("14.90"),
    )

    assert shift.paid_hours == Decimal("6.5")
    assert shift.estimated_pay == Decimal("96.850")

@pytest.mark.django_db
def test_shift_summary(auth_client, user):
    Shift.objects.create(
        user=user,
        date="2026-09-17",
        start_time="10:00:00",
        end_time="17:00:00",
        break_minutes=30,
        hourly_rate="14.90",
    )

    response = auth_client.get(
        "/api/shifts/summary/",
        {
            "start_date": "2026-09-01",
            "end_date": "2026-09-30",
        },
    )

    assert response.status_code == 200
    assert response.data["total_shifts"] == 1
    assert Decimal(str(response.data["total_hours"])) == Decimal("6.5")
    assert Decimal(str(response.data["estimated_gross_pay"])) == Decimal("96.850")

@pytest.mark.django_db
def test_shift_defaults_returns_latest_hourly_rate(auth_client, user):
    Shift.objects.create(
        user=user,
        date="2026-09-17",
        start_time="10:00:00",
        end_time="17:00:00",
        break_minutes=30,
        hourly_rate="14.90",
    )

    response = auth_client.get("/api/shifts/defaults/")

    assert response.status_code == 200
    assert Decimal(str(response.data["hourly_rate"])) == Decimal("14.90")