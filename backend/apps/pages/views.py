from rest_framework import viewsets, permissions
from .models import Page
from .serializers import PageSerializer

class PageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Page.objects.filter(status='published')
    serializer_class = PageSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
    search_fields = ['title', 'content']
