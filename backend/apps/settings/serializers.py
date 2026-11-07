import json
from rest_framework import serializers
from .models import SiteSetting

class FlexibleJSONField(serializers.JSONField):
    """
    Handles JSONField input whether sent as parsed JSON object or serialized string (FormData).
    """
    def to_internal_value(self, data):
        if isinstance(data, str):
            try:
                data = json.loads(data)
            except Exception:
                pass
        return super().to_internal_value(data)

class SiteSettingSerializer(serializers.ModelSerializer):
    display_hero_image = serializers.CharField(source='get_hero_image', read_only=True)
    social_links = FlexibleJSONField(required=False, default=dict)
    analytics_ids = FlexibleJSONField(required=False, default=dict)

    class Meta:
        model = SiteSetting
        fields = [
            'site_name', 'site_description', 'logo', 'favicon',
            'hero_image', 'hero_image_url', 'display_hero_image',
            'hero_badge', 'hero_title', 'hero_subtitle',
            'default_meta_title', 'default_meta_description',
            'social_links', 'contact_email', 'footer_text',
            'analytics_ids', 'affiliate_disclosure_default', 'updated_at'
        ]
