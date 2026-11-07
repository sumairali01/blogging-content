from rest_framework import serializers
from .models import NewsletterSubscriber

class NewsletterSubscribeSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()

    class Meta:
        model = NewsletterSubscriber
        fields = ['email', 'source']

    def validate_email(self, value):
        return value.lower().strip()

