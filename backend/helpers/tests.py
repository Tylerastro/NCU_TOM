from django.core.exceptions import ValidationError
# Create your tests here.
from django.test import TestCase

from .models import Announcements, Comments, Tags, Users


class TagsModelTest(TestCase):
    @classmethod
    def setUpTestData(self):
        # Set up non-modified objects used by all test methods
        self.user = Users.objects.create(
            username='admin',
            password='password',
            email='tom@ncu.edu.com',
            role=Users.roles.ADMIN,
            title=Users.titles.MS,
            institute='NCU',
            first_name='Tyler',
            last_name='Lin')
        Tags.objects.create(user=self.user, name='Test Tag')

    def test_tag_create(self):
        tag = Tags.objects.create(user=self.user, name='Test Tag A')
        self.assertEqual(tag.name, 'Test Tag A')
        self.assertEqual(tag.user, self.user)

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


class CommentsModelTest(TestCase):
    @classmethod
    def setUpTestData(self):
        self.user = Users.objects.create(
            username='admin',
            password='password',
            email='tom@ncu.edu.com',
            role=Users.roles.ADMIN,
            title=Users.titles.MS,
            institute='NCU',
            first_name='Tyler',
            last_name='Lin')
        Comments.objects.create(user=self.user, context='Test Comment')

    def test_comment_create(self):
        comment = Comments.objects.create(
            user=self.user, context='Test Comment A')
        self.assertEqual(comment.context, 'Test Comment A')
        self.assertEqual(comment.user, self.user)

    def test_comment_creation(self):
        comment = Comments.objects.get(context='Test Comment')
        self.assertEqual(comment.context, 'Test Comment')

    def test_context_field(self):
        comment = Comments.objects.get(context='Test Comment')
        comment.context = ''  # setting an invalid (blank) context
        with self.assertRaises(ValidationError):
            comment.full_clean()  # This should raise a ValidationError

    def test_user_relationship(self):
        user = Users.objects.get(username='admin')
        comment = Comments.objects.get(context='Test Comment')
        self.assertEqual(comment.user, user)

    def test_created_at_field(self):
        comment = Comments.objects.get(context='Test Comment')
        self.assertIsNotNone(comment.created_at)


class UsersModelTest(TestCase):
    @classmethod
    def setUpTestData(self):
        Users.objects.create(
            username='admin',
            password='password',
            email='tom@ncu.edu.com',
            role=Users.roles.ADMIN,
            title=Users.titles.MS,
            is_superuser=True,
            institute='NCU',
            first_name='Tyler',
            last_name='Lin')

    def test_user_creation(self):
        user = Users.objects.get(username='admin')
        self.assertEqual(user.username, 'admin')
        self.assertEqual(user.password, 'password')
        self.assertEqual(user.email, 'tom@ncu.edu.com')
        self.assertEqual(user.role, Users.roles.ADMIN)
        self.assertEqual(user.title, Users.titles.MS)
        self.assertEqual(user.institute, 'NCU')
        self.assertEqual(user.first_name, 'Tyler')
        self.assertEqual(user.last_name, 'Lin')
        self.assertTrue(user.is_superuser)
        self.assertTrue(user.is_active)

    def test_user_create(self):
        user = Users.objects.create(
            username='testuser',
            password='12345',
            email='a@a.com',
            role=Users.roles.STUDENT,
            title=Users.titles.MS,
            institute='testinstitute',
            first_name='testfirst',
            last_name='testlast')
        self.assertEqual(user.username, 'testuser')
        self.assertEqual(user.email, 'a@a.com')
        self.assertEqual(user.role, Users.roles.STUDENT)
        self.assertEqual(user.title, Users.titles.MS)
        self.assertEqual(user.institute, 'testinstitute')
        self.assertEqual(user.first_name, 'testfirst')
        self.assertEqual(user.last_name, 'testlast')

        user = Users.objects.get(email='a@a.com')
        self.assertEqual(user.username, 'testuser')
        self.assertEqual(user.email, 'a@a.com')
        self.assertEqual(user.role, Users.roles.STUDENT)
        self.assertEqual(user.title, Users.titles.MS)
        self.assertEqual(user.institute, 'testinstitute')
        self.assertEqual(user.first_name, 'testfirst')
        self.assertEqual(user.last_name, 'testlast')

    def test_username_field(self):
        user = Users.objects.get(username='admin')
        user.username = ''  # setting an invalid (blank) username
        with self.assertRaises(ValidationError):
            user.full_clean()  # This should raise a ValidationError


class AnnouncementsModelTest(TestCase):
    @classmethod
    def setUpTestData(self):
        self.user = Users.objects.create(
            username='admin',
            password='password',
            email='tom@ncu.edu.com',
            role=Users.roles.ADMIN,
            title=Users.titles.MS,
            institute='NCU',
            first_name='Tyler',
            last_name='Lin')
        Announcements.objects.create(
            user=self.user,
            title='Test title',
            context='Id velit ea occaecat occaecat',
            type=Announcements.types.INFO
        )

    def test_announcement_create(self):
        announcement = Announcements.objects.create(
            user=self.user, context='Veniam adipiscing deserunt ut quis sunt eu ipsum non deserunt', title='Test title A', type=Announcements.types.URGENT)
        self.assertEqual(
            announcement.context, 'Veniam adipiscing deserunt ut quis sunt eu ipsum non deserunt')
        self.assertEqual(announcement.user, self.user)
        self.assertEqual(announcement.title, 'Test title A')
        self.assertEqual(announcement.type, Announcements.types.URGENT)

    def test_announcement_creation(self):
        announcement = Announcements.objects.get(title='Test title')

        self.assertEqual(announcement.title, 'Test title')
        self.assertEqual(announcement.context, 'Id velit ea occaecat occaecat')
        self.assertEqual(announcement.type, Announcements.types.INFO)

    def test_title_field(self):
        announcement = Announcements.objects.get(title='Test title')
        announcement.title = ''  # setting an invalid (blank) title
        with self.assertRaises(ValidationError):
            announcement.full_clean()  # This should raise a ValidationError
