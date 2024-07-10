from django.db import models
from django.contrib.auth.models import User

class Question(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    task = models.TextField()  # Task component
    design = models.TextField()  # Design component
    explanation = models.TextField()  # Explanation component
    input_constraints = models.TextField()
    example_input = models.TextField()
    example_output = models.TextField()
    answer = models.TextField()  # Detailed solution for the coding task
    design_solution = models.TextField()  # Detailed design solution
    explanation_answer = models.TextField()  # Detailed explanation answer
    tests = models.JSONField(default=list)  # List of tests
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
