from django.http import HttpResponse
from django.shortcuts import render
import requests

from .requests import fetch_data

def home(request):
    return render(request, 'home/index.html')

def index(request):
    return render(request, 'home/index.html')

def recipes(request):
    return render(request, 'home/recipes.html')

def detail(request):
    return render(request, 'home/detail.html')

def savedRecipes(request):
    return render(request, 'home/savedRecipes.html')

def health_preference_view(request, health_preference):
    return HttpResponse(f"You selected {health_preference} as your health preference.")

def search_recipes(request):
    query = request.GET.get('q', '')

    queries = {'q': query, 'cuisine': 'italian'}
    data_json = fetch_data(queries)

    context = {
        'data_json': data_json,
        'query': query,
    }

    return render(request, 'home/recipes.html', context)
