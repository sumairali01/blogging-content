from django.db import models

class NewsletterSubscriber(models.Model):
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('unsubscribed', 'Unsubscribed'),
    )

    email = models.EmailField(unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    source = models.CharField(max_length=100, blank=True, help_text="Where they signed up (e.g., homepage, article slug)")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.email} ({self.status})"
