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
You are an AI assistant tasked with generating technical interview questions for software engineering candidates...
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
