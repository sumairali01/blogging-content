from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import ContactMessage

class ContactMessageAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('contact-message-create')

    def test_send_contact_message_success(self):
        data = {
            'name': 'Jane Doe',
            'email': 'jane@example.com',
            'subject': 'Appliance Review Inquiry',
            'message': 'Hello, I love your kitchen storage guides! Could you review compact blenders?'
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertEqual(ContactMessage.objects.count(), 1)
        
        msg = ContactMessage.objects.first()
        self.assertEqual(msg.name, 'Jane Doe')
        self.assertFalse(msg.is_read)

    def test_send_contact_message_invalid_email(self):
        data = {
            'name': 'Jane Doe',
            'email': 'not-an-email',
            'message': 'Hello, message with invalid email format'
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)
