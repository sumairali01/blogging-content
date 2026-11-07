from rest_framework import serializers
from .models import Category

class CategorySerializer(serializers.ModelSerializer):
    post_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image', 'meta_title', 'meta_description', 'parent', 'post_count', 'created_at', 'updated_at']

    def get_post_count(self, obj):
        return obj.posts.filter(status='published').count()
