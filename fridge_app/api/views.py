from .credentials import apiKey
from .models import Recipe
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from requests import get
from .serializers import RecipeSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

class GetRecipeView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RecipeSerializer
    def post(self, request, format=None):
        ingredients = request.data.get('ingredients')
        ingredientsList = []
        
        for data in ingredients:
            ingredientsList.append(data['name'])
        ingredientsList = ",".join(ingredientsList)
        response = get("https://api.spoonacular.com/recipes/findByIngredients", 
            headers={
                'Content-Type': 'application/json',
                'x-api-key': apiKey, 
            },
            params={
                'ingredients': ingredientsList,
                'number': 5,
                'ignorePantry': True
            }
        ).json()

        recipeDict = []
        for i in range(len(response)):
            title = response[i].get('title')
            id = response[i].get('id')
            responseSource = get(f"https://api.spoonacular.com/recipes/{id}/information",
                headers={
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                },
                params={
                    'includeNutrition': False
                }
            ).json()
            source = responseSource.get('sourceUrl')
            image = responseSource.get('image')
            recipe = Recipe(title=title, id=id, source=source, image=image, user=request.user)
            recipe.save()
            recipeDict.append(RecipeSerializer(recipe).data)
        
        return Response(recipeDict, status=status.HTTP_201_CREATED)

# Get the recipe information and save it to the model(source)


