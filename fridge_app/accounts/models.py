from django.db import models

# Create your models here.
class Account(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    user_name = models.CharField(max_length=100, unique=True)
    email = models.EmailField(max_length=254, unique=True, primary_key=True)
    password = models.CharField(max_length=20)