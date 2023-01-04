from .credentials import apiKey
from .models import Recipe
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from requests import get
from .serializers import RecipeSerializer, DeleteRecipeSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes


class GetHistoryView(APIView):
    # permission_classes = [IsAuthenticated]
    serializer_class = RecipeSerializer
    def get(self, request, format=None):

        recipes = Recipe.objects.filter(user=request.user)
        if recipes.exists():
            recipeDict =[]
            for i in range(len(recipes)):
                recipeDict.append(RecipeSerializer(recipes[i]).data)
            return Response(recipeDict, status=status.HTTP_200_OK)
        return Response({'Not Found': 'No data found'}, status=status.HTTP_404_NOT_FOUND)
        
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
                'number': 4,
                'ignorePantry': True,
                'ranking': 2
            }
        ).json()

        recipeDict = []
        for i in range(len(response)):
            title = response[i].get('title')
            id = response[i].get('id')
            
            favorite = False
            recipe_result = Recipe.objects.filter(id=id, user=request.user)
            if recipe_result.exists():
                favorite = True
            else:
                favorite = False

            responseSource = get(f"https://api.spoonacular.com/recipes/{id}/information",
                headers={
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                },
                params={
                    'includeNutrition': False
                }
            ).json()

            source = responseSource.get('spoonacularSourceUrl')
            image = responseSource.get('image')
            summary = responseSource.get('summary')
            
            recipe = Recipe(title=title, id=id, source=source, image=image, summary=summary, favorite=favorite, user=request.user)
            recipeDict.append(RecipeSerializer(recipe).data)
        
        return Response(recipeDict, status=status.HTTP_201_CREATED)

class AdvancedRecipeView(APIView):
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        
        typeOfFood = request.data.get('type')
        cuisine = request.data.get('cuisine')
        diet = request.data.get('diet')
        intolerance = ",".join(request.data.get('intolerance'))
        user = request.user
        ingredients = request.data.get('ingredients')
        ingredientsList = []
        for data in ingredients:
            ingredientsList.append(data['name'])
        ingredientsList = ",".join(ingredientsList)
        
        response = get('https://api.spoonacular.com/recipes/complexSearch',
            headers={
                'Content-Type': 'application/json',
                'x-api-key': apiKey, 
            },
            params={
                'includeIngredients': ingredientsList,
                'type': typeOfFood,
                'cuisine': cuisine,
                'diet': diet,
                'intolerance': intolerance,
                'number': 4,
                'ignorePantry': True,
            }
        ).json()
        if response['totalResults'] == 0:
            return Response({'Bad Request': 'No data found'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            
            recipeDict = []
            for i in range(len(response['results'])):
                title = response['results'][i]['title']
                id = response['results'][i]['id']
                favorite = False
                recipe_result = Recipe.objects.filter(id=id, user=request.user)
                if recipe_result.exists():
                    favorite = True
                else:
                    favorite = False

                responseSource = get(f"https://api.spoonacular.com/recipes/{id}/information",
                    headers={
                        'Content-Type': 'application/json',
                        'x-api-key': apiKey,
                    },
                    params={
                        'includeNutrition': False
                    }
                ).json()

                source = responseSource.get('spoonacularSourceUrl')
                image = responseSource.get('image')
                summary = responseSource.get('summary')
                recipe = Recipe(title=title, id=id, source=source, image=image, summary=summary, favorite=favorite, user=request.user)
                recipeDict.append(RecipeSerializer(recipe).data)
            return Response(recipeDict, status=status.HTTP_200_OK)
            
class SaveRecipeView(APIView):
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]
    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            title = serializer.data.get('title')
            id = serializer.data.get('id')
            source = serializer.data.get('source')
            image = serializer.data.get('image')
            summary = serializer.data.get('summary')
            favorite = serializer.data.get('favorite')
            user = request.user
            recipe = Recipe(title=title, id=id, source=source, image=image, summary=summary, favorite=favorite, user=user )
            recipe.save()
            return Response(RecipeSerializer(recipe).data, status=status.HTTP_201_CREATED)
        
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


class DeleteRecipeView(APIView):
    serializer_class = DeleteRecipeSerializer
    permission_classes = [IsAuthenticated]
    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            id = serializer.data.get('id')
            user = request.user
            recipe_result = Recipe.objects.filter(id=id, user=user)
            if recipe_result.exists():
                recipe_result[0].delete()
                return Response({'msg':'Item deleted'}, status=status.HTTP_200_OK)
            return Response({'msg':'Item not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'msg':'Bad request'}, status=status.HTTP_400_BAD_REQUEST)