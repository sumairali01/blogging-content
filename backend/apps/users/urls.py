from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuthorViewSet, AdminLoginView, AdminMeView, AdminLogoutView

router = DefaultRouter()
router.register(r'authors', AuthorViewSet, basename='author')

urlpatterns = [
    path('auth/login/', AdminLoginView.as_view(), name='admin-login'),
    path('auth/me/', AdminMeView.as_view(), name='admin-me'),
    path('auth/logout/', AdminLogoutView.as_view(), name='admin-logout'),
    path('', include(router.urls)),
]
