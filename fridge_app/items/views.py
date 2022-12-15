from django.shortcuts import render
from .models import Items
from django.contrib.auth.models import User
from .serializer import ItemSerializer
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
class ItemView(generics.ListAPIView):
    queryset = Items.objects.all()
    serializer_class = ItemSerializer

class CreateItemView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ItemSerializer
    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            quantity = serializer.data.get('quantity')
            name = serializer.data.get('name')
            expiration = serializer.data.get('expiration')
            id = serializer.data.get('user')
            user = User.objects.get(id=id)
            item = Items(quantity=quantity, name=name, expiration=expiration, user=user)
            item.save()
            return Response(ItemSerializer(item).data, status=status.HTTP_201_CREATED)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


class GetItemView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ItemSerializer
    def get(self, request, format=None):
        user = request.user
        items = user.items_set.all()
        serializer = ItemSerializer(items, many=True)
        return Response(serializer.data)
            

# class UpdateItemView(APIView):
#     serializer_class = ItemSerializer
#     def put(self, request, format=None):
#         serializer = self.serializer_class(data=request.data)
#         if serializer.is_valid():
#             quantity = serializer.data.get('quantity')
#             name = serializer.data.get('name')
#             expiration = serializer.data.get('expiration')
#             #queryset = Items.objects.filter()
#             item = Items(quantity=quantity, name=name, expiration=expiration)
#             item.save()
# class DeleteItemView(APIView):
#     pass