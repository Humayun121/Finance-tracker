from django.urls import path
from rest_framework import routers

from .views import ExpenseViewSet, CategoryViewSet

router = routers.DefaultRouter()

router.register("expense", ExpenseViewSet, basename="expense")
router.register("category", CategoryViewSet, basename="category")


urlpatterns = router.urls


# urlpatterns = [
#     path("categories/", category_list),
#     path("expenses/", expense_list, name="expense-list"),
# ]
