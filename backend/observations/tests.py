from datetime import datetime, timedelta
from unittest.mock import MagicMock, patch

from django.core.exceptions import ValidationError
from django.test import TestCase
from django.utils import timezone
from helpers.models import Tags, User
from observations.lulin_models import Filters
from observations.models import (LulinRun, Observation, Observatories,
                                 Priorities, RunStatuses, Target)
from rest_framework import status
from rest_framework.test import APIClient

from .lulin import LulinScheduler
from .serializers import ObservationGetSerializer


class TestObservationModel(TestCase):
    def setUp(self):
        user_profile = {
            'username': 'admin',
            'password': 'password',
            'email': 'admin@ncu.edu.com',
            'role': User.roles.ADMIN,
            'institute': 'NCU',
            'first_name': 'Tyler',
            'last_name': 'Lin',
            'use_demo_targets': False,
            'is_superuser': True
        }
        self.user = User.objects.create(**user_profile)
        self.target = Target.objects.create(
            name="Test Target", user=self.user, ra=12, dec=34)
        self.start_date = timezone.now() + timedelta(hours=+1)
        self.end_date = self.start_date + timedelta(hours=+2)

    def test_observation_creation(self):
        observation = Observation.objects.create(
            user=self.user,
            start_date=self.start_date,
            end_date=self.end_date
        )
        self.assertIsNotNone(observation.pk)
        self.assertTrue(observation.name)
        self.assertEqual(observation.status, Observation.statuses.PREP)

    def test_observation_creation_with_valid_dates(self):
        start_date = timezone.now() + timedelta(hours=1)
        end_date = start_date + timedelta(hours=5)
        observation = Observation.objects.create(
            user=self.user,
            start_date=start_date,
            end_date=end_date
        )
        self.assertEqual(Observation.objects.count(), 1)
        self.assertEqual(observation.user, self.user)

    def test_observation_creation_with_invalid_dates(self):
        start_date = timezone.now() + timedelta(hours=1)
        end_date = start_date - timedelta(hours=5)

        with self.assertRaises(ValidationError) as context:
            Observation.objects.create(
                user=self.user,
                start_date=start_date,
                end_date=end_date
            )

        self.assertTrue(
            'Start date must be before end date.' in str(context.exception))


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

    def test_target_count_property(self):
        observation = Observation.objects.create(
            user=self.user,
            start_date=self.start_date,
            end_date=self.end_date
        )
        self.assertEqual(observation.target_count, 0)

        # Add targets and verify count updates
        observation.targets.add(self.target)
        self.assertEqual(observation.target_count, 1)

        # Add another target
        target2 = Target.objects.create(
            name="Test Target 2", user=self.user, ra=56, dec=78)
        observation.targets.add(target2)
        self.assertEqual(observation.target_count, 2)

    def test_observatory_validation(self):
        # Test valid observatory
        observation = Observation.objects.create(
            user=self.user,
            start_date=self.start_date,
            end_date=self.end_date,
            observatory=Observatories.LULIN
        )
        self.assertEqual(observation.observatory,
                         Observatories.LULIN)

        # Test invalid observatory
        with self.assertRaises(ValidationError):
            invalid_observation = Observation.objects.create(
                user=self.user,
                start_date=self.start_date,
                end_date=self.end_date,
                observatory=999  # Invalid observatory
            )
            invalid_observation.full_clean()

    def test_code_field(self):
        test_code = "print('Hello, World!')"
        observation = Observation.objects.create(
            user=self.user,
            start_date=self.start_date,
            end_date=self.end_date,
            code=test_code
        )
        self.assertEqual(observation.code, test_code)

    def test_status_validation(self):
        # Test valid status
        observation = Observation.objects.create(
            user=self.user,
            start_date=self.start_date,
            end_date=self.end_date,
            status=Observation.statuses.PENDING
        )
        self.assertEqual(observation.status, Observation.statuses.PENDING)

        # Test invalid status
        with self.assertRaises(ValidationError):
            invalid_observation = Observation.objects.create(
                user=self.user,
                start_date=self.start_date,
                end_date=self.end_date,
                status=999  # Invalid status
            )
            invalid_observation.full_clean()

    def test_priority_validation(self):
        # Test valid priority
        observation = Observation.objects.create(
            user=self.user,
            start_date=self.start_date,
            end_date=self.end_date,
            priority=Priorities.HIGH
        )
        self.assertEqual(observation.priority, Priorities.HIGH)

        # Test invalid priority
        with self.assertRaises(ValidationError):
            invalid_observation = Observation.objects.create(
                user=self.user,
                start_date=self.start_date,
                end_date=self.end_date,
                priority=999  # Invalid priority
            )
            invalid_observation.full_clean()

    def test_multiple_status_transitions(self):
        observation = Observation.objects.create(
            user=self.user,
            start_date=self.start_date,
            end_date=self.end_date,
            status=Observation.statuses.PREP
        )

        # Test PREP to PENDING
        observation.status = Observation.statuses.PENDING
        observation.save()
        self.assertEqual(observation.status, Observation.statuses.PENDING)

        # Test PENDING to IN_PROGRESS
        observation.status = Observation.statuses.IN_PROGRESS
        observation.save()
        self.assertEqual(observation.status, Observation.statuses.IN_PROGRESS)

        # Test IN_PROGRESS to DONE
        observation.status = Observation.statuses.DONE
        observation.save()
        self.assertEqual(observation.status, Observation.statuses.DONE)

        # Verify comments were created for status changes
        self.assertGreater(observation.comments.count(), 0)


