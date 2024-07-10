from django.contrib import admin
from .models import Question, Attempt, QuestionHistory

admin.site.register(Question)
admin.site.register(Attempt)
admin.site.register(QuestionHistory)
