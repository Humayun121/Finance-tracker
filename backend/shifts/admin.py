from django.contrib import admin

from .models import Shift


@admin.register(Shift)
class ShiftAdmin(admin.ModelAdmin):
    list_display = (
        "date",
        "user",
        "start_time",
        "end_time",
        "break_minutes",
        "hourly_rate",
        "paid_hours",
        "estimated_pay",
    )
    list_filter = ("user",)
    date_hierarchy = "date"
    list_select_related = ("user",)
