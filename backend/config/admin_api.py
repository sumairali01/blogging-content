"""
Admin Dedicated REST API ViewSets & Stats
──────────────────────────────────────────
Provides full CRUD capabilities for the custom Next.js admin dashboard.
Protected by IsAdminUser / TokenAuthentication.
"""

from rest_framework import viewsets, permissions, views, status, filters, parsers
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count

from apps.blog.models import BlogPost
from apps.blog.serializers import BlogPostAdminSerializer
from apps.products.models import AffiliateProduct, Merchant
from apps.products.serializers import AffiliateProductSerializer, MerchantSerializer
from apps.categories.models import Category
from apps.categories.serializers import CategorySerializer
from apps.tags.models import Tag
from apps.tags.serializers import TagSerializer
from apps.settings.models import SiteSetting
from apps.settings.serializers import SiteSettingSerializer
from apps.analytics.models import AffiliateClick

class AdminStatsView(views.APIView):
    """
    GET /api/admin/stats/
    Returns aggregated metrics for the admin overview dashboard.
    """
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        total_posts = BlogPost.objects.count()
        published_posts = BlogPost.objects.filter(status='published').count()
        draft_posts = BlogPost.objects.filter(status='draft').count()
        scheduled_posts = BlogPost.objects.filter(status='scheduled').count()
        
        total_products = AffiliateProduct.objects.count()
        featured_products = AffiliateProduct.objects.filter(is_featured=True).count()
        total_categories = Category.objects.count()
        total_tags = Tag.objects.count()
        total_clicks = AffiliateClick.objects.count()

        # Recent 10 clicks
        recent_clicks = []
        for c in AffiliateClick.objects.select_related('product', 'article').order_by('-timestamp')[:10]:
            recent_clicks.append({
                'id': c.id,
                'product_name': c.product.name if c.product else 'Unknown',
                'product_slug': c.product.slug if c.product else '',
                'article_title': c.article.title if c.article else 'Direct / Catalog',
                'article_slug': c.article.slug if c.article else '',
                'timestamp': c.timestamp.isoformat(),
                'referrer': c.referrer,
                'user_agent': c.user_agent,
                'ip_address': c.ip_address,
            })

        # Top 5 most clicked products
        top_clicked_products = []
        product_clicks = (
            AffiliateProduct.objects
            .annotate(click_count=Count('clicks'))
            .order_by('-click_count')[:5]
        )
        for p in product_clicks:
            top_clicked_products.append({
                'id': p.id,
                'name': p.name,
                'slug': p.slug,
                'clicks': p.click_count,
                'price': str(p.price) if p.price else None,
                'display_image': p.get_image,
            })

        # Top 5 most viewed posts
        top_viewed_posts = []
        for p in BlogPost.objects.order_by('-views')[:5]:
            top_viewed_posts.append({
                'id': p.id,
                'title': p.title,
                'slug': p.slug,
                'views': p.views,
                'status': p.status,
                'published_at': p.published_at.isoformat() if p.published_at else None,
            })

        return Response({
            'total_posts': total_posts,
            'published_posts': published_posts,
            'draft_posts': draft_posts,
            'scheduled_posts': scheduled_posts,
            'total_products': total_products,
            'featured_products': featured_products,
            'total_categories': total_categories,
            'total_tags': total_tags,
            'total_clicks': total_clicks,
            'recent_clicks': recent_clicks,
            'top_clicked_products': top_clicked_products,
            'top_viewed_posts': top_viewed_posts,
        })


class AdminBlogPostViewSet(viewsets.ModelViewSet):
    """
    CRUD for Blog Posts in custom admin.
    Includes all statuses (drafts, published, scheduled).
    """
    queryset = BlogPost.objects.all().select_related('author', 'category').prefetch_related('tags', 'affiliate_products')
    serializer_class = BlogPostAdminSerializer
    permission_classes = [permissions.IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'category__slug', 'post_type', 'is_featured']
    search_fields = ['title', 'excerpt', 'content', 'slug']
    ordering_fields = ['created_at', 'published_at', 'views', 'title']
    ordering = ['-created_at']


class AdminProductViewSet(viewsets.ModelViewSet):
    """
    CRUD for Affiliate Products in custom admin.
    """
    queryset = AffiliateProduct.objects.all().select_related('merchant', 'category').prefetch_related('tags')
    serializer_class = AffiliateProductSerializer
    permission_classes = [permissions.IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__slug', 'merchant__slug', 'is_featured', 'brand']
    search_fields = ['name', 'brand', 'description', 'short_description', 'slug']
    ordering_fields = ['created_at', 'rating', 'price', 'review_count', 'name']
    ordering = ['-created_at']


class AdminCategoryViewSet(viewsets.ModelViewSet):
    """
    CRUD for Categories in custom admin.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAdminUser]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'slug', 'description']
    ordering = ['name']


class AdminTagViewSet(viewsets.ModelViewSet):
    """
    CRUD for Tags in custom admin.
    """
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAdminUser]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'slug']
    ordering = ['name']


class AdminMerchantViewSet(viewsets.ModelViewSet):
    """
    CRUD for Merchants in custom admin.
    """
    queryset = Merchant.objects.all()
    serializer_class = MerchantSerializer
    permission_classes = [permissions.IsAdminUser]
    search_fields = ['name', 'slug']
    ordering = ['name']


class AdminSiteSettingView(views.APIView):
    """
    GET / PUT for SiteSettings in custom admin.
    Supports JSON and multipart/form-data for direct file uploads.
    """
    permission_classes = [permissions.IsAdminUser]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]

    def get(self, request):
        setting, _ = SiteSetting.objects.get_or_create(pk=1)
        serializer = SiteSettingSerializer(setting)
        return Response(serializer.data)

    def put(self, request):
        setting, _ = SiteSetting.objects.get_or_create(pk=1)
        serializer = SiteSettingSerializer(setting, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class AdminAnalyticsViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Click Analytics Log viewset for custom admin.
    """
    permission_classes = [permissions.IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['product__slug', 'article__slug']
    search_fields = ['product__name', 'article__title', 'referrer', 'ip_address']
    ordering_fields = ['timestamp']
    ordering = ['-timestamp']

    def get_queryset(self):
        return AffiliateClick.objects.all().select_related('product', 'article')

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        
        clicks_data = []
        for c in (page if page is not None else queryset):
            clicks_data.append({
                'id': c.id,
                'product_name': c.product.name if c.product else 'Unknown',
                'product_slug': c.product.slug if c.product else '',
                'article_title': c.article.title if c.article else 'Direct / Storefront',
                'article_slug': c.article.slug if c.article else '',
                'timestamp': c.timestamp.isoformat(),
                'referrer': c.referrer,
                'user_agent': c.user_agent,
                'ip_address': c.ip_address,
            })
            
        if page is not None:
            return self.get_paginated_response(clicks_data)
        return Response(clicks_data)
