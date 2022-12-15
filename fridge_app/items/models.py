from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Items(models.Model):
    quantity = models.CharField(max_length=50)
    name = models.CharField(max_length=100)
    expiration = models.DateField()
    user = models.ForeignKey(User, default=None, on_delete=models.CASCADE)