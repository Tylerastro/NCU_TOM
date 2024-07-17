import uuid
from datetime import timedelta

from django.core.exceptions import ValidationError
from django.test import TestCase
from django.utils import timezone
from helpers.models import Comments, Tags, Users
from observations.models import Lulin, Observation, Target


class TestObservationModel(TestCase):
    def setUp(self):
        user_profile = {
            'username': 'admin',
            'password': 'password',
            'email': 'admin@ncu.edu.com',
            'role': Users.roles.ADMIN,
            'institute': 'NCU',
            'first_name': 'Tyler',
            'last_name': 'Lin',
            'use_demo_targets': False,
            'is_superuser': True
        }
        self.user = Users.objects.create(**user_profile)
        self.target = Target.objects.create(
            name="Test Target", user=self.user, ra=12, dec=34)
        self.start_date = timezone.now()
        self.end_date = self.start_date + timedelta(hours=1)

    def test_observation_creation(self):
        observation = Observation.objects.create(
            user=self.user,
            start_date=self.start_date,
            end_date=self.end_date
        )
        self.assertIsNotNone(observation.pk)
        self.assertTrue(observation.name)  # Auto-generated name
        self.assertEqual(observation.status, Observation.statuses.PREP)

    def test_observation_str_method(self):
        observation = Observation.objects.create(
            name="Test Observation",
            user=self.user,
            start_date=self.start_date,
            end_date=self.end_date
        )
        self.assertEqual(str(observation), "Test Observation")

    def test_auto_name_generation(self):
        observation = Observation.objects.create(
            user=self.user,
            start_date=self.start_date,
            end_date=self.end_date
        )
        self.assertEqual(len(observation.name), 8)

    def test_status_change_comment(self):
        observation = Observation.objects.create(
            user=self.user,
            start_date=self.start_date,
            end_date=self.end_date
        )
        observation.status = Observation.statuses.PENDING
        observation.save()

        self.assertEqual(observation.comments.count(), 1)
        comment = observation.comments.first()
        self.assertEqual(
            comment.context, f"Observation {observation.name} is now Pending.")

    def test_soft_delete(self):
        observation = Observation.objects.create(
            user=self.user,
            start_date=self.start_date,
            end_date=self.end_date
        )
        observation.delete()
        self.assertIsNotNone(observation.deleted_at)
        self.assertTrue(Observation.objects.filter(pk=observation.pk).exists())

    def test_targets_relationship(self):
        observation = Observation.objects.create(
            user=self.user,
            start_date=self.start_date,
            end_date=self.end_date
        )
        observation.targets.add(self.target)
        self.assertEqual(observation.targets.count(), 1)
        self.assertEqual(observation.targets.first(), self.target)

    def test_tags_relationship(self):
        tag = Tags.objects.create(name="TestTag", user=self.user)
        observation = Observation.objects.create(
            user=self.user,
            start_date=self.start_date,
            end_date=self.end_date
        )
        observation.tags.add(tag)
        self.assertEqual(observation.tags.count(), 1)
        self.assertEqual(observation.tags.first(), tag)


class TestLulinModel(TestCase):
    def setUp(self):
        user_profile = {
            'username': 'admin',
            'password': 'password',
            'email': 'admin@ncu.edu.com',
            'role': Users.roles.ADMIN,
            'institute': 'NCU',
            'first_name': 'Tyler',
            'last_name': 'Lin',
            'use_demo_targets': False,
            'is_superuser': True
        }
        self.user = Users.objects.create(**user_profile)
        self.target = Target.objects.create(
            name="Test Target", user=self.user, ra=12, dec=34)
        self.observation = Observation.objects.create(
            user=self.user,
            start_date=timezone.now(),
            end_date=timezone.now() + timedelta(hours=1)
        )

    def test_lulin_creation(self):
        lulin = Lulin.objects.create(
            observation=self.observation,
            target=self.target
        )
        self.assertIsNotNone(lulin.pk)
        self.assertEqual(lulin.priority, Lulin.priorities.LOW)
        self.assertEqual(lulin.binning, 1)
        self.assertEqual(lulin.frames, 1)
        self.assertEqual(lulin.exposure_time, 10)

    def test_default_filters(self):
        lulin = Lulin.objects.create(
            observation=self.observation,
            target=self.target
        )
        expected_filters = {'u': True, 'g': True,
                            'r': True, 'i': True, 'z': True}
        self.assertEqual(lulin.filters, expected_filters)

    def test_default_instruments(self):
        lulin = Lulin.objects.create(
            observation=self.observation,
            target=self.target
        )
        expected_instruments = {'LOT': True, 'SLT': False, 'TRIPOL': False}
        self.assertEqual(lulin.instruments, expected_instruments)

    def test_custom_filters(self):
        custom_filters = {'u': False, 'g': True,
                          'r': True, 'i': False, 'z': True}
        lulin = Lulin.objects.create(
            observation=self.observation,
            target=self.target,
            filters=custom_filters
        )
        self.assertEqual(lulin.filters, custom_filters)

    def test_custom_instruments(self):
        custom_instruments = {'LOT': False, 'SLT': True, 'TRIPOL': True}
        lulin = Lulin.objects.create(
            observation=self.observation,
            target=self.target,
            instruments=custom_instruments
        )
        self.assertEqual(lulin.instruments, custom_instruments)

    def test_priority_choices(self):
        lulin = Lulin.objects.create(
            observation=self.observation,
            target=self.target,
            priority=Lulin.priorities.HIGH
        )
        self.assertEqual(lulin.priority, Lulin.priorities.HIGH)

        with self.assertRaises(ValidationError):
            observation = Lulin.objects.create(
                observation=self.observation,
                target=self.target,
                priority=10  # Invalid priority
            )
            observation.full_clean()
