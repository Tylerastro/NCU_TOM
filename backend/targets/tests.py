
import datetime

import astropy.units as u
from astropy.coordinates import SkyCoord
from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from django.utils import timezone
from helpers.models import Tags, Users
from rest_framework import status
from rest_framework.test import APIClient

from .models import Target


class TargetModelTest(TestCase):

    @classmethod
    def setUpTestData(cls):
        cls.user = Users.objects.create(
            username='basic user', password='12345', email='basicuser@example.com')
        cls.target = Target.objects.create(
            user=cls.user,
            name='Test Target',
            ra=180.0,
            dec=45.0,
            redshift=0.5,
            notes="Test notes"
        )
        cls.demo_user = Users.objects.create(username='testuser', password='12345', email='a@a.com', role=Users.roles.USER, use_demo_targets=True,
                                             institute='testinstitute', first_name='testfirst', last_name='testlast')
        cls.no_demo_user = Users.objects.create(username='userNoDemo', password='12345', email='b@b.com', role=Users.roles.USER, use_demo_targets=False,
                                                institute='testinstitute', first_name='testfirst', last_name='testlast')

        test_tag = Tags.objects.create(name='testtag', user=cls.demo_user)
        target = Target.objects.create(
            user=cls.demo_user,
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

    def test_field_max_lengths(self):
        max_length = self.target._meta.get_field('name').max_length
        self.assertEqual(max_length, 100)

        max_length = self.target._meta.get_field('notes').max_length
        self.assertEqual(max_length, 100)

    def test_ra_dec_validators(self):
        with self.assertRaises(ValidationError):
            invalid_target = Target(
                user=self.user, name='Invalid RA', ra=361, dec=0)
            invalid_target.full_clean()

        with self.assertRaises(ValidationError):
            invalid_target = Target(
                user=self.user, name='Invalid Dec', ra=0, dec=91)
            invalid_target.full_clean()

    def test_formatted_timestamps(self):
        self.assertEqual(self.target.formatted_created_at(),
                         self.target.created_at.strftime("%Y-%m-%d %H:%M:%S"))
        self.assertEqual(self.target.formatted_updated_at(),
                         self.target.updated_at.strftime("%Y-%m-%d %H:%M:%S"))

    def test_coordinates_property(self):
        expected_coordinates = SkyCoord(
            ra=180*u.degree, dec=45*u.degree, frame='icrs')
        expected_ra = expected_coordinates.ra.to_string(unit=u.hour, sep=':')
        expected_dec = expected_coordinates.dec.to_string(
            unit=u.degree, sep=':')
        expected_output = f"{expected_ra} {expected_dec}"

        self.assertEqual(self.target.coordinates, expected_output)

    def test_is_deleted_property(self):
        self.assertFalse(self.target.is_deleted)
        self.target.deleted_at = timezone.now()
        self.target.save()
        self.assertTrue(self.target.is_deleted)

    def test_delete_method(self):
        self.assertIsNone(self.target.deleted_at)
        self.target.delete()
        self.assertIsNotNone(self.target.deleted_at)
        self.assertTrue(isinstance(self.target.deleted_at, datetime.datetime))

    def test_optional_fields(self):
        optional_target = Target.objects.create(
            user=self.user,
            name='Optional Fields Test',
            ra=0,
            dec=0
        )
        self.assertIsNone(optional_target.redshift)
        self.assertIsNone(optional_target.sed)
        self.assertIsNone(optional_target.hashed_sed)
        self.assertIsNone(optional_target.simbad)
        self.assertIsNone(optional_target.hashed_simbad)
        self.assertIsNone(optional_target.notes)

    def test_many_to_many_relationship(self):
        tag1 = Tags.objects.create(name='Tag1', user=self.user)
        tag2 = Tags.objects.create(name='Tag2', user=self.user)

        self.target.tags.add(tag1, tag2)

        self.assertEqual(self.target.tags.count(), 2)
        self.assertIn(tag1, self.target.tags.all())
        self.assertIn(tag2, self.target.tags.all())

    def test_foreign_key_relationship(self):
        self.assertEqual(self.target.user, self.user)
        self.assertIn(self.target, self.user.targets.all())

    def test_json_fields(self):
        sed_data = {'wavelength': [300, 400, 500], 'flux': [1.0, 1.5, 2.0]}
        simbad_data = {'identifier': 'NGC1234', 'object_type': 'Galaxy'}

        self.target.sed = sed_data
        self.target.simbad = simbad_data
        self.target.save()

        updated_target = Target.objects.get(id=self.target.id)
        self.assertEqual(updated_target.sed, sed_data)
        self.assertEqual(updated_target.simbad, simbad_data)


class TargetApiTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = Users.objects.create_user(
            username='testuser', password='testpass', email='test@example.com', use_demo_targets=False)
        self.admin_user = Users.objects.create_user(
            username='adminuser', password='adminpass', email='admin@example.com', role=Users.roles.ADMIN, use_demo_targets=False)
        self.client.force_authenticate(user=self.user)

        self.target = Target.objects.create(
            user=self.user,
            name='M 87',
            ra=187.7059,
            dec=12.3911,
            redshift=0.5
        )

        self.tag = Tags.objects.create(name='TestTag', user=self.user)
        self.target.tags.add(self.tag)

    def test_get_target_list(self):
        response = self.client.get('/api/targets/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_get_target_detail(self):
        response = self.client.get(f'/api/targets/?target_id={self.target.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'M 87')
        self.assertEqual(response.data['tags'][0]['name'], 'TestTag')

    def test_create_target(self):
        data = {
            'name': 'New Target',
            'ra': 200.0,
            'dec': 50.0,
            'redshift': 0.7
        }
        response = self.client.post('/api/targets/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Target.objects.count(), 2)

    def test_create_target_with_existed_tags(self):
        data = {
            'name': 'New Target with Tags',
            'ra': 200.0,
            'dec': 50.0,
            'redshift': 0.7,
            'tags': [{'id': self.tag.id, 'name': self.tag.name}]
        }
        response = self.client.post('/api/targets/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Target.objects.count(), 2)

    def test_create_target_with_new_tags(self):
        initial_tag_count = Tags.objects.count()
        data = {
            'name': 'New Target with new Tags',
            'ra': 200.0,
            'dec': 50.0,
            'redshift': 0.7,
            'tags': [{'name': 'New Tag 1'}, {'name': 'New Tag 2'}]
        }
        response = self.client.post('/api/targets/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Target.objects.count(), 2)
        self.assertEqual(Tags.objects.count(), initial_tag_count + 2)

        new_target = Target.objects.get(name='New Target with new Tags')
        self.assertEqual(new_target.tags.count(), 2)
        self.assertTrue(new_target.tags.filter(name='New Tag 1').exists())
        self.assertTrue(new_target.tags.filter(name='New Tag 2').exists())

    def test_create_ra_invalid_target(self):
        data = {
            'name': 'New Target',
            'ra': 360.1,
            'dec': 50.0
        }
        response = self.client.post('/api/targets/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Target.objects.count(), 1)

    def test_create_dec_invalid_target(self):
        data = {
            'name': 'New Target',
            'ra': 23.1,
            'dec': 90.1
        }
        response = self.client.post('/api/targets/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Target.objects.count(), 1)

    def test_update_target(self):
        data = {
            'name': 'Updated Target',
            'ra': 190.0,
            'dec': 55.0
        }
        response = self.client.put(
            f'/api/targets/{self.target.id}/edit/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.target.refresh_from_db()
        self.assertEqual(self.target.name, 'Updated Target')

    def test_update_invalid_target(self):
        data = {
            'name': 'Updated Target',
            'ra': 360.1,
            'dec': 55.0
        }
        response = self.client.put(
            f'/api/targets/{self.target.id}/edit/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.target.refresh_from_db()
        self.assertNotEqual(self.target.name, 'Updated Target')

    def test_update_target_with_new_tags(self):
        new_tag = Tags.objects.create(name='Existing Tag', user=self.user)
        self.target.tags.add(new_tag)
        self.assertEqual(self.target.tags.count(), 2)

        data = {
            'name': 'Updated Target',
            'ra': 190.0,
            'dec': 55.0,
            'tags': [{'name': 'New Tag'}]
        }
        response = self.client.put(
            f'/api/targets/{self.target.id}/edit/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.target.refresh_from_db()

        self.assertEqual(self.target.tags.count(), 1)
        self.assertFalse(self.target.tags.filter(name=self.tag.name).exists())
        self.assertTrue(self.target.tags.filter(name='New Tag').exists())
        self.assertFalse(self.target.tags.filter(name='Existing Tag').exists())

    def test_delete_target(self):
        data = {'target_ids': [self.target.id]}
        response = self.client.delete('/api/targets/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Target.objects.filter(
            deleted_at__isnull=True).count(), 0)

    def test_bulk_target_creation(self):
        csv_content = "name,ra,dec\nBulk Target 1,100,30\nBulk Target 2,150,40"
        csv_file = SimpleUploadedFile(
            "targets.csv", csv_content.encode(), content_type="text/csv")
        response = self.client.post('/api/targets/bulk/', {'file': csv_file})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Target.objects.count(), 3)

    def test_get_moon_altaz(self):
        data = {
            'start_time': (datetime.datetime.now() + datetime.timedelta(hours=1)).isoformat(),
            'end_time': (datetime.datetime.now() + datetime.timedelta(hours=2)).isoformat()
        }
        response = self.client.post(
            '/api/targets/moon/altaz/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_target_simbad(self):
        response = self.client.get(f'/api/targets/{self.target.id}/simbad/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Note: This test might need to be adjusted based on the actual implementation of SimbadService

    def test_get_target_sed(self):
        response = self.client.get(f'/api/targets/{self.target.id}/sed/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Note: This test might need to be adjusted based on the actual implementation of VizierService

    def test_filter_targets_by_name(self):
        response = self.client.get('/api/targets/?name=M 87')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

        response = self.client.get('/api/targets/?name=Test')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 0)

    def test_filter_targets_by_tag(self):
        response = self.client.get(f'/api/targets/?tags={self.tag.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_admin_can_see_all_targets(self):
        Target.objects.create(user=self.admin_user,
                              name='Admin Target', ra=0, dec=0)
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get('/api/targets/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Both targets visible to admin
        self.assertEqual(len(response.data['results']), 2)
