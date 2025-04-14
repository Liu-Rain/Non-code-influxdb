import csv
from io import StringIO
import pandas as pd
from collections import defaultdict

import requests
from rest_framework import generics
from django.http import JsonResponse


class RetrieveFieldsView(generics.GenericAPIView):
    def get(self, request):        
        influxdb_url = 'http://influxdb:8086'
        try:
            cookies = request.COOKIES.get('login-session')
            organization = request.query_params.get('organization')
            bucket = request.query_params.get('bucket')
            measurement = request.query_params.get('measurement')
            time_start = request.query_params.get('time-start')
            time_stop = request.query_params.get('time-stop')

            # Get organization ID
            headers = {
                "Cookie": f"influxdb-oss-session={cookies}",
                "Accept": "application/csv",
                "Content-Type": "application/vnd.flux"
            }
            response_org = requests.get(f"{influxdb_url}/api/v2/orgs", headers=headers)
            response_data = response_org.json()
            if response_org.status_code != 200:
                return JsonResponse(
                    {"error": "InfluxDB API returned an error", "details": response_data["message"]}, 
                    status=response_org.status_code)
            orgs_data = response_data['orgs']
            params = None
            for org in orgs_data:
                if org['name'] == organization:
                    params = {"orgID": org["id"]}
                    break
            if params is None:
                return JsonResponse({"error": "Organization not found"}, status=404)
            
            # Get measurement
            data = f'from(bucket: "{bucket}") |> range(start: {time_start}, stop: {time_stop})'
            response_query = requests.post(
                f"{influxdb_url}/api/v2/query", 
                headers=headers, 
                params=params, 
                data=data)
            if response_query.status_code != 200:
                response_data = response_query.json()
                return JsonResponse(
                    {"error": "InfluxDB API returned an error", "details": response_data["message"]}, 
                    status=response_query.status_code)
            csv_content = response_query.text
            csv_file = StringIO(csv_content)
            reader = csv.DictReader(csv_file)
            tables = defaultdict(list)
            for row in reader:
                key = row['table']
                tables[key].append(row)
            flattened_data = []
            for key, value_list in tables.items():
                flattened_data.extend(value_list)
            if len(flattened_data) == 0:
                return JsonResponse({"fields": []})
            df = pd.DataFrame(flattened_data)
            measurements = df['_measurement'].unique().tolist()
            if measurement not in measurements:
                return JsonResponse({
                    "error": "Measurement not found"
                }, status=404)   

            # Get fields
            filtered_df = df[df['_measurement'] == measurement]
            fields = filtered_df['_field'].unique().tolist()
            response = JsonResponse({"fields": fields})
            return response
        except requests.exceptions.RequestException as e:
            return JsonResponse(
                {"error": "Failed to connect to the server", "details": str(e)}, 
                status=500)
