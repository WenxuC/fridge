from django.db import models
from django.contrib.auth.models import User
# Create your models here.
class Recipe(models.Model):
    recipeID = models.CharField(max_length=50)
    title = models.CharField(max_length=150)
    source = models.URLField(max_length=200)
    image = models.URLField(max_length=200, default=True)
    favorite = models.BooleanField(default=False)
    serving = models.IntegerField(null=True, default=None)
    time = models.IntegerField(null=True, default=None)
    missing_ingredient_list = models.CharField(null=True, default=None, max_length=500)
    user = models.ForeignKey(User, default=None, on_delete=models.CASCADE)
    

    