# Generated by Django 5.0.7 on 2024-07-23 20:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_alter_question_hints'),
    ]

    operations = [
        migrations.AddField(
            model_name='question',
            name='categories',
            field=models.JSONField(default=list),
        ),
        migrations.AddField(
            model_name='question',
            name='difficulty',
            field=models.CharField(default='Easy', max_length=50),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='question',
            name='notes',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='question',
            name='tags',
            field=models.JSONField(default=list),
        ),
    ]
