from django.contrib import admin
from django.urls import path, include
from api.views import home, csrf_token, signup, login, logout

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('', home, name='home'),
    path('csrf/', csrf_token, name='csrf_token'),
    path('accounts/signup/', signup, name='user-signup'),
    path('accounts/login/', login, name='user-login'),
    path('accounts/logout/', logout, name='user-logout'),
]
