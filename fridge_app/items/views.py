from django.shortcuts import render
from .credentials import apiKey
from .models import Items
import string
from django.contrib.auth.models import User
from .serializer import ItemSerializer
from requests import get
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

class ItemView(generics.ListAPIView):
    queryset = Items.objects.all()
    serializer_class = ItemSerializer

class AutoCompleteItemView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ItemSerializer
    def post(self, request, format=None):
        name = request.data.get('name')
        response = get("https://api.spoonacular.com/food/ingredients/autocomplete",
            headers={
                'Content-Type': 'application/json',
                'x-api-key': apiKey, 
            },
            params={
                'query': name,
                'number': 10,
                'language': 'en',
                'metaInformation': False,
            }

        ).json()
        if len(response):
            for i in range(len(response)):
                response[i]['name'] = string.capwords(response[i].get('name'))
            return Response(response, status=status.HTTP_200_OK)
        else:
            return Response({'Bad request': 'No data found'}, status=status.HTTP_400_BAD_REQUEST)

class CreateItemView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ItemSerializer
    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        
        if serializer.is_valid():
            name = serializer.data.get('name')
            user = request.user
            name_query = Items.objects.filter(name=name, user=user)
            if name_query.exists():
                return Response({'Bad Request': 'Item already exists'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                item = Items(name=name, user=user)
                item.save()
                return Response(ItemSerializer(item).data, status=status.HTTP_201_CREATED)
        else:
            return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

class GetItemView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ItemSerializer
    def get(self, request, format=None):
        user = request.user
        items = user.items_set.all()
        serializer = ItemSerializer(items, many=True)
        if len(items):
            return Response(serializer.data)
        else:
            return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

            
class UpdateItemView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ItemSerializer
    def put(self, request, format=None):
        if serializer.is_valid():
            name = serializer.data.get('name')

            id = request.data.get('id')
            item_result = Items.objects.filter(id=id)
            serializer = self.serializer_class(data=request.data)
            if item_result.exists():
                item = item_result[0]
                item.name = name
                item.save(update_fields=['name'])
                return Response(ItemSerializer(item).data, status=status.HTTP_200_OK)  
            return Response({'msg':'Item not found'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'msg':'Item not found'}, status=status.HTTP_400_BAD_REQUEST)

class DeleteItemView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, format=None):
        name = request.data.get('name')
        user = request.user
        item_result = Items.objects.filter(name=name, user=user)
        if item_result.exists():
            item_result[0].delete()
            return Response({'msg':'Item deleted'}, status=status.HTTP_200_OK)
        return Response({'msg':'Item not found'}, status=status.HTTP_400_BAD_REQUEST)
