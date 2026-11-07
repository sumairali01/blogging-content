"""
Sitemap Data API View
────────────────────
A single, lightweight, unpaginated endpoint that returns all slug + date
information needed by the Next.js sitemap generator.

All data is fetched with minimal DB columns using .values() to keep it fast
even at thousands of records. No authentication required — this is public data
already visible through the public URLs.

Endpoint: GET /api/sitemap-data/
"""

from django.http import JsonResponse
from django.views import View
from apps.blog.models import BlogPost
from apps.categories.models import Category
from apps.products.models import AffiliateProduct
from apps.pages.models import Page


class SitemapDataView(View):
    """
    Returns all published slugs and last-modified dates for:
      - Blog posts
      - Categories
      - Affiliate products
      - CMS pages

    Uses .values() on each queryset so only the two required fields
    are fetched — no ORM overhead from serializers or related objects.
    """

    def get(self, request):
        # Published blog posts: slug + updated_at
        posts = list(
            BlogPost.objects
            .filter(status='published')
            .values('slug', 'updated_at')
            .order_by('-updated_at')
        )

        # All categories (no status filter — categories are always active)
        categories = list(
            Category.objects
            .values('slug', 'updated_at')
            .order_by('name')
        )

        # Published affiliate products
        products = list(
            AffiliateProduct.objects
            .values('slug', 'updated_at')
            .order_by('-updated_at')
        )

        # Published CMS pages
        pages = list(
            Page.objects
            .filter(status='published')
            .values('slug', 'updated_at')
            .order_by('slug')
        )

        return JsonResponse({
            'posts': posts,
            'categories': categories,
            'products': products,
            'pages': pages,
        }, json_dumps_params={'default': str})  # default=str handles datetime serialization
