from django.test import TestCase
from rest_framework.test import APIClient
from apps.blog.models import BlogPost
from apps.categories.models import Category
from apps.users.models import Author

class BlogPostAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.category = Category.objects.create(name='Small Kitchen', slug='small-kitchen')
        self.author = Author.objects.create(name='Sarah', slug='sarah')
        self.post = BlogPost.objects.create(
            title='Test Post Title',
            slug='test-post-title',
            content='Test article content with several words for reading time calculation.',
            category=self.category,
            author=self.author,
            status='published'
        )

    def test_get_posts_list(self):
        response = self.client.get('/api/posts/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 1)

    def test_get_post_detail_increments_views(self):
        initial_views = self.post.views
        response = self.client.get(f'/api/posts/{self.post.slug}/')
        self.assertEqual(response.status_code, 200)
        self.post.refresh_from_db()
        self.assertEqual(self.post.views, initial_views + 1)
