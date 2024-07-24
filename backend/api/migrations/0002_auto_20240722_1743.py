from django.db import migrations, models
import uuid

def generate_uuids(apps, schema_editor):
    Question = apps.get_model('api', 'Question')
    for question in Question.objects.all():
        if not question.problem_id:
            question.problem_id = uuid.uuid4()
            question.save()

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),  # replace 'previous_migration' with the last migration name
    ]

    operations = [
        migrations.AddField(
            model_name='question',
            name='problem_id',
            field=models.UUIDField(default=uuid.uuid4, editable=False, unique=True),
        ),
        migrations.RunPython(generate_uuids),
        migrations.AlterField(
            model_name='question',
            name='problem_id',
            field=models.UUIDField(editable=False, unique=True),
        ),
    ]