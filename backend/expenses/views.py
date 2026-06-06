from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from django.utils.dateparse import parse_date

from .models import Category, Expense
from .serializers import CategorySerializer, ExpenseSerializer

class ExpenseViewSet(ModelViewSet):
    """
    ViewSet for managing Expense CRUD operations.
    Supports filtering by catgeory and date range.
    """

    model = Expense
    serializer_class = ExpenseSerializer
    
    def get_queryset(self):
        queryset = Expense.objects.filter(
            user = self.request.user
        )
        category_id = self.request.query_params.get("category")

        # Category filter
        if category_id:
            queryset = queryset.filter(category_id = category_id)

        # Date filter
        start_date = self.request.query_params.get("start_date")
        end_date = self.request.query_params.get("end_date")

        if start_date:
            queryset = queryset.filter(date__gte= parse_date(start_date))
              
        if end_date:
            queryset = queryset.filter(date__lte=parse_date(end_date))


        
        return queryset


class CategoryViewSet(ModelViewSet):
    model = Category
    serializer_class = CategorySerializer
    queryset = Category.objects.all()

def expense_demo(request):
    """
    Demo page for showing how the Expense API can be consumed.
    """
    return render(request, "expenses/expenses_demo.html")