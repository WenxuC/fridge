from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Items(models.Model):
    name = models.CharField(max_length=100)
    user = models.ForeignKey(User, default=None, on_delete=models.CASCADE)