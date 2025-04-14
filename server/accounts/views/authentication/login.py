import requests
from rest_framework import generics
from django.http import JsonResponse


class LoginView(generics.GenericAPIView):
    def post(self, request):
        influxdb_url = 'http://influxdb:8086'
        try:
            username = request.data.get("username")
            password = request.data.get("password")
            response = requests.post(f'{influxdb_url}/api/v2/signin', auth=(username, password))
            if response.status_code != 204:
                response_data = response.json()
                return JsonResponse({
                    "error": "InfluxDB API returned an error",
                    "details": response_data["message"]
                }, status=response.status_code)
            cookies_dict = requests.utils.dict_from_cookiejar(response.cookies)
            response = JsonResponse({
                'message': 'Sign-in successful',
            })
            response.set_cookie(
                key='login-session', 
                value=cookies_dict.get('influxdb-oss-session'),
                domain="localhost",
                httponly=True,
                samesite="Strict",
            )
            return response
        except requests.exceptions.ConnectionError as e:
            return JsonResponse({
                "error": "Failed to connect to the server", 
                }, status=500)
        except requests.exceptions.RequestException as e:
            return JsonResponse({
                "error": "Failed to connect to the server", 
                "details": str(e)
                }, status=500)
