import pytest
from django.contrib.auth.models import User

from .models import Category, Expense


@pytest.fixture
def category(user):
    return Category.objects.create(user=user, name="Groceries")


@pytest.mark.django_db
def test_category_create_success_201(auth_client):
    """
    Function checks that an authenticated user can create a category,
    returning HTTP 201
    """
    response = auth_client.post("/api/categories/", {"name": "Groceries"}, format="json")

    assert response.status_code == 201
    assert Category.objects.count() == 1


@pytest.mark.django_db
def test_category_create_requires_auth_401(client):
    """
    Function checks that creating a category while unauthenticated
    returns HTTP 401
    """
    response = client.post("/api/categories/", {"name": "Groceries"}, format="json")

    assert response.status_code == 401


@pytest.mark.django_db
def test_expense_create_success_201(auth_client, category):
    """
    Function checks that an authenticated user can create an expense with
    valid data, returning HTTP 201
    """
    payload = {
        "amount": "42.50",
        "category": category.id,
        "description": "Weekly shop",
        "date": "2026-08-01T12:00:00Z",
    }

    response = auth_client.post("/api/expenses/", payload, format="json")

    assert response.status_code == 201
    assert Expense.objects.count() == 1


@pytest.mark.django_db
def test_expense_create_other_users_category_400(auth_client):
    """
    Function checks that creating an expense against a category owned by
    another user returns HTTP 400
    """
    other_user = User.objects.create_user(username="otheruser", password="StrongPass123")
    other_category = Category.objects.create(user=other_user, name="Other")

    payload = {
        "amount": "10.00",
        "category": other_category.id,
        "description": "Not allowed",
        "date": "2026-08-01T12:00:00Z",
    }

    response = auth_client.post("/api/expenses/", payload, format="json")

    assert response.status_code == 400


@pytest.mark.django_db
def test_expense_list_filters_by_category(auth_client, category):
    """
    Function checks that listing expenses filtered by category only
    returns expenses in that category
    """
    other_category = Category.objects.create(user=category.user, name="Other")
    Expense.objects.create(
        user=category.user, amount=10, category=category, date="2026-08-01T12:00:00Z"
    )
    Expense.objects.create(
        user=category.user, amount=20, category=other_category, date="2026-08-01T12:00:00Z"
    )

    response = auth_client.get(f"/api/expenses/?category={category.id}")

    assert response.status_code == 200
    assert len(response.data) == 1
