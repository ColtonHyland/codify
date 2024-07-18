from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, QuestionViewSet, AttemptViewSet, QuestionHistoryViewSet, UserCreate, signup, login, logout

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'questions', QuestionViewSet)
router.register(r'attempts', AttemptViewSet)
router.register(r'history', QuestionHistoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('signup/', UserCreate.as_view(), name='signup'),
    path('signup/', signup, name='signup'),
    path('login/', login, name='login'),
    path('logout/', logout, name='logout'),
]

urlpatterns += router.urls