class TestLulinModel(TestCase):
    def setUp(self):
        user_profile = {
            'username': 'admin',
            'password': 'password',
            'email': 'admin@ncu.edu.com',
            'role': User.roles.ADMIN,
            'institute': 'NCU',
            'first_name': 'Tyler',
            'last_name': 'Lin',
            'use_demo_targets': False,
            'is_superuser': True
        }
        self.user = User.objects.create(**user_profile)
        self.target = Target.objects.create(
            name="Test Target", user=self.user, ra=12, dec=34)
        self.observation = Observation.objects.create(
            user=self.user,
            start_date=timezone.now() + timedelta(hours=1),
            end_date=timezone.now() + timedelta(hours=2)
        )

    def test_lulin_creation(self):
        lulin = LulinRun.objects.create(
            observation=self.observation,
            target=self.target
        )
        self.assertIsNotNone(lulin.pk)
        self.assertEqual(lulin.priority, Priorities.LOW)
        self.assertEqual(lulin.binning, 1)
        self.assertEqual(lulin.frames, 1)
        self.assertEqual(lulin.exposure_time, 10)
        self.assertEqual(lulin.status, RunStatuses.PENDING)
        self.assertEqual(lulin.filter, 1)  # Default filter value
        self.assertEqual(lulin.instrument, 1)  # Default instrument value

    def test_filter_choices(self):
        # Test default filter
        lulin = LulinRun.objects.create(
            observation=self.observation,
            target=self.target
        )
        self.assertEqual(lulin.filter, 1)  # Default filter value

        # Test custom filter
        lulin = LulinRun.objects.create(
            observation=self.observation,
            target=self.target,
            filter=Filters.gp_Astrodon_2019
        )
        self.assertEqual(lulin.filter, 2)

        # Test invalid filter
        with self.assertRaises(ValidationError):
            invalid_lulin = LulinRun.objects.create(
                observation=self.observation,
                target=self.target,
                filter=999  # Invalid filter value
            )
            invalid_lulin.full_clean()

    def test_instrument_choices(self):
        # Test default instrument
        lulin = LulinRun.objects.create(
            observation=self.observation,
            target=self.target
        )
        self.assertEqual(lulin.instrument, 1)  # Default instrument value

        # Test custom instrument
        lulin = LulinRun.objects.create(
            observation=self.observation,
            target=self.target,
            instrument=2  # Using a valid instrument choice
        )
        self.assertEqual(lulin.instrument, 2)

        # Test invalid instrument
        with self.assertRaises(ValidationError):
            invalid_lulin = LulinRun.objects.create(
                observation=self.observation,
                target=self.target,
                instrument=999  # Invalid instrument value
            )
            invalid_lulin.full_clean()

    def test_run_status_transitions(self):
        lulin = LulinRun.objects.create(
            observation=self.observation,
            target=self.target
        )

        # Test initial status
        self.assertEqual(lulin.status, RunStatuses.PENDING)

        # Test transition to SUCCESS
        lulin.status = RunStatuses.SUCCESS
        lulin.save()
        self.assertEqual(lulin.status, RunStatuses.SUCCESS)

        # Test transition to FAIL
        lulin.status = RunStatuses.FAIL
        lulin.save()
        self.assertEqual(lulin.status, RunStatuses.FAIL)

        # Test transition to PARTIAL_SUCCESS
        lulin.status = RunStatuses.PARTIAL_SUCCESS
        lulin.save()
        self.assertEqual(lulin.status, RunStatuses.PARTIAL_SUCCESS)

    def test_default_filters(self):
        lulin = LulinRun.objects.create(
            observation=self.observation,
            target=self.target
        )
        self.assertEqual(lulin.filter, 1)  # Default filter
        filters = lulin.get_filters()
        self.assertTrue(isinstance(filters, list))
        self.assertTrue(len(filters) > 0)

    def test_default_instruments(self):
        lulin = LulinRun.objects.create(
            observation=self.observation,
            target=self.target
        )
        self.assertEqual(lulin.instrument, 1)  # Default instrument
        instruments = lulin.get_instruments()
        self.assertTrue(isinstance(instruments, list))
        self.assertTrue(len(instruments) > 0)

    def test_get_filter_full_name(self):
        lulin = LulinRun.objects.create(
            observation=self.observation,
            target=self.target,
            filter=1  # Using first filter
        )
        filters = lulin.get_filters()
        # Check if filter value exists in choices
        self.assertTrue(any(f[0] == 1 for f in filters))

    def test_get_instrument_full_name(self):
        lulin = LulinRun.objects.create(
            observation=self.observation,
            target=self.target,
            instrument=1  # Using first instrument
        )
        instruments = lulin.get_instruments()
        # Check if instrument value exists in choices
        self.assertTrue(any(i[0] == 1 for i in instruments))

    def test_priority_choices(self):
        lulin = LulinRun.objects.create(
            observation=self.observation,
            target=self.target,
            priority=Priorities.HIGH
        )
        self.assertEqual(lulin.priority, Priorities.HIGH)

        with self.assertRaises(ValidationError):
            observation = LulinRun.objects.create(
                observation=self.observation,
                target=self.target,
                priority=10  # Invalid priority
            )
            observation.full_clean()


class ObservationsViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create a test user
        self.user = User.objects.create_user(
            username='testuser', password='testpass', email='test@example.com', use_demo_targets=False)
        self.client.force_authenticate(user=self.user)

        self.target = Target.objects.create(
            name="Test Target", user=self.user, ra=12, dec=34)

        # Create some test observations
        self.observation1 = Observation.objects.create(
            user=self.user,
            name='Test Observation 1',
            observatory=Observatories.LULIN,
            start_date=timezone.now() + timedelta(days=1),
            end_date=timezone.now() + timedelta(days=2),
            status=Observation.statuses.PREP
        )
        self.observation2 = Observation.objects.create(
            user=self.user,
            name='Test Observation 2',
            observatory=Observatories.LULIN,
            start_date=timezone.now() + timedelta(days=1),
            end_date=timezone.now() + timedelta(days=2),
            status=Observation.statuses.PENDING
        )

    def test_get_observations(self):
        response = self.client.get('/api/observations/')
        observations = Observation.objects.filter(user=self.user)
        serializer = ObservationGetSerializer(observations, many=True)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'], serializer.data)

    def test_create_observation(self):
        data = {
            'name': 'New Observation',
            'observatory': Observatories.LULIN,
            'user': self.user.id,
            'targets': [self.target.id],
            'priority': Priorities.MEDIUM,
            'start_date': timezone.now() + timedelta(days=1),
            'end_date': timezone.now() + timedelta(days=2),
            'status': Observation.statuses.PREP
        }
        response = self.client.post('/api/observations/', data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Observation.objects.count(), 3)
        self.assertEqual(Observation.objects.latest(
            'id').name, 'New Observation')
        self.assertEqual(Observation.objects.latest('id').user, self.user)
        self.assertEqual(Observation.objects.latest(
            'id').status, Observation.statuses.PREP)
        self.assertEqual(Observation.objects.latest(
            'id').targets.first(), self.target)

    def test_update_observation(self):
        data = {'name': 'Updated Observation'}
        response = self.client.put(
            f'/api/observations/{self.observation1.id}/', data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.observation1.refresh_from_db()
        self.assertEqual(self.observation1.name, 'Updated Observation')

    def test_delete_observations(self):
        data = {'observation_ids': [
            self.observation1.id, self.observation2.id]}
        response = self.client.delete('/api/observations/', data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Observation.objects.count(), 2)
        self.assertEqual(Observation.objects.filter(
            deleted_at__isnull=False).count(), 2)

        observation1 = Observation.objects.get(id=self.observation1.id)
        observation2 = Observation.objects.get(id=self.observation2.id)
        self.assertIsNotNone(observation1.deleted_at,
                             'Test value is none.')
        self.assertIsNotNone(observation2.deleted_at,
                             'Test value is none.')

    def test_filter_observations(self):
        response = self.client.get('/api/observations/?status=1')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results']
                         [0]['name'], 'Test Observation 1')

    def test_unauthorized_access(self):
        self.client.force_authenticate(user=None)
        response = self.client.get('/api/observations/')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class LulinSchedulerTestCase(TestCase):
    def setUp(self):
        self.scheduler = LulinScheduler()

        self.user = User.objects.create_user(
            username='testuser', password='testpass', email='test@example.com', use_demo_targets=False)
        # Create test data
        self.target = Target.objects.create(
            name="Test Target",
            user=self.user,
            ra=15.0,
            dec=45.0
        )
        self.observation = Observation.objects.create(
            user=self.user,
            name='Test Observation 1',
            observatory=Observatories.LULIN,
            start_date=timezone.now() + timedelta(days=1),
            end_date=timezone.now() + timedelta(days=2),
            status=Observation.statuses.PREP
        )
        self.lulin = LulinRun.objects.create(
            observation=self.observation,
            target=self.target,
            priority=Priorities.HIGH,
            filter=Filters.up_Astrodon_2019,
            frames=10,
            exposure_time=300
        )

    def test_convert_ra(self):
        ra_deg = 15.0
        ra_str = LulinScheduler.convert_ra(ra_deg)
        self.assertEqual(ra_str, '01:00:00.000')

    def test_convert_dec(self):
        dec_deg = 45.0
        dec_str = LulinScheduler.convert_dec(dec_deg)
        self.assertEqual(dec_str, '45:00:00')

    def test_get_filter_full_name(self):
        self.assertEqual(self.scheduler.get_filter_full_name(
            'u'), 'up_Astrodon_2019')
        self.assertEqual(self.scheduler.get_filter_full_name(
            'g'), 'gp_Astrodon_2019')

    def test_gen_code(self):
        code = self.scheduler.gen_code(self.observation.id)
        expected_code = f"""
#REPEAT 1
#BINNING 1
#COUNT 10
#INTERVAL 300
#FILTER up_Astrodon_2019

{self.target.name}    01:00:00.000    45:00:00
#WAITFOR 1
            """

        self.assertEqual(code.strip(), expected_code.strip())

    @ patch('observations.models.Observation.objects.filter')
    def test_get_codes(self, mock_filter):
        start_date = '2023-07-18T00:00:00.000Z'
        end_date = '2023-07-19T00:00:00.000Z'

        # Mock the queryset returned by Observation.objects.filter
        mock_observation = MagicMock()
        mock_observation.code = "Test Observation Code"
        mock_filter.return_value = [mock_observation]

        codes = self.scheduler.get_codes(start_date, end_date)
        self.assertEqual(codes, "Test Observation Code")

        # Check that filter was called with correct arguments
        mock_filter.assert_called_once()
        call_kwargs = mock_filter.call_args[1]
        self.assertEqual(call_kwargs['status'],
                         Observation.statuses.IN_PROGRESS)
        self.assertIsInstance(call_kwargs['start_date__lte'], datetime)
        self.assertIsInstance(call_kwargs['end_date__gte'], datetime)


class LulinViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        user_profile = {
            'username': 'admin',
            'password': 'password',
            'email': 'admin@ncu.edu.com',
            'role': User.roles.ADMIN,
            'institute': 'NCU',
            'first_name': 'Tyler',
            'last_name': 'Lin',
            'use_demo_targets': False,
            'is_superuser': True
        }
        self.user = User.objects.create(**user_profile)
        target_profile = {
            'user': self.user,
            'name': 'Test Target',
            'ra': 15.0,
            'dec': 45.0
        }
        self.target = Target.objects.create(**target_profile)
        self.client.force_authenticate(user=self.user)
        self.observation = Observation.objects.create(
            name='Test Observation',
            user=self.user,
            observatory=Observatories.LULIN,
            status=Observation.statuses.PREP,
            start_date=timezone.now() + timedelta(days=1),
            end_date=timezone.now() + timedelta(days=2)
        )
        self.lulin = LulinRun.objects.create(
            observation=self.observation,
            target=self.target,
        )

    def test_get_lulin(self):
        response = self.client.get(
            f'/api/observations/{self.observation.id}/lulin/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_update_lulin(self):
        data = {'some_field': 'Updated Value'}
        response = self.client.put(
            f'/api/observations/lulin/{self.lulin.id}/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.lulin.refresh_from_db()


class CodeViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        user_profile = {
            'username': 'admin',
            'password': 'password',
            'email': 'admin@ncu.edu.com',
            'role': User.roles.ADMIN,
            'institute': 'NCU',
            'first_name': 'Tyler',
            'last_name': 'Lin',
            'use_demo_targets': False,
            'is_superuser': True
        }
        self.user = User.objects.create(**user_profile)
        self.client.force_authenticate(user=self.user)
        self.observation = Observation.objects.create(
            name='Test Observation',
            user=self.user,
            observatory=Observatories.LULIN,
            start_date=timezone.now() + timedelta(days=1),
            end_date=timezone.now() + timedelta(days=2),
            status=Observation.statuses.PREP
        )

    def test_get_code(self):
        url = f'/api/observations/{self.observation.id}/lulin/code/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.content)


class ObservationMessagesViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        user_profile = {
            'username': 'admin',
            'password': 'password',
            'email': 'admin@ncu.edu.com',
            'role': User.roles.ADMIN,
            'institute': 'NCU',
            'first_name': 'Tyler',
            'last_name': 'Lin',
            'use_demo_targets': False,
            'is_superuser': True
        }
        self.user = User.objects.create(**user_profile)
        self.client.force_authenticate(user=self.user)
        self.observation = Observation.objects.create(
            name='Test Observation',
            user=self.user,
            observatory=Observatories.LULIN,
            start_date=timezone.now() + timedelta(days=1),
            end_date=timezone.now() + timedelta(days=2),
            status=Observation.statuses.PREP
        )

    def test_get_observation_messages(self):
        response = self.client.get(
            f'/api/observations/{self.observation.id}/messages/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.observation.id)

    def test_post_observation_message(self):
        data = {'message': 'Test message'}
        response = self.client.post(
            f'/api/observations/{self.observation.id}/messages/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.observation.refresh_from_db()
        self.assertEqual(self.observation.comments.count(), 1)
