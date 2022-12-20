from django.urls import path
from .views import GetRecipeView

urlpatterns = [
    path('getRecipe', GetRecipeView.as_view())
]