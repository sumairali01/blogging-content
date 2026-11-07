from django.urls import path
from .views import AffiliateRedirectView

urlpatterns = [
    path('go/<slug:product_slug>/', AffiliateRedirectView.as_view(), name='affiliate-redirect'),
]
