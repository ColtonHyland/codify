from django.contrib import admin
from django.urls import path, include
from api.views import home, UserCreate

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('', home, name='home'),
    path('accounts/', include('allauth.urls')),
    path('api/signup/', UserCreate.as_view(), name='user-signup'),
]
