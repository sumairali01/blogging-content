from django.contrib import admin
from .models import NewsletterSubscriber

@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display = ('email', 'status', 'source', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('email', 'source')
    readonly_fields = ('created_at', 'updated_at')
    actions = ['mark_unsubscribed']

    def mark_unsubscribed(self, request, queryset):
        queryset.update(status='unsubscribed')
    mark_unsubscribed.short_description = "Mark selected as Unsubscribed"
