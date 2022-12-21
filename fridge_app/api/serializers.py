from rest_framework import serializers
from .models import Recipe

class RecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recipe
        fields = '__all__'

class DeleteRecipeSerializer(serializers.ModelSerializer):
    id = serializers.CharField(validators=[])
    class Meta:
        model = Recipe
        fields = ('id', 'user')