from django.db import models
from django.contrib.auth.models import User
# Create your models here.
class Recipe(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    title = models.CharField(max_length=150)
    source = models.URLField(max_length=200)
    image = models.URLField(max_length=200, default=True)
    summary = models.TextField(null=True, default=True)
    favorite = models.BooleanField(default=False)
    user = models.ForeignKey(User, default=None, on_delete=models.CASCADE)
    

    