from django.core.exceptions import ValidationError
# Create your tests here.
from django.test import TestCase

from .models import Tags, Users


class TagsModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Set up non-modified objects used by all test methods
        user = Users.objects.create(
            username='admin',
            password='password',
            email='tom@ncu.edu.com',
            role=Users.roles.ADMIN,
            title=Users.titles.MS,
            institute='NCU',
            first_name='Tyler',
            last_name='Lin')
        Tags.objects.create(user=user, name='Test Tag')

    def test_tag_creation(self):
        tag = Tags.objects.get(name='Test Tag')
        self.assertEqual(tag.name, 'Test Tag')

    def test_name_field(self):
        tag = Tags.objects.get(name='Test Tag')
        tag.name = ''  # setting an invalid (blank) name
        with self.assertRaises(ValidationError):
            tag.full_clean()  # This should raise a ValidationError

    def test_user_relationship(self):
        user = Users.objects.get(username='admin')
        tag = Tags.objects.get(name='Test Tag')
        self.assertEqual(tag.user, user)

    def test_created_at_field(self):
        tag = Tags.objects.get(name='Test Tag')
        self.assertIsNotNone(tag.created_at)
