from django.core.mail import send_mail
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = 'Send a test email'

    def handle(self, *args, **kwargs):
        send_mail(
            'Test Email',
            'This is a test email.',
            'your-email@example.com',
            ['recipient-email@example.com'],
            fail_silently=False,
        )
        self.stdout.write(self.style.SUCCESS('Test email sent successfully'))
