from rest_framework import views, response, status, permissions
from .serializers import ContactMessageSerializer

class ContactMessageCreateView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data)
        if serializer.is_valid():
            x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
            ip = x_forwarded_for.split(',')[0] if x_forwarded_for else request.META.get('REMOTE_ADDR')
            
            serializer.save(ip_address=ip)
            return response.Response(
                {
                    'success': True,
                    'message': "Thank you for reaching out! We'll get back to you shortly."
                },
                status=status.HTTP_201_CREATED
            )
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
