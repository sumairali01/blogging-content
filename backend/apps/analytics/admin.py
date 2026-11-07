from django.contrib import admin
from django.db.models import Count
from .models import AffiliateClick

@admin.register(AffiliateClick)
class AffiliateClickAdmin(admin.ModelAdmin):
    list_display = ('product_name', 'merchant_name', 'article_title', 'timestamp', 'ip_address')
    list_filter = ('timestamp', 'product__merchant', 'product__category')
    search_fields = ('product__name', 'product__brand', 'referrer', 'user_agent', 'article__title')
    readonly_fields = ('product', 'article', 'timestamp', 'referrer', 'user_agent', 'ip_address')
    date_hierarchy = 'timestamp'
    list_per_page = 50

    def product_name(self, obj):
        return obj.product.name if obj.product else "Deleted Product"
    product_name.short_description = "Product"

    def merchant_name(self, obj):
        if obj.product and obj.product.merchant:
            return obj.product.merchant.name
        return "Direct"
    merchant_name.short_description = "Merchant"

    def article_title(self, obj):
        return obj.article.title if obj.article else "(Direct Link)"
    article_title.short_description = "Referred From Article"

    def has_add_permission(self, request):
        return False  # Clicks are generated automatically by user redirects

