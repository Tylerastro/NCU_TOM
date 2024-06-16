
from django.test import TestCase
from helpers.models import Tags, Users
from rest_framework import status
from rest_framework.test import APIRequestFactory, force_authenticate

from .models import Target
from .views import TargetsView


class TargetModelTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        test_user_use_demo = Users.objects.create(username='testuser', password='12345', email='a@a.com', role=Users.roles.USER, use_demo_targets=True,
                                                  institute='testinstitute', first_name='testfirst', last_name='testlast')
        test_user_no_demo = Users.objects.create(username='userNoDemo', password='12345', email='b@b.com', role=Users.roles.USER, use_demo_targets=False,
                                                 institute='testinstitute', first_name='testfirst', last_name='testlast')

        test_tag = Tags.objects.create(name='testtag', user=test_user_use_demo)
        target = Target.objects.create(
            user=test_user_use_demo,
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

    def test_user_has_targets(self):
        user = Users.objects.get(username='testuser')
        self.assertTrue(user.targets.exists())

        user_no_demo = Users.objects.get(username='userNoDemo')
        self.assertFalse(user_no_demo.targets.exists())


class TargetApiTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        user = Users.objects.create(username='teststudentuser', password='12345', email='a@a.com', role=Users.roles.USER,
                                    institute='testinstitute', first_name='testfirst', last_name='testlast')
        admin = Users.objects.create(username='testadminuser', password='12345', email='admin@a.com', role=Users.roles.ADMIN,
                                     institute='testinstitute', first_name='testfirst', last_name='testlast')
        student_target = Target.objects.create(
            user=user,
            name='NGC 9999',
            ra=123.456,
            dec=78.90,
            redshift=0.123,
            notes="Velit consequat fugiat lorem laborum"
        )
        admin_target = Target.objects.create(
            user=admin,
            name='SN 9999',
            ra=33.456,
            dec=48.90,
            redshift=0.456,
            notes="Culpa in commodo"
        )
        factory = APIRequestFactory()

        cls.factory = factory
        cls.user = user
        cls.admin = admin
        cls.student_target = student_target
        cls.admin_target = admin_target

    def test_get_target(self):
        view = TargetsView.as_view()
        request = self.factory.get('/api/targets/')
        force_authenticate(request, user=self.user)
        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_student_get_student_target(self):
        view = TargetsView.as_view()
        request = self.factory.get(
            f'/api/targets/?target_id={self.student_target.id}')
        force_authenticate(request, user=self.user)
        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = response.data[0]
        self.assertEqual(response_data['name'], self.student_target.name)
        self.assertEqual(response_data['notes'], self.student_target.notes)
        self.assertEqual(response_data['notes'],
                         "Velit consequat fugiat lorem laborum")

    def test_admin_get_student_target(self):
        view = TargetsView.as_view()
        request = self.factory.get(
            f'/api/targets/?target_id={self.student_target.id}')
        force_authenticate(request, user=self.admin)
        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_student_get_admin_target(self):
        view = TargetsView.as_view()
        request = self.factory.get(
            f'/api/targets/?target_id={self.admin_target.id}')
        force_authenticate(request, user=self.user)
        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_negative_id_target(self):
        view = TargetsView.as_view()
        request = self.factory.get('/api/targets/?target_id=-2')
        force_authenticate(request, user=self.user)
        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_own_id_target(self):
        view = TargetsView.as_view()
        request = self.factory.get('/api/targets/')
        force_authenticate(request, user=self.user)
        response = view(request)
        target_id = response.data[0]['id']

        view = TargetsView.as_view()
        request = self.factory.get(f'/api/targets/?target_id={target_id}')
        force_authenticate(request, user=self.user)
        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_other_id_target(self):
        view = TargetsView.as_view()
        request = self.factory.get('/api/targets/?target_id=99999')
        force_authenticate(request, user=self.user)
        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

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

    def test_invalid_ra_post_target(self):
        view = TargetsView.as_view()
        request = self.factory.post('/api/targets/', data={
            'name': 'testtarget',
            'ra': 361,
            'dec': 78.90
        })
        force_authenticate(request, user=self.user)
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        request = self.factory.post('/api/targets/', data={
            'name': 'testtarget',
            'ra': -0.01,
            'dec': 78.90
        })
        force_authenticate(request, user=self.user)
        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_invalid_dec_post_target(self):
        view = TargetsView.as_view()
        request = self.factory.post('/api/targets/', data={
            'name': 'testtarget',
            'ra': 123.456,
            'dec': 90.01
        })
        force_authenticate(request, user=self.user)
        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        request = self.factory.post('/api/targets/', data={
            'name': 'testtarget',
            'ra': 123.456,
            'dec': -90.01
        })
        force_authenticate(request, user=self.user)
        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
