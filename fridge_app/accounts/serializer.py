from rest_framework import serializers
from .models import Account

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ('first_name', 'last_name', 'user_name', 'email', 'password')

class LoginSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(validators=[])
    class Meta:
        model = Account
        fields = ('user_name', 'password')