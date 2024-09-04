from django.db import models
from django.contrib.auth.models import User
import uuid

class Question(models.Model):
    problem_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    title = models.CharField(max_length=255)
    difficulty = models.CharField(max_length=50)
    categories = models.JSONField(default=list)
    language = models.CharField(max_length=50, default='javascript') 
    description = models.TextField()
    task = models.TextField()
    design = models.TextField()
    explanation = models.TextField()
    input_constraints = models.TextField()
    example_input = models.TextField()
    example_output = models.TextField()
    answer = models.TextField()
    design_solution = models.TextField()
    explanation_answer = models.TextField()
    tests = models.JSONField(default=list)
    hints = models.JSONField(default=list)
    tags = models.JSONField(default=list)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    generated_by = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title

class UserQuestionProgress(models.Model):
    STATUS_CHOICES = [
        ('not_attempted', 'Not Attempted'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_attempted')
    attempts = models.IntegerField(default=0)
    last_attempted = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    code_progress = models.TextField(blank=True, null=True)  # Save the current code written by the user

    def __str__(self):
        return f"{self.user.username} - {self.question.title} - {self.status}"

class Attempt(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    code_submitted = models.TextField()
    result = models.TextField()
    feedback = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Attempt by {self.user.username} on {self.question.title}"

class QuestionHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"History for {self.user.username} on {self.question.title}"
