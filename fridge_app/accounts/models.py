from django.db import models

# Create your models here.
class User(models.Model):
    username = models.CharField(max_length=100, unique=True, primary_key=True)
    email = models.EmailField(max_length=254, unique=True)
    password = models.CharField(max_length=150)