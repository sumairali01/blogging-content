from django.db import models
from apps.products.models import AffiliateProduct
from apps.blog.models import BlogPost

class AffiliateClick(models.Model):
    product = models.ForeignKey(AffiliateProduct, on_delete=models.CASCADE, related_name='clicks')
    article = models.ForeignKey(BlogPost, on_delete=models.SET_NULL, null=True, blank=True, related_name='affiliate_clicks')
    timestamp = models.DateTimeField(auto_now_add=True)
    referrer = models.CharField(max_length=500, blank=True)
    user_agent = models.CharField(max_length=500, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"Click: {self.product.name} at {self.timestamp.strftime('%Y-%m-%d %H:%M')}"
