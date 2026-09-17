from decimal import Decimal

from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from .models import Shift
from .serializers import ShiftSerializer


class ShiftViewSet(ModelViewSet):

    serializer_class = ShiftSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Shift.objects.filter(user=self.request.user)

        start_date = self.request.query_params.get("start_date")
        end_date = self.request.query_params.get("end_date")

        if start_date:
            queryset = queryset.filter(date__gte=start_date)

        if end_date:
            queryset = queryset.filter(date__lte=end_date)

        return queryset
    
    @action(detail=False, methods=["get"])
    def summary(self, request):
        shifts = self.get_queryset()

        total_shifts = shifts.count()
        total_hours = Decimal("0")
        total_pay = Decimal("0")

        for shift in shifts:
            total_hours += shift.paid_hours
            total_pay += shift.estimated_pay

        return Response(
            {
                "total_shifts": total_shifts,
                "total_hours": total_hours,
                "estimated_gross_pay": total_pay,
            }
        )
    
    @action(detail=False, methods=["get"])
    def defaults(self, request):
        latest_shift = Shift.objects.filter(
            user=request.user
        ).order_by("-id").first()

        if latest_shift:
            hourly_rate = latest_shift.hourly_rate
        else:
            hourly_rate = None

        return Response(
            {
                "hourly_rate": hourly_rate,
            }
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
