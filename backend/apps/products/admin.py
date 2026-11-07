from django.contrib import admin
from .models import Merchant, AffiliateProduct

@admin.register(Merchant)
class MerchantAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'website_url')
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(AffiliateProduct)
class AffiliateProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'merchant', 'price', 'currency', 'rating', 'availability', 'is_featured', 'created_at')
    list_filter = ('merchant', 'category', 'is_featured', 'availability')
    search_fields = ('name', 'brand', 'description', 'short_description')
    prepopulated_fields = {'slug': ('name',)}
    filter_horizontal = ('tags',)
