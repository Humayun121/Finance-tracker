from django.contrib import admin

from .models import Category, Expense


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "user")
    list_filter = ("user",)
    search_fields = ("name",)


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ("date", "user", "category", "amount", "description")
    list_filter = ("user", "category")
    search_fields = ("description",)
    date_hierarchy = "date"
    list_select_related = ("user", "category")
