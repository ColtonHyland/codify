from django.http import HttpResponse
from django.contrib.auth.models import User
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Question, Attempt, QuestionHistory
from .serializers import UserSerializer, QuestionSerializer, AttemptSerializer, QuestionHistorySerializer
import openai
import os
import json

# Load the OpenAI API key from the environment
openai.api_key = os.getenv("OPENAI_API_KEY")

def home(request):
    return HttpResponse("<h1>Welcome to Codify</h1>")

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

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
            response = openai.chat.completions.create(
                model="gpt-3.5-turbo-0125",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": prompt}
                ]
            )
            
            question_data = response.choices[0].message.content
            print(f"Raw question data: {question_data}") # Debugging
            question_json = json.loads(question_data)
            print(f"Parsed question JSON: {question_json}") # Debugging
            
            return Response(question_json['question'], status=status.HTTP_200_OK)
        except json.JSONDecodeError as e:
            print("JSONDecodeError:", str(e))
            return Response({"error": "Failed to decode JSON from the OpenAI response."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            print("Exception:", str(e))
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AttemptViewSet(viewsets.ModelViewSet):
    queryset = Attempt.objects.all()
    serializer_class = AttemptSerializer

class QuestionHistoryViewSet(viewsets.ModelViewSet):
    queryset = QuestionHistory.objects.all()
    serializer_class = QuestionHistorySerializer
