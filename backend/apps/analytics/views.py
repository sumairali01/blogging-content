from urllib.parse import urlparse
from rest_framework import views, status, permissions
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.http import HttpResponseRedirect, HttpResponseBadRequest
from apps.products.models import AffiliateProduct
from apps.blog.models import BlogPost
from .models import AffiliateClick

class AffiliateRedirectView(views.APIView):
    """
    Secure affiliate redirect and click tracking endpoint.
    Route: /api/go/<product_slug>/?article=<article_slug>
    
    Security & Reliability features:
      - Validates that affiliate_url strictly uses http or https schemes
      - Records click metadata (timestamp, user agent, referrer, IP, originating article)
      - Returns JSON target or performs standard HTTP 302 redirect
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request, product_slug):
        product = get_object_or_404(AffiliateProduct, slug=product_slug)
        affiliate_url = (product.affiliate_url or '').strip()

        # Strict URL validation — prevent open protocol exploits (e.g. javascript:, data:)
        parsed = urlparse(affiliate_url)
        if not parsed.scheme or parsed.scheme.lower() not in ('http', 'https') or not parsed.netloc:
            return HttpResponseBadRequest("Invalid or insecure affiliate URL configured for this product.")
        
        # Get optional article context from query parameter
        article_slug = request.GET.get('article', None)
        article = None
        if article_slug:
            article = BlogPost.objects.filter(slug=article_slug).first()

        # Extract client metadata safely
        user_agent = request.META.get('HTTP_USER_AGENT', '')[:500]
        referrer = request.META.get('HTTP_REFERER', '')[:500]
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR')

        # Log click event in DB
        try:
            AffiliateClick.objects.create(
                product=product,
                article=article,
                referrer=referrer,
                user_agent=user_agent,
                ip_address=ip
            )
        except Exception:
            # Click logging should not break the user redirect
            pass

        # Check if client wants JSON target URL or HTTP redirect
        if request.GET.get('format') == 'json' or 'application/json' in request.headers.get('Accept', ''):
            return Response({'affiliate_url': affiliate_url, 'product': product.name})
        
        return HttpResponseRedirect(affiliate_url)
