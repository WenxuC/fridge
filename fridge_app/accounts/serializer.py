from rest_framework import serializers
from .models import User
from rest_framework import  serializers
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

# User serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


# Register serializer
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username','password', 'email')
        extra_kwargs = {
            'password': {'write_only': True}
        }

        def create(self, validated_data):
            user = User.objects.create_user(validated_data['username'],
            validated_data['password'], validated_data['email'])
            return user