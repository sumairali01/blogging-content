from django.contrib import admin
from .models import Page

@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'status', 'updated_at')
    list_filter = ('status',)
    search_fields = ('title', 'content', 'slug')
    prepopulated_fields = {'slug': ('title',)}
