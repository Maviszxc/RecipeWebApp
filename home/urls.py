from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('index/', views.index, name='index'),
    path('recipes/', views.recipes, name='recipes'),
    path('detail/', views.detail, name='detail'),
    path('savedRecipes/', views.savedRecipes, name='savedRecipes'),
    path('recipes/<str:health_preference>/', views.health_preference_view, name='health_preference'),
    path('home/recipes/<str:meal_type>/', views.recipes, name='recipes'),
    path('home/recipes/', views.search_recipes, name='search_recipes'),
]