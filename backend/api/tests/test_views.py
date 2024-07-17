from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from api.models import Question, Attempt, QuestionHistory
import unittest

class UserTests(APITestCase):
    def setUp(self):
        self.client = APIClient()

    def test_create_user(self):
        response = self.client.post('/api/signup/', {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': 'password123'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, 'testuser')

class QuestionTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='password123')
        self.client.force_authenticate(user=self.user)

    @unittest.skip("Skipping OpenAI API call to save quota.")
    def test_generate_question(self):
        response = self.client.post('/api/questions/generate/')
        print(f"Response data: {response.data}")  # Debugging statement
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Access the nested 'question' dictionary
        question_data = response.data
        
        self.assertIn('title', question_data)
        self.assertIn('description', question_data)
        self.assertIn('task', question_data)
        self.assertIn('design', question_data)
        self.assertIn('explanation', question_data)
        self.assertIn('input_constraints', question_data)
        self.assertIn('example_input', question_data)
        self.assertIn('example_output', question_data)
        self.assertIn('tests', question_data)
        self.assertIn('answer', question_data)
        self.assertIn('design_solution', question_data)
        self.assertIn('explanation_answer', question_data)

class AttemptTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='password123')
        self.question = Question.objects.create(
            title="Test Question",
            description="Test Description",
            task="Test Task",
            design="Test Design",
            explanation="Test Explanation",
            input_constraints="Test Constraints",
            example_input="Test Input",
            example_output="Test Output",
            answer="Test Answer",
            design_solution="Test Design Solution",
            explanation_answer="Test Explanation Answer",
            generated_by=self.user
        )
        self.client.force_authenticate(user=self.user)

    def test_create_attempt(self):
        response = self.client.post('/api/attempts/', {
            'user': self.user.id,
            'question': self.question.id,
            'code_submitted': 'print("Hello, World!")',
            'result': 'Hello, World!',
            'feedback': 'Looks good!'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Attempt.objects.count(), 1)
        self.assertEqual(Attempt.objects.get().code_submitted, 'print("Hello, World!")')

class QuestionHistoryTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='password123')
        self.question = Question.objects.create(
            title="Test Question",
            description="Test Description",
            task="Test Task",
            design="Test Design",
            explanation="Test Explanation",
            input_constraints="Test Constraints",
            example_input="Test Input",
            example_output="Test Output",
            answer="Test Answer",
            design_solution="Test Design Solution",
            explanation_answer="Test Explanation Answer",
            generated_by=self.user
        )
        self.client.force_authenticate(user=self.user)

    def test_question_history(self):
        response = self.client.post('/api/history/', {
            'user': self.user.id,
            'question': self.question.id
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(QuestionHistory.objects.count(), 1)
        self.assertEqual(QuestionHistory.objects.get().question, self.question)
