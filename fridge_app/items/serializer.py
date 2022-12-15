from rest_framework import serializers
from .models import Items
from rest_framework.serializers import ModelSerializer

# Create your views here.
class ItemSerializer(ModelSerializer):
    class Meta:
        model = Items
        fields = '__all__'