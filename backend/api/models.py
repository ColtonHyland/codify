from django.db import models
from django.contrib.auth.models import User
import uuid

class Question(models.Model):
    problem_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    title = models.CharField(max_length=255)
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
    hints = models.JSONField(default=list)  # Add this line
    created_at = models.DateTimeField(auto_now_add=True)
    generated_by = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title

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
