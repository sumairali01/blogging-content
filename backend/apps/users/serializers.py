from rest_framework import serializers
from .models import Author

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['id', 'name', 'slug', 'profile_image', 'bio', 'website', 'social_links', 'created_at', 'updated_at']
