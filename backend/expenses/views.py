from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Expense
from .serializers import ExpenseSerializer

# @api_view(["GET","POST"])
# def category_list(request):
#     """
#     List all categories or create a new category
#     """
#     if request.method == "GET":
#         categories = Category.objects.all()
#         serializer = CategorySerializer(categories, many=True)
#         return Response(serializer.data)
    
#     if request.method == "POST":
#         serializer = CategorySerializer(data=request.data)
        
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status= status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @api_view(["GET", "PUT"])
# def expense_list(request):
#     if request.method == "GET":
#         expenses = Expense.objects.all()
#         serializer = ExpenseSerializer(expenses, many=True)
#         return Response(serializer.data)
    
#     if request.method == "POST":
#         serializer = ExpenseSerializer(data=request.data)

#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status = status.HTTP_201_CREATED)
#         return Response(serializer.error, status = status.HTTP_400_BAD_REQUEST)
    
class ExpenseViewSet(ModelViewSet):
    model = Expense
    serializer_class = ExpenseSerializer
    queryset = Expense.objects.all()
