from django.urls import path
from .views import AccountView, RegisterView, LoginView

urlpatterns = [
    path('accounts', AccountView.as_view()),
    path('register', RegisterView.as_view()),
    path('login', LoginView.as_view())
]