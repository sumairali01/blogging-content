from django.contrib import admin
from .models import Author

@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'website', 'created_at')
    search_fields = ('name', 'bio', 'slug')
    prepopulated_fields = {'slug': ('name',)}
