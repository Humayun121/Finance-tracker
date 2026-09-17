from rest_framework import routers
from .views import ShiftViewSet

router = routers.DefaultRouter()

router.register("shifts", ShiftViewSet, basename="shift")

urlpatterns = router.urls
