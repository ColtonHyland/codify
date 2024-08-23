import logging
import subprocess
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
import shutil
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
        # categories = request.data.get("categories", [])
        difficulty = request.data.get("difficulty")

        if not difficulty:
            return Response(
                {"error": "Difficulty parameter is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # if not categories:
        #     return Response(
        #         {"error": "Categories parameter is required."},
        #         status=status.HTTP_400_BAD_REQUEST
        #     )

        # categories_str = ', '.join([f'"{category}"' for category in categories])

        prompt = f"""
You are an AI assistant tasked with generating technical interview questions for software engineering candidates. The questions should follow a structured format and be suitable for assessing various skills such as data structures, algorithms, system design, and problem-solving abilities. Please generate a JavaScript problem in the following JSON format, ensuring the response includes the specified language and difficulty exactly as provided:

{{
  "title": "<problem_title>",
  "difficulty": "{difficulty}",
  "categories": [<categories>],
  "language": "Javascript",
  "problemDescription": "<problem_description>",
  "context": {{
    "codeSchema": "<code_or_table_relevant_to_problem>",
    "additionalInstructions": "<additional_instructions>"
  }},
  "task": "<task_to_do>",
  "examples": [
    {{
      "input": "<function_name>(<input_example>)",
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
      "label": "Test 1",
      "input": "<function_name>(<test_input_1>)",
      "output": "<expected_output_1>",
      "description": "Basic functionality test: A simple, expected use case."
    }},
    {{
      "label": "Test 2",
      "input": "<function_name>(<test_input_2>)",
      "output": "<expected_output_2>",
      "description": "Edge case test: Handles edge cases such as empty inputs, large numbers, etc."
    }},
    {{
      "label": "Test 3",
      "input": "<function_name>(<test_input_3>)",
      "output": "<expected_output_3>",
      "description": "Bad input test: Handles incorrect or unexpected input types."
    }},
    {{
      "label": "Test 4",
      "input": "<function_name>(<test_input_4>)",
      "output": "<expected_output_4>",
      "description": "Performance test: Test with large inputs to check performance."
    }},
    {{
      "label": "Test 5",
      "input": "<function_name>(<test_input_5>)",
      "output": "<expected_output_5>",
      "description": "Additional complex case: An additional case that tests complex or unexpected logic."
    }}
  ],
  "hints": [
    "<hint_1>",
    "<hint_2>"
  ],
  "solution": "<solution>",
  "notes": "<additional_notes>"
}}

Ensure the problem tests the following:
- Core technical skills
- Design and architecture abilities
- Problem-solving and algorithmic thinking
- Knowledge of best practices
- Communication and explanation skills
- Integration and interaction understanding

Please provide a new question following this format. The problem should include 4 to 9 well-designed test cases that cover:
- Basic functionality
- Edge cases
- Bad inputs
- Performance considerations
- Additional complex cases

Example:
{{
  "title": "Sum Two Arrays",
  "difficulty": "Easy",
  "categories": ["Array", "Basic"],
  "language": "javascript",
  "problemDescription": "Write a function that takes two arrays of numbers and returns a new array where each element is the sum of the elements at the corresponding positions in the input arrays.",
  "context": {{
    "codeSchema": "function sumArrays(arr1, arr2) {{\\n  // Your code here\\n}}",
    "additionalInstructions": "Handle different array lengths by treating missing elements as 0."
  }},
  "task": "Implement the sumArrays function.",
  "examples": [
    {{
      "input": "sumArrays([1, 2, 3], [4, 5, 6])",
      "output": "[5, 7, 9]",
      "explanation": "Each element is the sum of the corresponding elements in the input arrays."
    }}
  ],
  "constraints": [
    "Input arrays will contain only integers.",
    "Input arrays will have at least one element."
  ],
  "tags": ["Array", "Basic"],
  "testCases": [
    {{
      "label": "Test 1",
      "input": "sumArrays([1, 2, 3], [4, 5, 6])",
      "output": "[5, 7, 9]",
      "description": "Basic functionality test: A simple, expected use case."
    }},
    {{
      "label": "Test 2",
      "input": "sumArrays([], [1, 2, 3])",
      "output": "[1, 2, 3]",
      "description": "Edge case test: Handles empty first array."
    }},
    {{
      "label": "Test 3",
      "input": "sumArrays([1, 2], ['a', 'b'])",
      "output": "Error",
      "description": "Bad input test: Handles non-numeric input."
    }},
    {{
      "label": "Test 4",
      "input": "sumArrays([1000000, 2000000], [3000000, 4000000])",
      "output": "[4000000, 6000000]",
      "description": "Performance test: Test with large numbers."
    }},
    {{
      "label": "Test 5",
      "input": "sumArrays([1, 2, 3], [4, 5, 6, 7])",
      "output": "[5, 7, 9, 7]",
      "description": "Additional complex case: Different array lengths."
    }}
  ],
  "hints": [
    "Consider iterating through the arrays simultaneously.",
    "Use a loop to handle the summing of corresponding elements."
  ],
  "solution": "function sumArrays(arr1, arr2) {{\\n  return arr1.map((num, idx) => num + (arr2[idx] || 0));\\n}}",
  "notes": "This problem tests basic array manipulation and handling of different array lengths."
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
                answer=question_json['solution'],
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

@api_view(['POST'])
@permission_classes([AllowAny])
def execute_code_js(request):
    try:
        data = request.data
        code = data.get('code')
        test_cases = data.get('test_cases', [])
        logger.debug(f"Received code for execution:\n{code}")
        logger.debug(f"Received test cases:\n{test_cases}")

        if not code or not test_cases:
            return JsonResponse({'error': 'Invalid input data'}, status=400)

        # Create a temporary directory to hold the code file
        with tempfile.TemporaryDirectory() as tmpdirname:
            code_file_path = os.path.join(tmpdirname, 'script.js')

            # Write the user's code into script.js and dynamically add test cases
            with open(code_file_path, 'w') as code_file:
                # Write the user-provided function code
                code_file.write(code)
                code_file.write('\n\n')

                # Add dynamic test case calls based on the test_cases input
                code_file.write("console.log('Running dynamic tests:');\n")
                for i, test_case in enumerate(test_cases):
                    input_data = test_case['input']
                    expected_output = test_case.get('output')
                    if expected_output is None:
                        logger.error(f"Missing 'output' in test case {i + 1}: {test_case}")
                        return JsonResponse({'error': f"Missing 'output' in test case {i + 1}"}, status=400)
                    code_file.write(f"const actual_output_{i + 1} = {input_data};\n")
                    code_file.write(f"console.log('Test {i + 1} Output:', actual_output_{i + 1});\n")
                    code_file.write(f"if (String(actual_output_{i + 1}) === String({expected_output})) {{\n")
                    code_file.write(f"    console.log('Test {i + 1} Passed');\n")
                    code_file.write("} else {\n")
                    code_file.write(f"    console.log('Test {i + 1} Failed: Expected {expected_output} but got', actual_output_{i + 1});\n")
                    code_file.write("}\n\n")

                # Indicate the script completed
                code_file.write("console.log('User code executed successfully.');\n")
            
            # Log the entire content of script.js before execution
            with open(code_file_path, 'r') as script_file:
                script_content = script_file.read()
                logger.debug(f"Final script.js content:\n{script_content}")

            # Run the Docker container with the created script
            try:
                logger.debug("Running the Docker container...")
                result = subprocess.run(
                    ['docker', 'run', '--rm', '-v', f'{tmpdirname}:/usr/src/app', 'node:14', 'node', '/usr/src/app/script.js'],
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    timeout=10,
                )

                output = result.stdout.decode().strip()
                error = result.stderr.decode().strip()

                logger.debug(f"Docker output:\n{output}")
                logger.debug(f"Docker error (if any):\n{error}")

                # Parse output to determine which tests passed and failed
                passed_tests = []
                failed_tests = []

                for i, test_case in enumerate(test_cases):
                    test_number = f"Test {i + 1}"
                    if f"{test_number} Passed" in output:
                        passed_tests.append(test_number)
                    elif f"{test_number} Failed" in output:
                        failed_tests.append(test_number)

                return JsonResponse({
                    'passed_tests': passed_tests,
                    'failed_tests': failed_tests,
                    'error': error
                }, status=200)

            except subprocess.TimeoutExpired:
                logger.error("Docker execution timed out")
                return JsonResponse({'error': 'Docker execution timed out'}, status=500)
            except subprocess.CalledProcessError as e:
                logger.error(f"Subprocess error: {str(e)}")
                return JsonResponse({'error': str(e)}, status=500)

    except Exception as e:
        logger.error(f"An unexpected error occurred during execution: {str(e)}")
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)


class AttemptViewSet(viewsets.ModelViewSet):
    queryset = Attempt.objects.all()
    serializer_class = AttemptSerializer


class QuestionHistoryViewSet(viewsets.ModelViewSet):
    queryset = QuestionHistory.objects.all()
    serializer_class = QuestionHistorySerializer
