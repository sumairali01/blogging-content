from rest_framework import serializers
from .models import BlogPost
from apps.users.models import Author
from apps.categories.models import Category
from apps.tags.models import Tag
from apps.products.models import AffiliateProduct
from apps.users.serializers import AuthorSerializer
from apps.categories.serializers import CategorySerializer
from apps.tags.serializers import TagSerializer
from apps.products.serializers import AffiliateProductSerializer

class BlogPostListSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    display_image = serializers.CharField(source='get_image', read_only=True)

    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'excerpt', 'featured_image', 'image_url_fallback', 'display_image',
            'author', 'category', 'tags', 'post_type', 'status', 'published_at',
            'is_featured', 'reading_time', 'views'
        ]

class BlogPostDetailSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    affiliate_products = AffiliateProductSerializer(many=True, read_only=True)
    manual_related_posts = BlogPostListSerializer(many=True, read_only=True)
    display_image = serializers.CharField(source='get_image', read_only=True)

    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'excerpt', 'content', 'featured_image', 'image_url_fallback', 'display_image',
            'author', 'category', 'tags', 'affiliate_products', 'post_type', 'status',
            'published_at', 'created_at', 'updated_at', 'is_featured',
            'meta_title', 'meta_description', 'canonical_url', 'reading_time',
            'views', 'faqs', 'manual_related_posts'
        ]

class BlogPostAdminSerializer(serializers.ModelSerializer):
    author_detail = AuthorSerializer(source='author', read_only=True)
    category_detail = CategorySerializer(source='category', read_only=True)
    tags_detail = TagSerializer(source='tags', many=True, read_only=True)
    affiliate_products_detail = AffiliateProductSerializer(source='affiliate_products', many=True, read_only=True)
    display_image = serializers.CharField(source='get_image', read_only=True)

    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'excerpt', 'content', 'featured_image', 'image_url_fallback', 'display_image',
            'author', 'author_detail', 'category', 'category_detail', 'tags', 'tags_detail',
            'affiliate_products', 'affiliate_products_detail', 'post_type', 'status',
            'published_at', 'created_at', 'updated_at', 'is_featured',
            'meta_title', 'meta_description', 'canonical_url', 'reading_time',
            'views', 'faqs', 'manual_related_posts'
        ]
        extra_kwargs = {
            'slug': {'required': False},
            'author': {'required': False, 'allow_null': True},
            'category': {'required': False, 'allow_null': True},
        }

    def validate_slug(self, value):
        if not value and self.initial_data.get('title'):
            from django.utils.text import slugify
            value = slugify(self.initial_data['title'])
        return value
