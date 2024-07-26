from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, QuestionViewSet, AttemptViewSet, QuestionHistoryViewSet, send_test_email, execute_code

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'questions', QuestionViewSet)
router.register(r'attempts', AttemptViewSet)
router.register(r'history', QuestionHistoryViewSet)

custom_urls = [
    path('questions/get_question/<int:pk>/', QuestionViewSet.as_view({'get': 'get_question'}), name='get-question'),
    path('code/execute/', execute_code, name='execute-code'),
]

urlpatterns = [
    path('', include(router.urls)),
    path('api/', include(router.urls)),
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/registration/', include('dj_rest_auth.registration.urls')),
    path('send-test-email/', send_test_email, name='send_test_email'),
    *custom_urls,
]

urlpatterns += router.urls
