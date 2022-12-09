from django.shortcuts import render, redirect
from django.contrib import messages, auth
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
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            first_name = serializer.data.get('first_name')
            last_name = serializer.data.get('last_name')
            user_name = serializer.data.get('user_name')
            email = serializer.data.get('email')
            password = serializer.data.get('password')

            if Account.objects.filter(email=email).exists():
                messages.error(request, "Email is already taken")
                return redirect('register')
            
            if Account.objects.filter(user_name=user_name).exists():
                messages.error(request, "User name is already taken")
                return redirect('register')
            else:
                account = Account(first_name=first_name, last_name=last_name, user_name=user_name, email=email, password=password)
                account.save()
                return Response(AccountSerializer(account).data, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    serializer_class = LoginSerializer
    def post(self, request, format=None):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            
            user_name = serializer.data.get('user_name')
            password = serializer.data.get('password')
            
            if user_name is not None and password is not None:
                user = Account.objects.filter(user_name=user_name, password=password)
                if user.exists():
                    messages.success(request, 'You are now logged in')
                    return Response({'message:': 'Login Successfully'}, status=status.HTTP_202_ACCEPTED)
                else:
                    messages.error(request, 'Invalid Credentials')
                    return Response({'message:': 'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'message:':'Login Unsuccessfully'}, status=status.HTTP_400_BAD_REQUEST)
