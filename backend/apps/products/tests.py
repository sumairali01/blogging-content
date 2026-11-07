from django.test import TestCase
from rest_framework.test import APIClient
from apps.products.models import Merchant, AffiliateProduct

class AffiliateProductAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.merchant = Merchant.objects.create(name='Amazon', slug='amazon')
        self.product = AffiliateProduct.objects.create(
            name='Keurig K-Mini',
            slug='keurig-k-mini',
            affiliate_url='https://amazon.com/dp/12345?tag=test-20',
            merchant=self.merchant,
            price=79.99,
            rating=4.5
        )

    def test_get_products_list(self):
        response = self.client.get('/api/products/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 1)

    def test_get_product_detail(self):
        response = self.client.get(f'/api/products/{self.product.slug}/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['name'], 'Keurig K-Mini')
