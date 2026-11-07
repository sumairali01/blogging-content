from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.decorators.cache import cache_page
from rest_framework.routers import DefaultRouter
from .sitemap_views import SitemapDataView
from .admin_api import (
    AdminStatsView,
    AdminBlogPostViewSet,
    AdminProductViewSet,
    AdminCategoryViewSet,
    AdminTagViewSet,
    AdminMerchantViewSet,
    AdminSiteSettingView,
    AdminAnalyticsViewSet,
)

# Admin API router
admin_router = DefaultRouter()
admin_router.register(r'posts', AdminBlogPostViewSet, basename='admin-post')
admin_router.register(r'products', AdminProductViewSet, basename='admin-product')
admin_router.register(r'categories', AdminCategoryViewSet, basename='admin-category')
admin_router.register(r'tags', AdminTagViewSet, basename='admin-tag')
admin_router.register(r'merchants', AdminMerchantViewSet, basename='admin-merchant')
admin_router.register(r'analytics', AdminAnalyticsViewSet, basename='admin-analytics')

urlpatterns = [
    path('django-admin/', admin.site.urls),
    path('api/', include('apps.blog.urls')),
    path('api/', include('apps.products.urls')),
    path('api/', include('apps.categories.urls')),
    path('api/', include('apps.tags.urls')),
    path('api/', include('apps.users.urls')),
    path('api/', include('apps.pages.urls')),
    path('api/', include('apps.settings.urls')),
    path('api/', include('apps.analytics.urls')),
    path('api/', include('apps.newsletter.urls')),
    path('api/', include('apps.contact.urls')),
    
    # Custom Admin API Endpoints
    path('api/admin/stats/', AdminStatsView.as_view(), name='admin-stats'),
    path('api/admin/settings/', AdminSiteSettingView.as_view(), name='admin-settings'),
    path('api/admin/', include(admin_router.urls)),

    # Lightweight sitemap data endpoint
    path('api/sitemap-data/', cache_page(60 * 15)(SitemapDataView.as_view()), name='sitemap-data'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

admin.site.site_header = "Affiliate Blog Master Administration"
admin.site.site_title = "Affiliate Blog Admin Portal"
admin.site.index_title = "Welcome to Foreign Affiliate Content Engine Admin"
