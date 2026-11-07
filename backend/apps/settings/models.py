from django.db import models

class SiteSetting(models.Model):
    site_name = models.CharField(max_length=150, default="TechGear Guide")
    site_description = models.TextField(default="Independent tech buying guides, hardware comparisons, and product recommendations for students, software developers, and home office setups.")
    logo = models.ImageField(upload_to='settings/', null=True, blank=True)
    favicon = models.ImageField(upload_to='settings/', null=True, blank=True)
    
    # Hero Section Dynamic Controls
    hero_image = models.ImageField(upload_to='settings/', null=True, blank=True, help_text="Upload custom Hero Section image")
    hero_image_url = models.URLField(
        blank=True, 
        default="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80",
        help_text="Direct image URL for hero section"
    )
    hero_badge = models.CharField(max_length=150, default="100% Independent Tech & Hardware Testing")
    hero_title = models.CharField(max_length=255, default="Smarter Tech Buying Decisions for Builders & Learners.")
    hero_subtitle = models.TextField(default="Independent buying guides, side-by-side hardware comparisons, and curated gear recommendations for software developers, students, and home office power users.")

    default_meta_title = models.CharField(max_length=200, default="TechGear Guide | Tech Buying Guides for Students, Developers & Remote Setups")
    default_meta_description = models.TextField(default="Expert tech buying guides, side-by-side hardware comparisons, and tested product recommendations for programmers, students, and home offices.")
    
    social_links = models.JSONField(
        default=dict,
        blank=True,
        help_text="Social media links, e.g. {'twitter': 'https://twitter.com/...', 'github': '...'}"
    )
    contact_email = models.EmailField(default="contact@techgearguide.com")
    footer_text = models.TextField(default="© 2026 TechGear Guide. Independent Tech Buying Guides & Hardware Research. All rights reserved.")
    
    analytics_ids = models.JSONField(
        default=dict,
        blank=True,
        help_text="Analytics IDs, e.g. {'ga_id': 'G-XXXXXXX', 'pinterest_tag': '...'}"
    )
    
    affiliate_disclosure_default = models.TextField(
        default="Affiliate Disclosure: TechGear Guide participates in various affiliate marketing programs. When you click our links and make a purchase, we may earn an affiliate commission at no additional cost to you. We independently research, evaluate, and test all recommendations."
    )
    
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Site Setting"
        verbose_name_plural = "Site Settings"

    def __str__(self):
        return self.site_name

    @property
    def get_hero_image(self):
        if self.hero_image:
            try:
                url = self.hero_image.url
                if url.startswith('/media/'):
                    return f"http://127.0.0.1:8000{url}"
                return url
            except Exception:
                pass
        return self.hero_image_url or "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)
