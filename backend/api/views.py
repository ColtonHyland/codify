import logging
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.models import User
from django.core.mail import send_mail
from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .models import Question, Attempt, QuestionHistory
from .serializers import (
    UserSerializer,
    QuestionSerializer,
    AttemptSerializer,
    QuestionHistorySerializer,
)

# Load the OpenAI API key from the environment
import openai
import os
import json
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout

openai.api_key = os.getenv("OPENAI_API_KEY")

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


def home(request):
    return HttpResponse("<h1>Welcome to Codify</h1>")


def send_test_email(request):
    send_mail(
        "Test Email",
        "This is a test email sent from Django.",
        "iamaspacepirate@gmail.com",
        ["colthyland@gmail.com"],
        fail_silently=False,
    )
    return HttpResponse("Test email sent")


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user(request):
    logger.debug("get_user endpoint reached")
    if request.user.is_authenticated:
        logger.debug(f"Authenticated user: {request.user.username}")
        return JsonResponse(
            {"username": request.user.username, "email": request.user.email}
        )
    else:
        logger.debug("User not authenticated")
        return JsonResponse({"error": "User not authenticated"}, status=401)


@api_view(["GET"])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def csrf_token(request):
    csrf_token = get_token(request)
    logger.debug(f"CSRF Token sent to client: {csrf_token}")
    return JsonResponse({"csrfToken": csrf_token})


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = (TokenAuthentication,)


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

    @action(detail=False, methods=["post"])
    def generate(self, request):
        prompt = """
        You are an AI assistant tasked with generating technical interview questions for software engineering candidates. The questions should follow a structured format and be suitable for assessing various skills such as data structures, algorithms, system design, and problem-solving abilities. Please generate a question in the following JSON format:

        {
          "problemId": "<unique_problem_id>",
          "title": "<problem_title>",
          "difficulty": "<problem_difficulty>",
          "categories": ["<category_1>", "<category_2>", "..."],
          "problemDescription": "<problem_description>",
          "context": {
            "codeSchema": "<code_or_table_relevant_to_problem>",
            "additionalInstructions": "<additional_instructions>"
          },
          "task": "<task_to_do>",
          "examples": [
            {
              "input": "<input_example>",
              "output": "<output_example>",
              "explanation": "<explanation_example>"
            }
          ],
          "constraints": [
            "<constraint_1>",
            "<constraint_2>",
            "..."
          ],
          "tags": [
            "<tag_1>",
            "<tag_2>",
            "..."
          ],
          "testCases": [
            {
              "input": "<test_input_1>",
              "output": "<expected_output_1>"
            },
            {
              "input": "<test_input_2>",
              "output": "<expected_output_2>"
            }
          ],
          "hints": [
            "<hint_1>",
            "<hint_2>"
          ],
          "solutionTemplate": "<solution_template>",
          "notes": "<additional_notes>"
        }

        Ensure that the question tests for the following:
        - Core technical skills
        - Design and architecture abilities
        - Problem-solving and algorithmic thinking
        - Knowledge of best practices
        - Communication and explanation skills
        - Integration and interaction understanding

        Please provide a new question following this format.
        """
        try:
            response = openai.Completion.create(
                model="gpt-3.5-turbo-0125", prompt=prompt
            )
            question_data = response.choices[0].text
            logger.debug(f"Raw question data: {question_data}")  # Debugging
            question_json = json.loads(question_data)
            logger.debug(f"Parsed question JSON: {question_json}")  # Debugging

            return Response(question_json["question"], status=status.HTTP_200_OK)
        except json.JSONDecodeError as e:
            logger.error("JSONDecodeError:", str(e))
            return Response(
                {"error": "Failed to decode JSON from the OpenAI response."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        except Exception as e:
            logger.error("Exception:", str(e))
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class AttemptViewSet(viewsets.ModelViewSet):
    queryset = Attempt.objects.all()
    serializer_class = AttemptSerializer


class QuestionHistoryViewSet(viewsets.ModelViewSet):
    queryset = QuestionHistory.objects.all()
    serializer_class = QuestionHistorySerializer
