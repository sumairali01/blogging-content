from django.db import models
from apps.categories.models import Category
from apps.tags.models import Tag

class Merchant(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True)
    logo = models.ImageField(upload_to='merchants/', null=True, blank=True)
    website_url = models.URLField(blank=True)

    def __str__(self):
        return self.name

class AffiliateProduct(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=260, unique=True)
    brand = models.CharField(max_length=120, blank=True)
    description = models.TextField(blank=True)
    short_description = models.TextField(blank=True)
    product_image = models.ImageField(upload_to='products/', null=True, blank=True)
    image_url_fallback = models.URLField(blank=True, help_text="External image URL if direct upload is not used")
    gallery_images = models.JSONField(default=list, blank=True, help_text="List of gallery image URLs")
    
    affiliate_url = models.URLField(help_text="Primary affiliate tracking URL")
    merchant = models.ForeignKey(Merchant, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    currency = models.CharField(max_length=10, default='USD')
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=4.5)
    review_count = models.IntegerField(default=0)
    
    pros = models.JSONField(default=list, blank=True, help_text="List of pros as text strings")
    cons = models.JSONField(default=list, blank=True, help_text="List of cons as text strings")
    
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    tags = models.ManyToManyField(Tag, blank=True, related_name='products')
    
    availability = models.CharField(max_length=50, default='In Stock')
    cta_text = models.CharField(max_length=100, default='Check Price')
    badge = models.CharField(max_length=80, blank=True, help_text="Custom badge label (e.g. Top Pick, Best Value). If left blank, no badge is displayed.")
    review_url = models.CharField(max_length=500, blank=True, help_text="Custom review page/article URL (e.g. /blog/best-mechanical-keyboards). If blank, defaults to /products/{slug}")
    disclosure = models.TextField(blank=True, help_text="Custom disclosure if different from default")
    
    seo_title = models.CharField(max_length=200, blank=True)
    seo_description = models.TextField(blank=True)
    is_featured = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.merchant.name if self.merchant else 'Direct'})"

    @property
    def get_image(self):
        if self.product_image:
            return self.product_image.url
        return self.image_url_fallback or '/placeholder-product.jpg'
