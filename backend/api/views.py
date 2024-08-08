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
from openai import OpenAI
import os
import json
import docker
from docker.errors import DockerException, ImageNotFound
import tempfile
import tarfile
import io
import re
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
import uuid

docker_client = docker.from_env()

openai_client = OpenAI(
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
    if request.user.is_authenticated:
        return JsonResponse(
            {"username": request.user.username, "email": request.user.email}
        )
    else:
        return JsonResponse({"error": "User not authenticated"}, status=401)


@api_view(["GET"])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def csrf_token(request):
    csrf_token = get_token(request)
    return JsonResponse({"csrfToken": csrf_token})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def execute_code_js(request):
    try:
        data = json.loads(request.body)
        logger.debug(f"Received execute_code_js request with data: {data}")

        code = data['code']
        test_cases = data['test_cases']

        results = []

        for test_case in test_cases:
            input_data = test_case['input']
            expected_output = test_case['expected_output']
            logger.debug(f"Processing test case with input: {input_data} and expected output: {expected_output}")
            result = run_code_in_docker("javascript", code, input_data, expected_output)
            results.append(result)
            logger.debug(f"Test case result: {result}")

        logger.debug(f"All test case results: {results}")
        return JsonResponse({'results': results})

    except Exception as e:
        logger.error(f"Error executing code: {str(e)}")
        return JsonResponse({'error': str(e)}, status=500)
  
# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def execute_code(request):
#     try:
#         data = json.loads(request.body)
#         logger.debug(f"Received execute_code request with data: {data}")
        
#         # hard_coded_test = data['hardCodedTest']  # Changed line
#         # code = hard_coded_test['code']  # Changed line
#         # language = hard_coded_test['language']  # Changed line
#         # test_cases = hard_coded_test['tests']  # Changed line
#         code = data['code']
#         language = data['language']
#         test_cases = data['test_cases']

#         results = []

#         for test_case in test_cases:
#             input_data = test_case['input']
#             expected_output = test_case['expected_output']
#             logger.debug(f"Processing test case with input: {input_data} and expected output: {expected_output}")
#             result = run_code_in_docker(language, code, input_data, expected_output)
#             results.append(result)
#             logger.debug(f"Test case result: {result}")

#         logger.debug(f"All test case results: {results}")
#         return JsonResponse({'results': results})

#     except Exception as e:
#         logger.error(f"Error executing code: {str(e)}")
#         return JsonResponse({'error': str(e)}, status=500)

def extract_function_name(code, language):
    logger.debug(f"Extracting function name from code: {code} for language: {language}")
    if language in ['python', 'javascript', 'typescript']:
        match = re.search(r'def\s+(\w+)\s*\(', code)
        if not match:
            match = re.search(r'function\s+(\w+)\s*\(', code)
            if not match:
                match = re.search(r'(\w+)\s*\(', code)
        if match:
            logger.debug(f"Extracted function name: {match.group(1)}")
            return match.group(1)
    elif language == 'java':
        match = re.search(r'public\s+static\s+.*\s+(\w+)\s*\(', code)
        if match:
            logger.debug(f"Extracted function name: {match.group(1)}")
            return match.group(1)
    elif language == 'cpp':
        match = re.search(r'\w+\s+(\w+)\s*\(', code)
        if match:
            logger.debug(f"Extracted function name: {match.group(1)}")
            return match.group(1)
    logger.debug("Function name not found")
    return None

def create_tar_file(file_path, file_content):
    logger.debug(f"Creating tar file for path: {file_path}")
    file_data = io.BytesIO()
    with tarfile.open(fileobj=file_data, mode='w') as tar:
        tarinfo = tarfile.TarInfo(name=file_path)
        tarinfo.size = len(file_content)
        tar.addfile(tarinfo, io.BytesIO(file_content.encode('utf-8')))
    file_data.seek(0)
    logger.debug("Tar file created successfully")
    return file_data

def run_code_in_docker(language, code, input_data, expected_output):
    try:
        logger.debug(f"Running code in Docker for language: {language}")
        function_name = extract_function_name(code, language)
        if not function_name:
            logger.debug("Function name not found in code")
            return {'input': input_data, 'expected_output': expected_output, 'actual_output': 'Function name not found', 'passed': False}

        logger.debug(f"Using Docker image for language {language}")

        if language == 'javascript':
            image = 'node:14'
            file_extension = '.js'
            run_command = f'node /tmp/code{file_extension}'
            input_code = f"const inputs = {input_data};\n"
            code_to_run = f"""
{input_code}
{code}

console.log({function_name}(...inputs));
"""

        else:
            logger.debug("Unsupported language")
            return {'input': input_data, 'expected_output': expected_output, 'actual_output': 'Unsupported language', 'passed': False}

        logger.debug(f"Creating Docker container with image: {image}")
        container = docker_client.containers.create(image, command='/bin/sh', tty=True, stdin_open=True)
        tar_data = create_tar_file(f'code{file_extension}', code_to_run)
        logger.debug(f"Copying tar file to container")
        container.put_archive('/tmp', tar_data)
        logger.debug("Starting container")
        container.start()
        logger.debug("Executing code in container")
        exec_result = container.exec_run(cmd=run_command, stdin=True, tty=True)
        output = exec_result.output.decode('utf-8').strip()
        logger.debug(f"Execution output: {output}")
        container.stop()
        container.remove()

        passed = output == expected_output
        logger.debug(f"Test case passed: {passed}")
        return {'input': input_data, 'expected_output': expected_output, 'actual_output': output, 'passed': passed}

    except DockerException as e:
        logger.error(f"Docker exception: {str(e)}")
        return {'input': input_data, 'expected_output': expected_output, 'actual_output': str(e), 'passed': False}
    except Exception as e:
        logger.error(f"Exception: {str(e)}")
        return {'input': input_data, 'expected_output': expected_output, 'actual_output': str(e), 'passed': False}

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    authentication_classes = (TokenAuthentication,)


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    
    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def list_questions(self, request):
        questions = Question.objects.all()
        serializer = QuestionSerializer(questions, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["get"], permission_classes=[IsAuthenticated])
    def get_question(self, request, pk=None):
        if not request.user.is_authenticated:
            logger.error("User not authenticated")
            return Response({"error": "User not authenticated"}, status=status.HTTP_403_FORBIDDEN)

        try:
            question = Question.objects.get(pk=pk)
            serializer = QuestionSerializer(question)
            return Response(serializer.data)
        except Question.DoesNotExist:
            logger.error(f"Question with ID {pk} not found")
            return Response({"error": "Question not found"}, status=status.HTTP_404_NOT_FOUND)


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
            response = openai_client.chat.completions.create(
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
