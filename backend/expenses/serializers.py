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

    def validate_category(self, category):
        user = self.context["request"].user

        if category.user != user:
            raise serializers.ValidationError(
                "You can only access your own categories"
            )
        
        return category 
