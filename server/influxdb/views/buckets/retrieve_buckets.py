import os
import logging
import requests
from rest_framework import generics
from django.http import JsonResponse
from requests.exceptions import RequestException, Timeout
from json.decoder import JSONDecodeError

logger = logging.getLogger(__name__)

class RetrieveBucketsView(generics.GenericAPIView):
    # Class-level constants
    INFLUXDB_URL = os.environ.get('INFLUXDB_URL', 'http://influxdb:8086')
    TIMEOUT = 10

    def get(self, request):
        """
        Handle GET requests to retrieve InfluxDB buckets.
        """
        try:
            # Check for authentication token in cookies
            cookies = request.COOKIES.get('login-session')
            organization = request.query_params.get('organization')
            if not cookies:
                return self.error_response("Unauthorized: Missing authentication token", status=401)
            if not organization:
                return self.error_response("Missing organization parameter", status=400)

            headers = self.get_headers(cookies)
            
            # Get organization ID
            org_id = self.get_organization_id(headers, organization)
            if isinstance(org_id, JsonResponse):
                return org_id  # Return error response if org_id is a JsonResponse

            response = self.make_request(headers, org_id)
            return self.handle_response(response)

        except Timeout:
            logger.error("Request to InfluxDB timed out")
            return self.error_response("Request timed out", status=504)
        except RequestException as e:
            logger.error(f"Failed to connect to the server: {str(e)}")
            return self.error_response("Failed to connect to the server", status=500)
        except JSONDecodeError as e:
            logger.error(f"Invalid JSON response: {str(e)}")
            return self.error_response("Invalid response format", status=500)
        except Exception as e:
            logger.exception(f"Unexpected error: {str(e)}")
            return self.error_response("Unexpected error", status=500)

    def get_headers(self, cookies):
        """
        Prepare headers for the InfluxDB API request.
        """
        return {
            "Cookie": f"influxdb-oss-session={cookies}",
            "Accept": "application/json",
            "Content-Type": "application/json",
        }

    def get_organization_id(self, headers, organization):
        """
        Get the organization ID for the given organization name.
        """
        response_org = requests.get(f"{self.INFLUXDB_URL}/api/v2/orgs", headers=headers, timeout=self.TIMEOUT)
        if response_org.status_code != 200:
            return self.error_response("InfluxDB API returned an error", status=response_org.status_code)
        
        orgs_data = response_org.json().get('orgs', [])
        for org in orgs_data:
            if org['name'] == organization:
                return org["id"]
        
        return self.error_response("Organization not found", status=404)

    def make_request(self, headers, org_id):
        """
        Make a GET request to the InfluxDB API to retrieve buckets.
        """
        params = {"orgID": org_id}
        return requests.get(f"{self.INFLUXDB_URL}/api/v2/buckets", headers=headers, params=params, timeout=self.TIMEOUT)

    def handle_response(self, response):
        """
        Process the InfluxDB API response and return bucket names if successful.
        """
        if response.status_code == 200:
            buckets_name = self.extract_bucket_names(response.json())
            return JsonResponse({"buckets": buckets_name})
        return self.handle_influxdb_error(response)

    def handle_influxdb_error(self, response):
        """
        Log and return an appropriate error response for InfluxDB API errors.
        """
        logger.error(f"InfluxDB error: {response.status_code} - {response.text}")
        return self.error_response(response.text, status=response.status_code)

    def extract_bucket_names(self, data):
        """
        Extract bucket names from the InfluxDB API response data.
        """
        return [bucket["name"] for bucket in data.get("buckets", [])]

    def error_response(self, message, status):
        """
        Create a standardized error response.
        """
        return JsonResponse({"error": message}, status=status)
