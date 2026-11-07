from rest_framework import serializers
from django.utils.text import slugify
from .models import Merchant, AffiliateProduct
from apps.categories.serializers import CategorySerializer
from apps.tags.serializers import TagSerializer

class MerchantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Merchant
        fields = ['id', 'name', 'slug', 'logo', 'website_url']
        extra_kwargs = {'slug': {'required': False}}

    def validate_slug(self, value):
        if not value and self.initial_data.get('name'):
            return slugify(self.initial_data['name'])
        return value

class AffiliateProductSerializer(serializers.ModelSerializer):
    merchant_detail = MerchantSerializer(source='merchant', read_only=True)
    category_detail = CategorySerializer(source='category', read_only=True)
    tags_detail = TagSerializer(source='tags', many=True, read_only=True)
    display_image = serializers.CharField(source='get_image', read_only=True)

    class Meta:
        model = AffiliateProduct
        fields = [
            'id', 'name', 'slug', 'brand', 'description', 'short_description',
            'product_image', 'image_url_fallback', 'display_image', 'gallery_images',
            'affiliate_url', 'merchant', 'merchant_detail', 'price', 'currency',
            'rating', 'review_count', 'pros', 'cons', 'category', 'category_detail',
            'tags', 'tags_detail', 'availability', 'cta_text', 'badge', 'review_url', 'disclosure',
            'seo_title', 'seo_description', 'is_featured', 'created_at', 'updated_at'
        ]
        extra_kwargs = {'slug': {'required': False}}

    def validate_slug(self, value):
        if not value and self.initial_data.get('name'):
            return slugify(self.initial_data['name'])
        return value
