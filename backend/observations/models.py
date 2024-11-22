import uuid
from datetime import datetime

from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from helpers.models import Comments
from observations.lulin_models import Filters, Instruments
from targets.models import Target


class Priorities(models.IntegerChoices):
    HIGH = 1, _('High')
    MEDIUM = 2, _('Medium')
    LOW = 3, _('Low')
    TOO = 4, _('Too')


class RunStatuses(models.IntegerChoices):
    SUCCESS = 1, _('Success')
    FAIL = 2, _('Fail')
    PENDING = 3, _('Pending')
    PARTIAL_SUCCESS = 4, _('Partial Success')
    RESCHEDULED = 5, _('Rescheduled')


class ObservationStatuses(models.IntegerChoices):
    PREP = 1
    PENDING = 2
    IN_PROGRESS = 3
    DONE = 4
    EXPIRED = 5
    DENIED = 6
    POSTPONED = 7


class Observatories(models.IntegerChoices):
    LULIN = 1


class Observation(models.Model):

    class Meta:
        db_table = 'Observation'

    Priorities = Priorities
    Observatories = Observatories
    statuses = ObservationStatuses

    name = models.CharField(max_length=100, null=False, blank=True)
    user = models.ForeignKey('helpers.User',
                             on_delete=models.CASCADE, related_name='observations')
    observatory = models.IntegerField(
        choices=Observatories.choices, default=Observatories.LULIN)
    start_date = models.DateTimeField(null=False)
    end_date = models.DateTimeField(null=False)
    targets = models.ManyToManyField(Target)
    priority = models.IntegerField(
        choices=Priorities.choices, default=Priorities.LOW)
    status = models.IntegerField(
        choices=statuses.choices, default=statuses.PREP)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    code = models.TextField(null=True, blank=True)
    tags = models.ManyToManyField('helpers.Tags', related_name='observations')
    comments = models.ManyToManyField(
        'helpers.Comments', related_name='observations')

    def __str__(self):
        return self.name

    def clean(self):
        super().clean()
        if self.start_date and self.end_date:
            if self.start_date >= self.end_date:
                raise ValidationError("Start date must be before end date.")

        if self.start_date and self.start_date < timezone.now():
            raise ValidationError("Start date cannot be in the past.")

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
        self.full_clean()
        super().save(*args, **kwargs)

    def delete(self):
        self.deleted_at = datetime.now()
        self.save()

    @property
    def target_count(self):
        return self.targets.count()


class BaseRun(models.Model):
    Priorities = Priorities
    Statuses = RunStatuses

    class Meta:
        abstract = True

    observation = models.ForeignKey('Observation', on_delete=models.CASCADE)
    target = models.ForeignKey('targets.Target', on_delete=models.CASCADE)
    priority = models.IntegerField(
        choices=Priorities.choices,
        default=Priorities.LOW
    )
    filter = models.IntegerField(_("Filter"), null=True)
    binning = models.IntegerField(default=1)
    frames = models.IntegerField(default=1)
    instrument = models.IntegerField(_("Instruments"), null=True)
    exposure_time = models.IntegerField(default=10)
    start_date = models.DateTimeField(null=True)
    end_date = models.DateTimeField(null=True)
    status = models.IntegerField(
        _("Status"), choices=Statuses.choices, default=Statuses.PENDING)

    class Meta:
        abstract = True

    def get_filters(self):
        raise NotImplementedError("Subclasses must implement get_filters()")

    def get_instruments(self):
        raise NotImplementedError(
            "Subclasses must implement get_instruments()")


class LulinRun(BaseRun):

    Filters = Filters
    Instruments = Instruments

    filter = models.IntegerField(
        _("Filter"), choices=Filters.choices, default=1, null=True)
    instrument = models.IntegerField(
        _("Instruments"), choices=Instruments.choices, default=1, null=True)

    class Meta:
        db_table = 'LulinRun'

    def get_filters(self):
        return self.Filters.choices

    def get_instruments(self):
        return self.Instruments.choices
