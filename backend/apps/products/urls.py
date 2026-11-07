from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MerchantViewSet, AffiliateProductViewSet

router = DefaultRouter()
router.register(r'merchants', MerchantViewSet, basename='merchant')
router.register(r'products', AffiliateProductViewSet, basename='product')

urlpatterns = [
    path('', include(router.urls)),
]
