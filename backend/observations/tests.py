from datetime import datetime, timedelta
from unittest.mock import MagicMock, patch

from django.core.exceptions import ValidationError
from django.test import TestCase
from django.utils import timezone
from helpers.models import Tags, Users
from observations.models import Lulin, Observation, Target
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

    def test_observation_creation_with_start_date_in_past(self):
        start_date = timezone.now() - timedelta(hours=1)
        end_date = start_date + timedelta(hours=5)

        with self.assertRaises(ValidationError) as context:
            Observation.objects.create(
                user=self.user,
                start_date=start_date,
                end_date=end_date
            )

        self.assertTrue(
            'Start date cannot be in the past.' in str(context.exception))

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
            start_date=timezone.now() + timedelta(hours=1),
            end_date=timezone.now() + timedelta(hours=2)
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


class ObservationsViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create a test user
        self.user = Users.objects.create_user(
            username='testuser', password='testpass', email='test@example.com', use_demo_targets=False)
        self.client.force_authenticate(user=self.user)

        self.target = Target.objects.create(
            name="Test Target", user=self.user, ra=12, dec=34)

        # Create some test observations
        self.observation1 = Observation.objects.create(
            user=self.user,
            name='Test Observation 1',
            observatory=Observation.observatories.LULIN,
            start_date=timezone.now() + timedelta(days=1),
            end_date=timezone.now() + timedelta(days=2),
            status=1
        )
        self.observation2 = Observation.objects.create(
            user=self.user,
            name='Test Observation 2',
            observatory=Observation.observatories.LULIN,
            start_date=timezone.now() + timedelta(days=1),
            end_date=timezone.now() + timedelta(days=2),
            status=2
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
            'observatory': Observation.observatories.LULIN,
            'user': self.user.id,
            'targets': [self.target.id],
            'priority': Observation.priorities.MEDIUM,
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
        self.assertEqual(Observation.objects.latest('id').status, 1)
        self.assertEqual(Observation.objects.latest(
            'id').targets.first(), self.target)

    def test_update_observation(self):
        data = {'name': 'Updated Observation'}
        response = self.client.put(
            f'/api/observations/{self.observation1.id}/edit/', data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.observation1.refresh_from_db()
        self.assertEqual(self.observation1.name, 'Updated Observation')

    def test_delete_observations(self):
        data = {'observation_ids': [
            self.observation1.id, self.observation2.id]}
        response = self.client.delete('/api/observations/', data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Observation.objects.count(), 0)

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

        self.user = Users.objects.create_user(
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
            observatory=Observation.observatories.LULIN,
            start_date=timezone.now() + timedelta(days=1),
            end_date=timezone.now() + timedelta(days=2),
            status=1
        )
        self.lulin = Lulin.objects.create(
            observation=self.observation,
            target=self.target,
            priority=Lulin.priorities.HIGH,
            filters={'u': True, 'g': False, 'r': True, 'i': False, 'z': False},
            binning=2,
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
#BINNING 2,2,
#COUNT 10,10,
#INTERVAL 300,300,
#FILTER up_Astrodon_2019,rp_Astrodon_2019,

{self.target.name}    01:00:00.000    45:00:00
#WAITFOR 1
            """

        self.assertEqual(code.strip(), expected_code.strip())

    @patch('observations.models.Observation.objects.filter')
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
            'role': Users.roles.ADMIN,
            'institute': 'NCU',
            'first_name': 'Tyler',
            'last_name': 'Lin',
            'use_demo_targets': False,
            'is_superuser': True
        }
        self.user = Users.objects.create(**user_profile)
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
            observatory=Observation.observatories.LULIN,
            status=1,
            start_date=timezone.now() + timedelta(days=1),
            end_date=timezone.now() + timedelta(days=2)
        )
        self.lulin = Lulin.objects.create(
            observation=self.observation,
            target=self.target,
        )

    def test_get_lulin(self):
        response = self.client.get('/api/observations/lulin/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_update_lulin(self):
        data = {'some_field': 'Updated Value'}
        response = self.client.put(
            f'/api/observations/{self.lulin.id}/lulin/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.lulin.refresh_from_db()


class CodeViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
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
        self.client.force_authenticate(user=self.user)
        self.observation = Observation.objects.create(
            name='Test Observation',
            user=self.user,
            observatory=Observation.observatories.LULIN,
            start_date=timezone.now() + timedelta(days=1),
            end_date=timezone.now() + timedelta(days=2),
            status=1
        )

    def test_get_code(self):
        url = f'/api/observations/lulin/{self.observation.id}/code/'
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
            'role': Users.roles.ADMIN,
            'institute': 'NCU',
            'first_name': 'Tyler',
            'last_name': 'Lin',
            'use_demo_targets': False,
            'is_superuser': True
        }
        self.user = Users.objects.create(**user_profile)
        self.client.force_authenticate(user=self.user)
        self.observation = Observation.objects.create(
            name='Test Observation',
            user=self.user,
            observatory=Observation.observatories.LULIN,
            start_date=timezone.now() + timedelta(days=1),
            end_date=timezone.now() + timedelta(days=2),
            status=1
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
