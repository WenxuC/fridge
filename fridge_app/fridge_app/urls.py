from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('account/', include('accounts.urls')),
    path('items/', include('items.urls')),
    path('', include('frontend.urls'))
]
