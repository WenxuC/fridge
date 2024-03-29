from .credentials import apiKey
from .models import Recipe
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from requests import get
from .serializers import RecipeSerializer, DeleteRecipeSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from random import sample

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
        ingredientsSet = set()
        for data in ingredients:
            ingredientsSet.add(data['name'].lower())

        ingredientsString = ",".join(ingredientsSet)
        response = get("https://api.spoonacular.com/recipes/findByIngredients", 
            headers={
                'Content-Type': 'application/json',
                'x-api-key': apiKey, 
            },
            params={
                'ingredients': ingredientsString,
                'number': 50,
                'ignorePantry': True,
                'ranking': 2
            }
        ).json()

        if len(response) == 0:
            return Response({'Bad Request': 'No data found'}, status=status.HTTP_400_BAD_REQUEST)
            
        recipeSample = sample(response, 5)
        recipeDict = []
        id_list = []

        for i in range(len(recipeSample)):
            id_list.append(str(recipeSample[i].get('id')))
        id_list = ",".join(id_list)

        responseSource = get(f"https://api.spoonacular.com/recipes/informationBulk",
            headers={
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
            },
            params={
                'ids': id_list,
                'includeNutrition': False
            }
        ).json()
        for i in range(len(responseSource)):
            
            favorite = False
            title = responseSource[i]['title']
            id = responseSource[i]['id']

            recipe_result = Recipe.objects.filter(recipeID=id, user=request.user)
            if recipe_result.exists():
                favorite = True
            else:
                favorite = False

            extendedIngredients = responseSource[i]['extendedIngredients']
            missing_ingredient_list = ""
            serving = responseSource[i]['servings']
            time = responseSource[i]['readyInMinutes']
            source = responseSource[i]['spoonacularSourceUrl']
            image = responseSource[i]['image']
              
            for ingredients in extendedIngredients:
                name = ingredients.get('nameClean')
                if name not in ingredientsSet and name != None:
                    missing_ingredient_list += name + ','

            recipe = Recipe(title=title, recipeID=id, source=source, image=image, favorite=favorite, time=time, serving=serving, missing_ingredient_list=missing_ingredient_list, user=request.user)
            recipeDict.append(RecipeSerializer(recipe).data)
        if len(recipeDict):
            return Response(recipeDict, status=status.HTTP_201_CREATED)
        else:
            return Response({'Bad Request': 'No data found'}, status=status.HTTP_400_BAD_REQUEST)

class AdvancedRecipeView(APIView):
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        
        typeOfFood = request.data.get('type')
        cuisine = request.data.get('cuisine')
        diet = request.data.get('diet')
        intolerance = ",".join(request.data.get('intolerance'))
        ingredients = request.data.get('ingredients')
        ingredientsSet = set()
        for data in ingredients:
            ingredientsSet.add(data['name'].lower())
        ingredientString = ",".join(ingredientsSet)
        
        response = get('https://api.spoonacular.com/recipes/complexSearch',
            headers={
                'Content-Type': 'application/json',
                'x-api-key': apiKey, 
            },
            params={
                'includeIngredients': ingredientString,
                'type': typeOfFood,
                'cuisine': cuisine,
                'diet': diet,
                'sort': "min-missing-ingredients",
                'intolerance': intolerance,
                'number': 50,
                'ignorePantry': True,
                'fillIngredients': True
            }
        ).json()
        
        if response['totalResults'] == 0:
            return Response({'Bad Request': 'No data found'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            recipeDict = []
            if response['totalResults'] < 5:
                recipeSample = response['results']
            else:
                recipeSample = sample(response['results'], 5)
            id_list = []

            for i in range(len(recipeSample)):
                id_list.append(str(recipeSample[i].get('id')))
            id_list = ",".join(id_list)
            
            responseSource = get(f"https://api.spoonacular.com/recipes/informationBulk",
                headers={
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                },
                params={
                    'ids': id_list,
                    'includeNutrition': False
                }
            ).json()
            for i in range(len(responseSource)):
                favorite = False
                title = responseSource[i]['title']
                id = responseSource[i]['id']

                recipe_result = Recipe.objects.filter(recipeID=id, user=request.user)
                if recipe_result.exists():
                    favorite = True
                else:
                    favorite = False

                extendedIngredients = responseSource[i]['extendedIngredients']
                missing_ingredient_list = ""
                serving = responseSource[i]['servings']
                time = responseSource[i]['readyInMinutes']
                source = responseSource[i]['spoonacularSourceUrl']
                image = responseSource[i]['image']
                
                for ingredients in extendedIngredients:
                    name = ingredients.get('nameClean')
                    if name not in ingredientsSet and name != None:
                        missing_ingredient_list += name + ','

                recipe = Recipe(title=title, recipeID=id, source=source, image=image, favorite=favorite, time=time, serving=serving, missing_ingredient_list=missing_ingredient_list, user=request.user)
                recipeDict.append(RecipeSerializer(recipe).data)
                
        if len(recipeDict):
            return Response(recipeDict, status=status.HTTP_200_OK)
        else:
            return Response({'Bad Request': 'No data found'}, status=status.HTTP_400_BAD_REQUEST)
            
class SaveRecipeView(APIView):
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]
    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            missing_ingredient_list = serializer.data.get('missing_ingredient_list')
            serving = serializer.data.get('serving')
            time = serializer.data.get('time')
            title = serializer.data.get('title')
            id = serializer.data.get('recipeID')
            source = serializer.data.get('source')
            image = serializer.data.get('image')
            favorite = serializer.data.get('favorite')
            user = request.user
            recipe = Recipe(title=title, recipeID=id, source=source, image=image, favorite=favorite, serving=serving, time=time, missing_ingredient_list=missing_ingredient_list, user=user )
            recipe.save()
            
            return Response(RecipeSerializer(recipe).data, status=status.HTTP_201_CREATED)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


class DeleteRecipeView(APIView):
    serializer_class = DeleteRecipeSerializer
    permission_classes = [IsAuthenticated]
    def post(self, request, format=None):
        # serializer = self.serializer_class(data=request.data)
        data = request.data
        id = data.get('recipeID')
        user = request.user
        recipe_result = Recipe.objects.filter(recipeID=id, user=user)
        if recipe_result.exists():
            recipe_result[0].delete()
            return Response({'msg':'Item deleted'}, status=status.HTTP_200_OK)
        return Response({'msg':'Bad request'}, status=status.HTTP_400_BAD_REQUEST)