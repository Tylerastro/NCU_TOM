import uuid
from datetime import datetime

from django.db import models
from helpers.models import Comments
from targets.models import Target


class Observation(models.Model):

    class observatories(models.IntegerChoices):
        LULIN = 1

    class priorities(models.IntegerChoices):
        HIGH = 1
        MEDIUM = 2
        LOW = 3
        Too = 4

    class statuses(models.IntegerChoices):
        PREP = 1
        PENDING = 2
        IN_PROGRESS = 3
        DONE = 4
        EXPIRED = 5
        DENIED = 6
        POSTPONED = 7

    name = models.CharField(max_length=100, null=False, blank=True)
    user = models.ForeignKey('helpers.Users',
                             on_delete=models.CASCADE, related_name='observations')
    observatory = models.IntegerField(
        choices=observatories.choices, default=observatories.LULIN)
    start_date = models.DateTimeField(null=False)
    end_date = models.DateTimeField(null=False)
    targets = models.ManyToManyField(Target)
    priority = models.IntegerField(
        choices=priorities.choices, default=priorities.LOW)
    status = models.IntegerField(
        choices=statuses.choices, default=statuses.PREP)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True)
    code = models.TextField(null=True, blank=True)
    tags = models.ManyToManyField('helpers.Tags', related_name='observations')
    comments = models.ManyToManyField(
        'helpers.Comments', related_name='observations')

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.name:
            self.name = str(uuid.uuid4())[:8]

        if self.pk and self.status == self.statuses.PENDING:
            old_observation = Observation.objects.get(pk=self.pk)
            if old_observation.status == old_observation.statuses.PREP:
                comment = Comments.objects.create(
                    context=f"Observation {self.name} is now Pending.",
                )
                self.comments.add(comment)

        super().save(*args, **kwargs)

    def delete(self):
        self.deleted_at = datetime.now()
        self.save()


def get_filters():
    return {
        'u': True,
        'g': True,
        'r': True,
        'i': True,
        'z': True
    }


def get_instruments():
    return {
        'LOT': True,
        'SLT': False,
        'TRIPOL': False
    }


class Lulin(models.Model):

    class priorities(models.IntegerChoices):
        HIGH = 1
        MEDIUM = 2
        LOW = 3
        Too = 4

    observation = models.ForeignKey(Observation, on_delete=models.CASCADE)
    target = models.ForeignKey(Target, on_delete=models.CASCADE)
    priority = models.IntegerField(
        choices=priorities.choices, default=priorities.LOW
    )
    filters = models.JSONField(default=get_filters)
    binning = models.IntegerField(default=1)
    frames = models.IntegerField(default=1)
    instruments = models.JSONField(default=get_instruments)
    exposure_time = models.IntegerField(default=10)
    start_date = models.DateTimeField(null=True)
    end_date = models.DateTimeField(null=True)
