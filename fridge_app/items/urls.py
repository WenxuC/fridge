from django.urls import path
from .views import ItemView, CreateItemView, GetItemView, UpdateItemView, DeleteItemView
urlpatterns = [
    path('item', ItemView.as_view()),
    path('createItem', CreateItemView.as_view()),
    path('getItems', GetItemView.as_view()),
    path('updateItem', UpdateItemView.as_view()),
    path('deleteItem', DeleteItemView.as_view())
]