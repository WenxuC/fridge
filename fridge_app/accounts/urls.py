from django.urls import path
from .views import RegisterView, MyTokenObtainPairView, AccountView

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
urlpatterns = [
    path('register', RegisterView.as_view()),
    path('accounts', AccountView.as_view()),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]