from django.urls import path
from .views import ItemView, CreateItemView, GetItemView
urlpatterns = [
    path('item', ItemView.as_view()),
    path('createItem', CreateItemView.as_view()),
    path('getItems', GetItemView.as_view())
]