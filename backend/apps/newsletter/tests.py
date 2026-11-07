from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import NewsletterSubscriber

class NewsletterAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('newsletter-subscribe')

    def test_newsletter_subscribe_new(self):
        data = {'email': 'testuser@example.com', 'source': 'homepage'}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(NewsletterSubscriber.objects.count(), 1)
        self.assertEqual(NewsletterSubscriber.objects.first().status, 'active')

    def test_newsletter_subscribe_duplicate(self):
        NewsletterSubscriber.objects.create(email='existing@example.com', status='active')
        data = {'email': 'existing@example.com'}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('already subscribed', response.data['message'])

    def test_newsletter_resubscribe_inactive(self):
        subscriber = NewsletterSubscriber.objects.create(email='unsub@example.com', status='unsubscribed')
        data = {'email': 'unsub@example.com'}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        subscriber.refresh_from_db()
        self.assertEqual(subscriber.status, 'active')
