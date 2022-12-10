from django.shortcuts import render, redirect
from .models import Account
from .serializer import AccountSerializer, LoginSerializer
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
# Create your views here.
class AccountView(generics.ListAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

class RegisterView(APIView):
    serializer_class = AccountSerializer
    
    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            first_name = serializer.data.get('first_name')
            last_name = serializer.data.get('last_name')
            user_name = serializer.data.get('user_name')
            email = serializer.data.get('email')
            password = serializer.data.get('password')

            if Account.objects.filter(email=email).exists():
                return Response({'message:': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
            
            if Account.objects.filter(user_name=user_name).exists():
                return Response({'message:': 'User already exists'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                account = Account(first_name=first_name, last_name=last_name, user_name=user_name, email=email, password=password)
                return Response(AccountSerializer(account).data, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    serializer_class = LoginSerializer
    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            
            user_name = serializer.data.get('user_name')
            password = serializer.data.get('password')
            
            if user_name is not None and password is not None:
                user = Account.objects.filter(user_name=user_name, password=password)
                if user.exists():
                    session_key = self.request.session.session_key
                    return Response(session_key, status=status.HTTP_200_OK)
                else:
                    return Response({'message:': 'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'message:':'Login Unsuccessfully'}, status=status.HTTP_400_BAD_REQUEST)
