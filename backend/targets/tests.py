import datetime

from django.test import TestCase
from django.utils import timezone
from helpers.models import Tags, Users
from rest_framework import status
from rest_framework.test import (APIClient, APIRequestFactory,
                                 force_authenticate)

from .models import Target
from .views import TargetsView


class TargetModelTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        test_user = Users.objects.create(username='testuser', password='12345', email='a@a.com', role=Users.roles.STUDENT,
                                         title=Users.titles.MS, institute='testinstitute', first_name='testfirst', last_name='testlast')
        test_tag = Tags.objects.create(name='testtag', user=test_user)
        target = Target.objects.create(
            user=test_user,
            name='NGC 3824',
            ra=123.456,
            dec=78.90,
            redshift=0.123,
            notes="test notes on target"
        )
        target.tags.add(test_tag)

    def test_target_content(self):
        target = Target.objects.last()
        expected_object_name = f'{target.name}'
        self.assertEqual(expected_object_name, 'NGC 3824')
        self.assertEqual(target.ra, 123.456)
        self.assertEqual(target.dec, 78.90)
        self.assertEqual(target.redshift, 0.123)
        self.assertTrue(target.tags.filter(name='testtag').exists())
        self.assertEqual(target.notes, 'test notes on target')
        self.assertEqual(target.user.username, 'testuser')
        self.assertEqual(target.coordinates, '8:13:49.44 78:54:00')

    def test_target_string_representation(self):
        target = Target.objects.first()
        self.assertEqual(str(target), target.name)


class TargetApiTest(TestCase):
    def setUp(self):
        Users.objects.create(username='testuser', password='12345', email='a@a.com', role=Users.roles.STUDENT,
                             title=Users.titles.MS, institute='testinstitute', first_name='testfirst', last_name='testlast')

        self.factory = APIRequestFactory()
        self.user = Users.objects.get(username='testuser')

    def test_get_target(self):
        view = TargetsView.as_view()
        request = self.factory.get('/api/targets/')
        force_authenticate(request, user=self.user)
        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 10)

    def test_post_target(self):
        view = TargetsView.as_view()
        request = self.factory.post('/api/targets/', data={
            'name': 'testtarget',
            'ra': 123.456,
            'dec': 78.90,
            'redshift': 0.123
        })
        force_authenticate(request, user=self.user)
        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        request = self.factory.get('/api/targets/')
        force_authenticate(request, user=self.user)
        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 11)
