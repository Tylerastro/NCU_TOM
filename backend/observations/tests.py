import datetime

from django.test import TestCase
from django.utils import timezone
from helpers.models import Tags, Users
from rest_framework import status
from rest_framework.test import (APIClient, APIRequestFactory,
                                 force_authenticate)
from targets.models import Target

from .models import Observation


class ObservationModelTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        test_user = Users.objects.create(username='testuser', password='12345', email='a@a.com', role=Users.roles.STUDENT,
                                         title=Users.titles.MS, institute='testinstitute', first_name='testfirst', last_name='testlast')
        test_tag = Tags.objects.create(name='testtag', user=test_user)
        test_target = Target.objects.create(
            user=test_user,
            name='NGC 3824',
            ra=123.456,
            dec=78.90,
            redshift=0.123,
            notes="test notes on target"
        )
        observation = Observation.objects.create(
            name='TestObservation',
            user=test_user,
            observatory=Observation.observatories.LULIN,
            start_date=timezone.now() - datetime.timedelta(days=1),
            end_date=timezone.now() + datetime.timedelta(days=1),
            priority=Observation.priorities.HIGH,
            status=Observation.statuses.PENDING
        )
        observation.targets.set([test_target])

    def test_observation_content(self):
        observation = Observation.objects.last()
        expected_object_name = f'{observation.name}'
        self.assertEqual(expected_object_name, 'TestObservation')
        self.assertEqual(observation.observatory,
                         Observation.observatories.LULIN)
        self.assertEqual(observation.targets.first().name, 'NGC 3824')
        self.assertEqual(observation.targets.first().ra, 123.456)
        self.assertEqual(observation.targets.first().dec, 78.90)
        self.assertEqual(observation.priority, Observation.priorities.HIGH)
        self.assertEqual(observation.status, Observation.statuses.PENDING)
        self.assertEqual(observation.user.username, 'testuser')
