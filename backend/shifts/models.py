from django.contrib.auth.models import User
from django.db import models
from datetime import datetime, timedelta
from decimal import Decimal


class Shift(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="shifts")
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    break_minutes = models.PositiveIntegerField(default=0)
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2)

    @property
    def paid_hours(self):
        start = datetime.combine(self.date, self.start_time)
        end = datetime.combine(self.date, self.end_time)

        # An end time earlier than the start time crosses midnight
        # (an overnight shift), not an error.
        if end < start:
            end += timedelta(days=1)

        duration = end - start
        hours = Decimal(str(duration.total_seconds())) / Decimal("3600")
        break_hours = Decimal(self.break_minutes) / Decimal("60")

        return max(hours - break_hours, Decimal("0"))
    
    @property
    def estimated_pay(self):
        return self.paid_hours * self.hourly_rate
        

    def __str__(self):
        return f"{self.user.username} - {self.date}"
