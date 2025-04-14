import json

from rest_framework import status

from base.base_test import BaseTest


class ExecuteQueryViewView(BaseTest):
    def setUp(self):
        super(ExecuteQueryViewView, self).setUp()
        self.url_login = "http://0.0.0.0:8000/api/v1/accounts/signin/"
        self.url_retrieve = "http://0.0.0.0:8000/api/v1/influxdb/query"

    def test_retrieve_success_existing_data(self):
        payload_login = {
            "username": "dev1",
            "password": "developer@123influx"
        }
        response = self.client.post(self.url_login, payload_login, format='json')
        cookies = response.cookies.get('login-session')

        request_body = {
            "query": "from(bucket: \"bucket1\") |> range(start: 2022-01-01T08:00:00Z, stop: 2022-01-01T20:00:01Z) |> filter(fn: (r) => r._measurement == \"home\" and r._field == \"hum\")"
        }
        query_params = {"organization": "ATSYS"}

        response = self.client.get(
            self.url_retrieve,
            data=json.dumps(request_body),
            content_type='application/json',
            cookies=cookies,
            **query_params
        )
        response_data = response.json()
        import logging
        logging.error(response_data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['fields'], ["co", "hum", "temp"])
