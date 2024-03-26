import requests
from django.conf import settings
from django.http import JsonResponse

ACCESS_POINT = "https://api.edamam.com/api/recipes/v2"
APP_ID = "ffb5d721"
API_KEY = "0602670cd11dc1799fbc658e6415e807"
TYPE = "public"

def fetch_data(queries):
    query_params = '&'.join([f"{key}={value}" for key, value in queries.items()])
    url = f"{ACCESS_POINT}?app_id={APP_ID}&app_key={API_KEY}&type={TYPE}&{query_params}"

    response = requests.get(url)
    if response.ok:
        data = response.json()
        return data
    else:
        error_message = f"Failed to fetch data from {url}. Status code: {response.status_code}"
        return {'error': error_message}
