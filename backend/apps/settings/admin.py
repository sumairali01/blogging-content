from django.contrib import admin
from .models import SiteSetting

@admin.register(SiteSetting)
class SiteSettingAdmin(admin.ModelAdmin):
    list_display = ('site_name', 'contact_email', 'updated_at')

    def has_add_permission(self, request):
        # Prevent creating multiple setting instances
        if self.model.objects.exists():
            return False
        return super().has_add_permission(request)
