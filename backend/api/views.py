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
from openai import OpenAI
import os
import json
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
import uuid

client = OpenAI(
    api_key = os.getenv("OPENAI_API_KEY"),
)
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

    @action(detail=False, methods=["post"], permission_classes=[IsAuthenticated])
    def generate(self, request):
        categories = request.data.get("categories", [])
        difficulty = request.data.get("difficulty")

        if not difficulty:
            return Response(
                {"error": "Difficulty parameter is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not categories:
            return Response(
                {"error": "Categories parameter is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        categories_str = ', '.join([f'"{category}"' for category in categories])

        prompt = f"""
        You are an AI assistant tasked with generating technical interview questions for software engineering candidates. The questions should follow a structured format and be suitable for assessing various skills such as data structures, algorithms, system design, and problem-solving abilities. Please generate a question in the following JSON format, ensuring the response includes the specified categories and difficulty exactly as provided:

        {{
          "title": "<problem_title>",
          "difficulty": "{difficulty}",
          "categories": [{categories_str}],
          "problemDescription": "<problem_description>",
          "context": {{
            "codeSchema": "<code_or_table_relevant_to_problem>",
            "additionalInstructions": "<additional_instructions>"
          }},
          "task": "<task_to_do>",
          "examples": [
            {{
              "input": "<input_example>",
              "output": "<output_example>",
              "explanation": "<explanation_example>"
            }}
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
            {{
              "input": "<test_input_1>",
              "output": "<expected_output_1>"
            }},
            {{
              "input": "<test_input_2>",
              "output": "<expected_output_2>"
            }}
          ],
          "hints": [
            "<hint_1>",
            "<hint_2>"
          ],
          "solutionTemplate": "<solution_template>",
          "notes": "<additional_notes>"
        }}

        Ensure that the question tests for the following:
        - Core technical skills
        - Design and architecture abilities
        - Problem-solving and algorithmic thinking
        - Knowledge of best practices
        - Communication and explanation skills
        - Integration and interaction understanding

        Please provide a new question following this format.

        Example:
        {{
          "title": "Find the Most Popular Fruit",
          "difficulty": "Easy",
          "categories": ["SQL", "Aggregation"],
          "problemDescription": "You are managing a database for a local fruit market. The market wants to know which fruit is the most popular among their customers. Each purchase is recorded in a table named `purchases` which logs the customer_id, fruit_name, and the quantity of fruit purchased. Write an SQL query to find the name of the most popular fruit, i.e., the fruit that has been purchased the most.",
          "context": {{
            "codeSchema": "CREATE TABLE purchases (\\n  customer_id INT,\\n  fruit_name VARCHAR(50),\\n  quantity INT\\n);",
            "additionalInstructions": "The query should return the fruit name with the highest total quantity purchased. If there is a tie, return any one of the fruits."
          }},
          "task": "Write an SQL query to find the most popular fruit based on the total quantity purchased.",
          "examples": [
            {{
              "input": "purchases table:\\n+-------------+------------+----------+\\n| customer_id | fruit_name | quantity |\\n+-------------+------------+----------+\\n| 1           | Apple      | 10       |\\n| 2           | Banana     | 5        |\\n| 3           | Apple      | 15       |\\n| 4           | Orange     | 8        |\\n| 5           | Banana     | 7        |\\n+-------------+------------+----------+",
              "output": "Apple",
              "explanation": "Apple has been purchased in total quantity of 25 (10 + 15), which is higher than Banana (12) and Orange (8)."
            }}
          ],
          "constraints": [
            "The table `purchases` will have at least one record.",
            "Each `fruit_name` is a non-empty string.",
            "Each `quantity` is a positive integer."
          ],
          "tags": [
            "SQL",
            "Aggregation",
            "Group By"
          ],
          "testCases": [
            {{
              "input": "INSERT INTO purchases (customer_id, fruit_name, quantity) VALUES (1, 'Apple', 10);\\nINSERT INTO purchases (customer_id, fruit_name, quantity) VALUES (2, 'Banana', 5);\\nINSERT INTO purchases (customer_id, fruit_name, quantity) VALUES (3, 'Apple', 15);\\nINSERT INTO purchases (customer_id, fruit_name, quantity) VALUES (4, 'Orange', 8);\\nINSERT INTO purchases (customer_id, fruit_name, quantity) VALUES (5, 'Banana', 7);",
              "output": "Apple"
            }},
            {{
              "input": "INSERT INTO purchases (customer_id, fruit_name, quantity) VALUES (1, 'Banana', 10);\\nINSERT INTO purchases (customer_id, fruit_name, quantity) VALUES (2, 'Banana', 10);\\nINSERT INTO purchases (customer_id, fruit_name, quantity) VALUES (3, 'Apple', 15);\\nINSERT INTO purchases (customer_id, fruit_name, quantity) VALUES (4, 'Orange', 8);\\nINSERT INTO purchases (customer_id, fruit_name, quantity) VALUES (5, 'Apple', 5);",
              "output": "Banana"
            }}
          ],
          "hints": [
            "Consider using the SUM() function to aggregate the total quantities.",
            "Use the GROUP BY clause to group records by fruit_name.",
            "Order the results by total quantity in descending order and limit the output to one row."
          ],
          "solutionTemplate": "SELECT fruit_name\\nFROM purchases\\nGROUP BY fruit_name\\nORDER BY SUM(quantity) DESC\\nLIMIT 1;",
          "notes": "This problem helps practice SQL aggregation functions and grouping."
        }}
        """
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo-0125",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": prompt}
                ]
            )
            question_data = response.choices[0].message.content.strip()
            print("OpenAI Response JSON:", question_data)
            question_json = json.loads(question_data)
            
            problem_id = uuid.uuid4()
            question = Question.objects.create(
            problem_id=problem_id,
                title=question_json['title'],
                difficulty=question_json['difficulty'],
                categories=question_json['categories'],
                description=question_json['problemDescription'],
                task=question_json['task'],
                design=question_json['context']['codeSchema'],
                explanation=question_json['context']['additionalInstructions'],
                input_constraints=json.dumps(question_json['constraints']),
                example_input=question_json['examples'][0]['input'],
                example_output=question_json['examples'][0]['output'],
                answer=question_json['solutionTemplate'],
                design_solution=question_json['context']['codeSchema'],
                explanation_answer=question_json['examples'][0]['explanation'],
                tests=json.dumps(question_json['testCases']),
                hints=json.dumps(question_json['hints']),
                tags=json.dumps(question_json['tags']),
                notes=question_json['notes'],
                generated_by=request.user
            )
            serialized_question = QuestionSerializer(question)

            return Response(serialized_question.data, status=status.HTTP_200_OK)
        except json.JSONDecodeError as e:
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
