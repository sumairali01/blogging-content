from rest_framework import views, response, permissions
from .models import SiteSetting
from .serializers import SiteSettingSerializer

class SiteSettingView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        setting, _ = SiteSetting.objects.get_or_create(pk=1)
        serializer = SiteSettingSerializer(setting)
        return response.Response(serializer.data)
