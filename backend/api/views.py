import logging
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.models import User
from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Question, Attempt, QuestionHistory
from .serializers import UserSerializer, QuestionSerializer, AttemptSerializer, QuestionHistorySerializer, UserSignupSerializer
import openai
import os
import json
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout

# Load the OpenAI API key from the environment
openai.api_key = os.getenv("OPENAI_API_KEY")

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def home(request):
    return HttpResponse("<h1>Welcome to Codify</h1>")

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request):
    user = request.user
    return Response({'username': user.username})

@api_view(['GET'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def csrf_token(request):
    csrf_token = get_token(request)
    logger.debug(f"CSRF Token sent to client: {csrf_token}")
    return JsonResponse({'csrfToken': csrf_token})

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSignupSerializer
    permission_classes = (AllowAny,)

@api_view(['POST'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def signup(request):
    logger.debug("Signup request received")
    logger.debug(f"Request headers: {request.headers}")
    logger.debug(f"Request cookies: {request.COOKIES}")
    logger.debug(f"Request data: {request.data}")

    if request.method == 'POST':
        data = request.data
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not (username and email and password):
            logger.error("All fields are required")
            return JsonResponse({'error': 'All fields are required'}, status=400)

        try:
            user = User.objects.create_user(username=username, email=email, password=password)
            user.save()
            logger.debug("User created successfully")
            return JsonResponse({'success': True})
        except Exception as e:
            logger.error(f"Error creating user: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
    
    logger.error("Invalid request method")
    return JsonResponse({'error': 'Invalid request'}, status=400)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    logger.debug("Login request received")
    logger.debug(f"Request headers: {request.headers}")
    logger.debug(f"Request cookies: {request.COOKIES}")
    logger.debug(f"Request data: {request.data}")

    if request.method == 'POST':
        data = request.data
        email = data.get('email')
        password = data.get('password')
        user = authenticate(request, username=email, password=password)

        if user is not None:
            auth_login(request, user)
            logger.debug("User authenticated successfully")
            return JsonResponse({'success': True})
        else:
            logger.error("Invalid credentials")
            return JsonResponse({'error': 'Invalid credentials'}, status=400)
    
    logger.error("Invalid request method")
    return JsonResponse({'error': 'Invalid request'}, status=400)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def logout(request):
    logger.debug("Logout request received")
    if request.method == 'POST':
        auth_logout(request)
        logger.debug("User logged out successfully")
        return JsonResponse({'success': True})
    
    logger.error("Invalid request method")
    return JsonResponse({'error': 'Invalid request'}, status=400)

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

    @action(detail=False, methods=['post'])
    def generate(self, request):
        prompt = """
        You are an AI assistant tasked with generating technical interview questions for software engineering candidates. The questions should follow a structured format and be suitable for assessing various skills such as data structures, algorithms, system design, and problem-solving abilities. Please generate a question in the following JSON format:

        {
          "question": {
            "title": "Short title of the question",
            "description": "A detailed description of the problem statement, including context and any necessary background information.",
            "task": "A specific coding task or algorithm that the candidate needs to implement. This could be related to data structures, algorithms, or other core technical skills.",
            "design": "A design question where the candidate needs to design a system or component. This could involve system architecture, database schema, API design, etc.",
            "explanation": "An explanation question where the candidate needs to explain the relationship or interaction between specific elements, such as two database tables, frontend and backend components, client and server interactions, etc.",
            "input_constraints": "Details about the input constraints for the coding task. Specify the format, range, and type of inputs.",
            "example_input": "Provide an example input that conforms to the input constraints.",
            "example_output": "Provide the expected output for the example input.",
            "tests": [
              {
                "test_input": "Test input value 1",
                "expected_output": "Expected output value 1"
              },
              {
                "test_input": "Test input value 2",
                "expected_output": "Expected output value 2"
              },
              {
                "test_input": "Test input value 3",
                "expected_output": "Expected output value 3"
              },
              {
                "test_input": "Test input value 4",
                "expected_output": "Expected output value 4"
              },
              {
                "test_input": "Test input value 5",
                "expected_output": "Expected output value 5"
              }
            ],
            "answer": "A detailed solution for the coding task, including any necessary code and explanation.",
            "design_solution": "A detailed design solution, including diagrams, schema, or architectural components if applicable.",
            "explanation_answer": "A detailed explanation for the explanation component, clarifying the relationships or interactions."
          }
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
                model="gpt-3.5-turbo-0125",
                prompt=prompt
            )
            question_data = response.choices[0].text
            logger.debug(f"Raw question data: {question_data}") # Debugging
            question_json = json.loads(question_data)
            logger.debug(f"Parsed question JSON: {question_json}") # Debugging

            return Response(question_json['question'], status=status.HTTP_200_OK)
        except json.JSONDecodeError as e:
            logger.error("JSONDecodeError:", str(e))
            return Response({"error": "Failed to decode JSON from the OpenAI response."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            logger.error("Exception:", str(e))
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AttemptViewSet(viewsets.ModelViewSet):
    queryset = Attempt.objects.all()
    serializer_class = AttemptSerializer

class QuestionHistoryViewSet(viewsets.ModelViewSet):
    queryset = QuestionHistory.objects.all()
    serializer_class = QuestionHistorySerializer
