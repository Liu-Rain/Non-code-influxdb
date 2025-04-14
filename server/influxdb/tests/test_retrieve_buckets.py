from rest_framework import status
from base.base_test import BaseTest


class RetrieveBucketsViewTest(BaseTest):
    def setUp(self):
        super(RetrieveBucketsViewTest, self).setUp()
        self.url_login = "http://0.0.0.0:8000/api/v1/accounts/signin/"
        self.url_retrieve = "http://0.0.0.0:8000/api/v1/influxdb/buckets"

    def test_retrieve_success_existing_data(self):
        payload_login = {
            "username": "dev0",
            "password": "developer@123influx"
        }
        response = self.client.post(self.url_login, payload_login, format='json')
        cookies = response.cookies.get('login-session')

        payload_retrieve = {
            "organization": "ATSYS",
            "time-start": "2022-01-01T08:00:00Z",
            "time-stop": "2022-01-01T20:00:01Z",
        }

        response = self.client.get(self.url_retrieve, payload_retrieve, cookies=cookies, format='json')
        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['buckets'], ['_monitoring', '_tasks', 'bucket1', 'home'])

    def test_retrieve_fail_non_existing_org(self):
        payload_login = {
            "username": "dev0",
            "password": "developer@123influx"
        }
        response = self.client.post(self.url_login, payload_login, format='json')
        cookies = response.cookies.get('login-session')

        payload_retrieve = {
            "organization": "ABC",
            "time-start": "2024-01-01T08:00:00Z",
            "time-stop": "2024-01-01T20:00:01Z",
        }

        response = self.client.get(self.url_retrieve, payload_retrieve, cookies=cookies, format='json')
        response_data = response.json()

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response_data['error'], "Organization not found")


