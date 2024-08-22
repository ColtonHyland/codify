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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def execute_code_js(request):
    try:
        data = request.data
        code = data.get('code')
        test_cases = data.get('test_cases', [])
        logger.debug(f"Received code: {code}")
        logger.debug(f"Received test cases: {test_cases}")

        if not code or not test_cases:
            return JsonResponse({'error': 'Invalid input data'}, status=400)

        function_name = extract_function_name(code)
        if not function_name:
            return JsonResponse({'error': 'Function name could not be extracted'}, status=400)
        logger.debug(f"Extracted function name: {function_name}")

        with tempfile.TemporaryDirectory() as tmpdirname:
            code_file_path = os.path.join(tmpdirname, 'script.js')

            with open(code_file_path, 'w') as code_file:
                code_file.write(code)
                code_file.write('\n\n')

                for i, test_case in enumerate(test_cases):
                    input_data = test_case['input']
                    input_data_escaped = json.dumps(input_data)  # Ensure proper escaping
                    logger.debug(f"Processing Test Case {i + 1} with input: {input_data_escaped}")

                    code_file.write(f"console.log('Test Case {i + 1} Output:');\n")
                    code_file.write(f"(function() {{\n")  # Start of IIFE
                    code_file.write(f"  try {{\n")
                    code_file.write(f"    const inputs = JSON.parse({input_data_escaped});\n")
                    code_file.write(f"    const result = {function_name}(...inputs);\n")
                    code_file.write(f"    console.log(JSON.stringify(result));\n")  # JSON.stringify for safe string output
                    code_file.write(f"  }} catch (error) {{\n")
                    code_file.write(f"    console.error('Error in Test Case {i + 1}:', error.message);\n")
                    code_file.write(f"  }}\n")
                    code_file.write(f"}})();\n\n")  # End of IIFE

                # Log the final script content
                with open(code_file_path, 'r') as f:
                    final_script_content = f.read()
                    logger.debug(f"Final script.js content:\n{final_script_content}")

            dockerfile_path = 'C:/Users/colto/Projects/codify/backend/Dockerfile'
            shutil.copy(dockerfile_path, tmpdirname)

            passed_tests = 0
            total_tests = len(test_cases)

            try:
                image, logs = docker_client.images.build(path=tmpdirname, tag='jsrunner', rm=True)
                logger.debug(f"Docker build logs:\n{''.join([log.get('stream', '') for log in logs])}")
                result = docker_client.containers.run(image.id, remove=True)
                result_output = result.decode('utf-8').strip()
                logger.debug(f"Docker run output:\n{result_output}")

                output_lines = result_output.splitlines()
                logger.debug(f"Processed output lines: {output_lines}")

                for i in range(total_tests):
                    try:
                        expected_output = test_cases[i]['expected_output']
                        test_case_output_prefix = f'Test Case {i + 1} Output:'
                        output_index = output_lines.index(test_case_output_prefix) + 1  # Find the exact line for output
                        actual_output = output_lines[output_index].strip()

                        logger.debug(f"Test Case {i + 1} actual output: {actual_output}")

                        try:
                            parsed_output = json.loads(actual_output)
                        except (ValueError, json.JSONDecodeError):
                            parsed_output = actual_output  # Fallback to plain string if JSON parsing fails

                        if str(parsed_output) == str(expected_output):
                            passed_tests += 1
                        else:
                            logger.error(f"Test Case {i + 1} failed: Expected {expected_output}, but got {parsed_output}")
                    except Exception as eval_error:
                        logger.error(f"Error processing Test Case {i + 1}: {eval_error}")

            except docker.errors.DockerException as e:
                logger.error(f'Docker execution failed: {e}')
                return JsonResponse({'error': f'Docker execution failed: {e}'}, status=500)

        return JsonResponse({'passed': passed_tests, 'total': total_tests}, status=200)

    except Exception as e:
        logger.error(f"An unexpected error occurred: {e}")
        return JsonResponse({'error': f'An unexpected error occurred: {e}'}, status=500)
      
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

def extract_function_name(code):
    """
    Extract the function name from the provided code.
    Supports Python, JavaScript, TypeScript, Java, and C++.
    """
    match = re.search(r'def\s+(\w+)\s*\(', code) or \
            re.search(r'function\s+(\w+)\s*\(', code) or \
            re.search(r'(\w+)\s*\(', code) or \
            re.search(r'public\s+static\s+.*\s+(\w+)\s*\(', code) or \
            re.search(r'\w+\s+(\w+)\s*\(', code)
    
    return match.group(1) if match else None

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

            # Ensure Node class is declared first
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
You are an AI assistant tasked with generating technical interview questions for software engineering candidates. The questions should follow a structured format and be suitable for assessing various skills such as data structures, algorithms, system design, and problem-solving abilities. Please generate a JavaScript problem in the following JSON format, ensuring the response includes the specified categories and difficulty exactly as provided:

