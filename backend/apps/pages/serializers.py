from rest_framework import serializers
from .models import Page

class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = ['id', 'title', 'slug', 'content', 'featured_image', 'status', 'meta_title', 'meta_description', 'created_at', 'updated_at']
