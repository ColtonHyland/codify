import logging
from django.http import JsonResponse, HttpResponse
from django.core.mail import send_mail
from django.contrib.auth.models import User
from django.middleware.csrf import get_token
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from api.models import UserQuestionProgress
from api.serializers import UserSerializer, UserQuestionProgressSerializer

logger = logging.getLogger(__name__)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user(request):
    if request.user.is_authenticated:
        return JsonResponse(
            {"username": request.user.username, "email": request.user.email}
        )
    return JsonResponse({"error": "User not authenticated"}, status=401)

@api_view(["GET"])
@permission_classes([AllowAny])
def csrf_token(request):
    csrf_token = get_token(request)
    return JsonResponse({"csrfToken": csrf_token})

def send_test_email(request):
    send_mail(
        "Test Email",
        "This is a test email sent from Django.",
        "iamaspacepirate@gmail.com",
        ["colthyland@gmail.com"],
        fail_silently=False,
    )
    return HttpResponse("Test email sent")

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = (TokenAuthentication,)

class UserQuestionProgressViewSet(viewsets.ModelViewSet):
    queryset = UserQuestionProgress.objects.all()
    serializer_class = UserQuestionProgressSerializer

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def update_progress(self, request):
        print(f"Received progress update: {request.data}")  # Log incoming data
        user = request.user
        question_id = request.data.get('question_id')
        code = request.data.get('code')
        passed_tests = request.data.get('passed_tests', [])
        failed_tests = request.data.get('failed_tests', [])
        
        print(f"Updating progress for question {question_id} by user {user.id}")
        print(f"Code submitted: {code}")
        print(f"Passed tests: {passed_tests}, Failed tests: {failed_tests}")

        if not question_id or not code:
            return Response({"error": "question_id and code are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            progress, created = UserQuestionProgress.objects.get_or_create(
                user=user, question_id=question_id
            )

            # Update progress and status based on the code and tests
            progress.code_progress = code  # Always update the code_progress field

            if len(passed_tests) > 0 and len(failed_tests) == 0:
                progress.status = 'completed'
                progress.completed_at = timezone.now()
            elif progress.code_progress != "" and len(failed_tests) > 0:
                progress.status = 'in_progress'
            elif not progress.code_progress or len(passed_tests) == 0:
                progress.status = 'not_attempted'
            else:
                progress.status = 'in_progress'

            progress.passed_tests = passed_tests    
            progress.failed_tests = failed_tests
            progress.attempts += 1
            progress.save()
            print(f"Progress updated: {progress}")
            return Response({"message": "Progress updated"}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return Response({"error": f"Unexpected error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def home(request):
    return HttpResponse("<h1>Welcome to Codify</h1>")
