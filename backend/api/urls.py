from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import UserViewSet, QuestionViewSet, AttemptViewSet, QuestionHistoryViewSet, UserQuestionProgressViewSet, send_test_email, execute_code_js

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'questions', QuestionViewSet)
router.register(r'attempts', AttemptViewSet)
router.register(r'history', QuestionHistoryViewSet)
router.register(r'user-progress', UserQuestionProgressViewSet, basename='user-progress')


custom_urls = [
    path('questions/get_question/<int:pk>/', QuestionViewSet.as_view({'get': 'get_question'}), name='get-question'),
    path('code/execute/js/', execute_code_js, name='execute-code-js'),
    # path('test-code-execute/', execute_code_js, name='test_code_execute'),
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
