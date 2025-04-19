import os
import tempfile
from datetime import datetime

import pytz
from django.conf import settings
from django.core.mail import EmailMessage
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.template.loader import render_to_string
from django.utils import timezone
from observations.models import Observation

taipei_tz = pytz.timezone('Asia/Taipei')


@receiver(post_save, sender=Observation)
def send_in_progress_html_email(sender, instance: Observation, **kwargs):
    """
    A post_save signal handler that sends HTML emails when an Observation is saved with IN_PROGRESS status.

    1. Triggers after an Observation is saved
    2. Checks if status is IN_PROGRESS
    3. Prepares email context with observation details
    4. Creates HTML email using a template
    5. Attaches observation code as a text file if present
    6. Sends email to configured recipients

    Email contains:
    - Username
    - Observation name
    - Target count
    - Observatory
    - Start date
    - Priority level
    - Comments (if any)
    - Observation code (as attachment)

    Recipients:
    - Main: LULIN_MAIL environment variable
    - CC: w39398898@gmail.com and user's email
    """

    try:
        if instance.status == Observation.statuses.IN_PROGRESS:
            taipei_time = instance.start_date.astimezone(taipei_tz)
            # Prepare template context
            context = {
                'user_name': instance.user.username,
                'observation_name': instance.name,
                'target_count': instance.target_count or 0,
                'observatory': instance.get_observatory_display(),
                'start_date': taipei_time.strftime('%Y-%m-%d %H:%M'),
                'priority': instance.get_priority_display(),
                'current_year': timezone.now().year,
                'comments': instance.comments.all().order_by('created_at')
            }

            # Render HTML email template
            html_message = render_to_string('email/observation.html', context)

            # Create a temporary file with the code
            temp_file_path = None
            if instance.code:
                cleaned_code_lines = [
                    line.strip() for line in instance.code.splitlines()]

                with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.txt') as temp_file:
                    temp_file.write('\n'.join(cleaned_code_lines))
                    temp_file_path = temp_file.name

            try:
                # Create EmailMessage object
                email = EmailMessage(
                    subject=f'{instance.user.username} submitted observation {instance.name}',
                    body=html_message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    to=[os.getenv('LULIN_MAIL', None)],
                    cc=['w39398898@gmail.com', instance.user.email],
                )

                # Set the email to use HTML
                email.content_subtype = 'html'

                # Attach the file if it exists
                if temp_file_path and os.path.exists(temp_file_path):
                    email.attach_file(temp_file_path, mimetype='text/plain')

                # Send the email
                email.send(fail_silently=False)

            finally:
                # Clean up the temporary file
                if temp_file_path and os.path.exists(temp_file_path):
                    os.unlink(temp_file_path)

    except Observation.DoesNotExist:
        # This is a new instance being created
        pass