{{
  "title": "<problem_title>",
  "difficulty": "{difficulty}",
  "categories": [{categories_str}],
  "language": "javascript",
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
      "output": "<expected_output_1>",
      "type": "<data_type>",
      "description": "Basic functionality test: A simple, expected use case."
    }},
    {{
      "input": "<test_input_2>",
      "output": "<expected_output_2>",
      "type": "<data_type>",
      "description": "Edge case test: Handles edge cases such as empty inputs, large numbers, etc."
    }},
    {{
      "input": "<test_input_3>",
      "output": "<expected_output_3>",
      "type": "<data_type>",
      "description": "Bad input test: Handles incorrect or unexpected input types."
    }},
    {{
      "input": "<test_input_4>",
      "output": "<expected_output_4>",
      "type": "<data_type>",
      "description": "Performance test: Test with large inputs to check performance."
    }},
    {{
      "input": "<test_input_5>",
      "output": "<expected_output_5>",
      "type": "<data_type>",
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
      "input": "[[1, 2, 3], [4, 5, 6]]",
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
      "input": "[[1, 2, 3], [4, 5, 6]]",
      "output": "[5, 7, 9]",
      "type": "array",
      "description": "Basic functionality test: A simple, expected use case."
    }},
    {{
      "input": "[[], [1, 2, 3]]",
      "output": "[1, 2, 3]",
      "type": "array",
      "description": "Edge case test: Handles empty first array."
    }},
    {{
      "input": "[[1, 2], ['a', 'b']]",
      "output": "Error",
      "type": "string",
      "description": "Bad input test: Handles non-numeric input."
    }},
    {{
      "input": "[[1000000, 2000000], [3000000, 4000000]]",
      "output": "[4000000, 6000000]",
      "type": "array",
      "description": "Performance test: Test with large numbers."
    }},
    {{
      "input": "[[1, 2, 3], [4, 5, 6, 7]]",
      "output": "[5, 7, 9, 7]",
      "type": "array",
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
def test_code_execute(request):
    try:
        data = request.data
        code = data.get('code')
        test_cases = data.get('test_cases', [])
        logger.debug(f"Received code for test: {code}")
        logger.debug(f"Received test cases for test: {test_cases}")

        if not code or not test_cases:
            return JsonResponse({'error': 'Invalid input data'}, status=400)

        # Create a temporary directory to hold the code file
        with tempfile.TemporaryDirectory() as tmpdirname:
            code_file_path = os.path.join(tmpdirname, 'script.js')

            with open(code_file_path, 'w') as code_file:
                # Write the user's code to the file
                code_file.write(code)
                code_file.write('\n\n')

                for i, test_case in enumerate(test_cases):
                    input_data = test_case['input']
                    input_data_escaped = json.dumps(input_data)
                    logger.debug(f"Test Case {i + 1} input: {input_data_escaped}")

                    code_file.write(f"console.log('Test Case {i + 1} Output:');\n")
                    code_file.write(f"(function() {{\n")
                    code_file.write(f"  try {{\n")
                    code_file.write(f"    const inputs = JSON.parse({input_data_escaped});\n")
                    code_file.write(f"    const result = eval(`{code}`)(...inputs);\n")
                    code_file.write(f"    console.log(JSON.stringify(result));\n")
                    code_file.write(f"  }} catch (error) {{\n")
                    code_file.write(f"    console.error('Error in Test Case {i + 1}:', error.message);\n")
                    code_file.write(f"  }}\n")
                    code_file.write(f"}})();\n\n")

                logger.debug(f"Final script.js content for test:\n{open(code_file_path).read()}")

            # Run the Docker container with the created script
            try:
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

                # Simple string matching for testing purposes
                passed_tests = 0
                output_lines = output.splitlines()

                for i, test_case in enumerate(test_cases):
                    expected_output = test_case['output']
                    test_case_output_prefix = f'Test Case {i + 1} Output:'
                    if test_case_output_prefix in output_lines:
                        output_index = output_lines.index(test_case_output_prefix) + 1
                        actual_output = output_lines[output_index].strip()
                        if actual_output == expected_output:
                            passed_tests += 1

                return JsonResponse({'passed': passed_tests, 'total': len(test_cases)}, status=200)

            except subprocess.TimeoutExpired:
                logger.error("Docker execution timed out")
                return JsonResponse({'error': 'Docker execution timed out'}, status=500)
            except subprocess.CalledProcessError as e:
                logger.error(f"Subprocess error: {str(e)}")
                return JsonResponse({'error': str(e)}, status=500)

    except Exception as e:
        logger.error(f"An unexpected error occurred during test execution: {str(e)}")
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)


class AttemptViewSet(viewsets.ModelViewSet):
    queryset = Attempt.objects.all()
    serializer_class = AttemptSerializer


class QuestionHistoryViewSet(viewsets.ModelViewSet):
    queryset = QuestionHistory.objects.all()
    serializer_class = QuestionHistorySerializer
