from rest_framework import views, response, status, permissions
from .models import NewsletterSubscriber
from .serializers import NewsletterSubscribeSerializer

class NewsletterSubscribeView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = NewsletterSubscribeSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            source = serializer.validated_data.get('source', '')

            subscriber, created = NewsletterSubscriber.objects.get_or_create(
                email=email,
                defaults={'source': source, 'status': 'active'}
            )

            if not created and subscriber.status == 'unsubscribed':
                # Reactivate unsubscribed email
                subscriber.status = 'active'
                subscriber.save()
                return response.Response(
                    {'message': 'Welcome back! You have been resubscribed.'},
                    status=status.HTTP_200_OK
                )
            elif not created:
                return response.Response(
                    {'message': 'You are already subscribed!'},
                    status=status.HTTP_200_OK
                )

            return response.Response(
                {'message': 'Thank you for subscribing!'},
                status=status.HTTP_201_CREATED
            )

        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
