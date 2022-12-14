from django.urls import path
from .views import GetRecipeView, SaveRecipeView, DeleteRecipeView, GetHistoryView, AdvancedRecipeView

urlpatterns = [
    path('getRecipe', GetRecipeView.as_view()),
    path('saveRecipe', SaveRecipeView.as_view()),
    path('deleteRecipe', DeleteRecipeView.as_view()),
    path('getHistory', GetHistoryView.as_view()),
    path('advancedRecipe', AdvancedRecipeView.as_view())
]