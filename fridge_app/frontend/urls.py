from django.urls import path
from .views import index

urlpatterns = [
     path('', index),
     path('login', index),
     path('dashboard', index),
     path('register', index),
     path('about', index),
     path('contact', index)
]
