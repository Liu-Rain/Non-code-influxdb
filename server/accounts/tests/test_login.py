from base.base_test import BaseTest
from rest_framework import status


class LoginViewTest(BaseTest):
    def setUp(self):
        super(LoginViewTest, self).setUp()
        self.url = "http://0.0.0.0:8000/api/v1/accounts/signin/"

    def test_login_success(self):
        payload = {
            "username": "dev1",
            "password": "developer@123influx"
        }

        response = self.client.post(self.url, payload, format='json')
        response_data = response.json()
        cookie = response.cookies.get('login-session')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['message'], 'Sign-in successful')

        self.assertIsNotNone(cookie, "Cookie should be set")
        self.assertEqual(cookie['domain'], 'localhost')
        self.assertEqual(cookie['httponly'], True)
        self.assertEqual(cookie['samesite'], 'Strict')

    def test_login_fail(self):
        payload = {
            "username": "dev2",
            "password": "developer@123influx"
        }

        response = self.client.post(self.url, payload, format='json')
        response_data = response.json()

        self.assertEqual(response.status_code, 401)
        self.assertEqual(response_data['error'], 'InfluxDB API returned an error')
        self.assertEqual(response_data['details'], 'unauthorized access')
