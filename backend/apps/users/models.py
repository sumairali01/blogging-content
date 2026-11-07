from django.db import models
from django.contrib.auth.models import User

class Author(models.Model):
    user = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='author_profile')
    name = models.CharField(max_length=150)
    slug = models.SlugField(max_length=160, unique=True)
    profile_image = models.ImageField(upload_to='authors/', null=True, blank=True)
    bio = models.TextField(blank=True)
    website = models.URLField(blank=True)
    social_links = models.JSONField(default=dict, blank=True, help_text="Key-value mapping of social media platforms (e.g., {'pinterest': '...', 'twitter': '...'})")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name
