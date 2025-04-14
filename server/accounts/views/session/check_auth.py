import requests
from rest_framework import generics
from django.http import JsonResponse


class CheckAuthenticationView(generics.GenericAPIView):
    def get(self, request):
        influxdb_url = 'http://influxdb:8086'
        try:
            cookies = request.COOKIES.get('login-session')
            headers = {
                "Cookie": f"influxdb-oss-session={cookies}"
            }
            response = requests.get(f'{influxdb_url}/api/v2/me', headers=headers)
            if response.status_code != 200:
                response_data = response.json()
                return JsonResponse({
                    "error": "InfluxDB API returned an error",
                    "details": response_data["message"]
                }, status=response.status_code)
            response = JsonResponse({
                'message': 'Login authenticated',
            })
            return response
        except requests.exceptions.RequestException as e:
            return JsonResponse({
                "error": "Failed to connect to the server", 
                "details": str(e)
                }, status=500)
