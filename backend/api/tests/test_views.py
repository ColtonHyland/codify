from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from api.models import Question, Attempt, QuestionHistory
import unittest
from django.core import mail

class UserTests(APITestCase):
    def setUp(self):
        self.client = APIClient()

    def test_create_user(self):
        response = self.client.post('/api/signup/', {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': 'password123'
        })
        print(f"Signup response status code: {response.status_code}")
        print(f"Signup response data: {response.data}")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, 'testuser')

        # Check if the confirmation email is sent
        print(f"Mail outbox length: {len(mail.outbox)}")
        self.assertEqual(len(mail.outbox), 1)
        if len(mail.outbox) > 0:
            print(f"Mail outbox content: {mail.outbox[0].body}")
            self.assertIn('testuser@example.com', mail.outbox[0].to)
        
            # Extract the confirmation link from the email
            email_body = mail.outbox[0].body
            confirm_link = email_body.split('http://localhost:8000')[1].split('\n')[0]
        
            # Visit the confirmation link
            response = self.client.get(confirm_link)
            print(f"Email confirmation response status code: {response.status_code}")
            print(f"Email confirmation response content: {response.content}")
            self.assertEqual(response.status_code, status.HTTP_200_OK)

            # Check if the user is now active
            user = User.objects.get(username='testuser')
            self.assertTrue(user.is_active)

    def test_signin_user(self):
        user = User.objects.create_user(username='testuser', password='password123')
        user.is_active = True
        user.save()
        response = self.client.post('/accounts/login/', {
            'login': 'testuser',
            'password': 'password123'
        })
        print(f"Signin response status code: {response.status_code}")
        print(f"Signin response URL: {response.url}")
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertEqual(response.url, '/')

    def test_signout_user(self):
        user = User.objects.create_user(username='testuser', password='password123')
        user.is_active = True
        user.save()
        self.client.force_authenticate(user=user)
        response = self.client.post('/accounts/logout/')
        print(f"Signout response status code: {response.status_code}")
        print(f"Signout response URL: {response.url}")
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertEqual(response.url, '/')

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
