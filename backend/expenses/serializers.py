from rest_framework import serializers 
from .models import Category

class CategorySerializer(serializers.ModelSerializer):
    """
    Serialise Category model instances into JSON format.
    Only gives the id and name field
    """
    class Meta:
        model = Category
        fields = ["id", "name"]