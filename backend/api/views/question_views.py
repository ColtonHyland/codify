import logging
import uuid
import json
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from api.models import Question, Attempt, QuestionHistory
from api.serializers import QuestionSerializer, AttemptSerializer, QuestionHistorySerializer
from openai import OpenAI
import os

logger = logging.getLogger(__name__)
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

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
        try:
            question = Question.objects.get(pk=pk)
            serializer = QuestionSerializer(question)
            return Response(serializer.data)
        except Question.DoesNotExist:
            logger.error(f"Question with ID {pk} not found")
            return Response({"error": "Question not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=["post"], permission_classes=[IsAuthenticated])
    def generate(self, request):
        difficulty = request.data.get("difficulty")

        if not difficulty:
            return Response(
                {"error": "Difficulty parameter is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

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

**The difficulty of the problem must match the "{difficulty}" level exactly, as specified in this request.**

**Ensure that the solution provided is valid for all test cases included in the question.**

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
                model="gpt-3.5-turbo",
                messages=[{"role": "system", "content": "You are a helpful assistant."}, {"role": "user", "content": prompt}]
            )
            question_data = response.choices[0].message.content.strip()
            question_json = json.loads(question_data)

            question = Question.objects.create(
                problem_id=uuid.uuid4(),
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
        except json.JSONDecodeError:
            return Response(
                {"error": "Failed to decode JSON from OpenAI response."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class AttemptViewSet(viewsets.ModelViewSet):
    queryset = Attempt.objects.all()
    serializer_class = AttemptSerializer

class QuestionHistoryViewSet(viewsets.ModelViewSet):
    queryset = QuestionHistory.objects.all()
    serializer_class = QuestionHistorySerializer
