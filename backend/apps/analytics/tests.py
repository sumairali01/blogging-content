from django.test import TestCase
from rest_framework.test import APIClient
from apps.products.models import Merchant, AffiliateProduct
from apps.analytics.models import AffiliateClick

class AffiliateRedirectAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.merchant = Merchant.objects.create(name='Amazon', slug='amazon')
        self.product = AffiliateProduct.objects.create(
            name='Keurig K-Mini',
            slug='keurig-k-mini',
            affiliate_url='https://amazon.com/dp/12345?tag=test-20',
            merchant=self.merchant
        )

    def test_affiliate_redirect_logs_click(self):
        initial_clicks = AffiliateClick.objects.count()
        response = self.client.get(f'/api/go/{self.product.slug}/?format=json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['affiliate_url'], self.product.affiliate_url)
        self.assertEqual(AffiliateClick.objects.count(), initial_clicks + 1)
