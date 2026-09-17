from rest_framework import serializers

from .models import Shift


class ShiftSerializer(serializers.ModelSerializer):

    paid_hours = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True,
    )

    estimated_pay = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True,
    )

    class Meta:
        model = Shift
        fields = [
            "id",
            "date",
            "start_time",
            "end_time",
            "break_minutes",
            "hourly_rate",
            "paid_hours",
            "estimated_pay",
        ]

    def validate(self, data):
        start_time = data["start_time"]
        end_time = data["end_time"]

        if end_time <= start_time:
            raise serializers.ValidationError("End time must be after start time")

        return data
