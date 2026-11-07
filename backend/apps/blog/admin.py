from django.contrib import admin
from .models import BlogPost

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'category', 'post_type', 'status', 'is_featured', 'published_at', 'views')
    list_filter = ('status', 'post_type', 'is_featured', 'category', 'author')
    search_fields = ('title', 'excerpt', 'content', 'slug')
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ('tags', 'affiliate_products', 'manual_related_posts')
    readonly_fields = ('views', 'reading_time', 'created_at', 'updated_at')
    fieldsets = (
        ('Article Content', {
            'fields': ('title', 'slug', 'excerpt', 'content', 'post_type', 'featured_image', 'image_url_fallback', 'author', 'category', 'tags')
        }),
        ('Affiliate Products & Relations', {
            'fields': ('affiliate_products', 'faqs', 'manual_related_posts')
        }),
        ('Publishing & Status', {
            'fields': ('status', 'is_featured', 'published_at', 'reading_time', 'views')
        }),
        ('SEO Metadata', {
            'fields': ('meta_title', 'meta_description', 'canonical_url')
        }),
    )
