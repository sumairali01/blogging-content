from django.db import models
from django.utils import timezone
from apps.users.models import Author
from apps.categories.models import Category
from apps.tags.models import Tag
from apps.products.models import AffiliateProduct

class BlogPost(models.Model):
    POST_TYPES = (
        ('review', 'Product Review'),
        ('comparison', 'Product Comparison'),
        ('best-list', 'Best Products List'),
        ('buying-guide', 'Buying Guide'),
        ('informational', 'Informational Article'),
    )

    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('scheduled', 'Scheduled'),
    )

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=270, unique=True)
    excerpt = models.TextField(blank=True)
    content = models.TextField(help_text="Article main content with rich markup")
    featured_image = models.ImageField(upload_to='blog/', null=True, blank=True)
    image_url_fallback = models.URLField(blank=True, help_text="External image URL fallback")
    
    author = models.ForeignKey(Author, on_delete=models.SET_NULL, null=True, blank=True, related_name='posts')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='posts')
    tags = models.ManyToManyField(Tag, blank=True, related_name='posts')
    affiliate_products = models.ManyToManyField(AffiliateProduct, blank=True, related_name='blog_posts')
    
    post_type = models.CharField(max_length=50, choices=POST_TYPES, default='informational')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='published')
    
    published_at = models.DateTimeField(default=timezone.now, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    is_featured = models.BooleanField(default=False)
    
    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.TextField(blank=True)
    canonical_url = models.URLField(blank=True)
    
    reading_time = models.IntegerField(default=5, help_text="Calculated estimated reading time in minutes")
    views = models.PositiveIntegerField(default=0)
    
    faqs = models.JSONField(default=list, blank=True, help_text="JSON list of FAQs: [{'question': '...', 'answer': '...'}]")
    manual_related_posts = models.ManyToManyField('self', blank=True, symmetrical=False, help_text="Optional manually selected related articles")

    class Meta:
        ordering = ['-published_at', '-created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['status', 'published_at']),
        ]

    def __str__(self):
        return self.title

    @property
    def get_image(self):
        if self.featured_image:
            return self.featured_image.url
        return self.image_url_fallback or '/placeholder-blog.jpg'

    def calculate_reading_time(self):
        word_count = len(self.content.split())
        return max(1, round(word_count / 200))

    def save(self, *args, **kwargs):
        if not self.reading_time or self.reading_time == 5:
            self.reading_time = self.calculate_reading_time()
        super().save(*args, **kwargs)
