from django.urls import path
from .views import ExpenseViewSet
from rest_framework import routers

router = routers.DefaultRouter()

router.register("expense", ExpenseViewSet)

urlpatterns = router.urls


# urlpatterns = [
#     path("categories/", category_list),
#     path("expenses/", expense_list, name="expense-list"),
# ]