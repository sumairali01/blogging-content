from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Merchant, AffiliateProduct
from .serializers import MerchantSerializer, AffiliateProductSerializer

class MerchantViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Merchant.objects.all()
    serializer_class = MerchantSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

class AffiliateProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AffiliateProduct.objects.all().select_related('merchant', 'category').prefetch_related('tags')
    serializer_class = AffiliateProductSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__slug', 'tags__slug', 'merchant__slug', 'is_featured', 'brand']
    search_fields = ['name', 'brand', 'description', 'short_description']
    ordering_fields = ['rating', 'price', 'created_at', 'review_count']
