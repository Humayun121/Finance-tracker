from rest_framework import serializers

from .models import Category, Expense


class CategorySerializer(serializers.ModelSerializer):
    """
    Serialise Category model instances into JSON format.
    Only gives the id and name field
    """

    class Meta:
        model = Category
        fields = ["id", "name"]


class ExpenseSerializer(serializers.ModelSerializer):
    """
    Serialises Expense model instances into JSON format
    """

    class Meta:
        model = Expense
        # field = ["id", "amount", "category", "description", "date"]
        fields = ["id", "amount", "category", "description", "date"]
        # fields = "__all__"
