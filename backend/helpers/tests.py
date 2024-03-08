from django.core.exceptions import ValidationError
# Create your tests here.
from django.test import TestCase

from .models import Announcements, Comments, Tags, Users


class UsersModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        admin = {
            'username': 'admin',
            'password': 'password',
            'email': 'admin@ncu.edu.com',
            'role': Users.roles.ADMIN,
            'title': Users.titles.MS,
            'institute': 'NCU',
            'first_name': 'Tyler',
            'last_name': 'Lin',
            'use_demo_targets': True,
            'is_superuser': True
        }
        faculty = {
            'username': 'faculty',
            'password': 'password',
            'email': 'faculty@ncu.edu.com',
            'role': Users.roles.FACULTY,
            'title': Users.titles.MS,
            'institute': 'NCU',
            'first_name': 'Tyler',
            'last_name': 'Lin'
        }
        professor = {
            'username': 'professor',
            'password': 'password',
            'email': 'professor@ncu.edu.com',
            'role': Users.roles.PROFESSOR,
            'title': Users.titles.MS,
            'institute': 'NCU',
            'first_name': 'Tyler',
            'last_name': 'Lin'
        }
        student = {
            'username': 'student',
            'password': 'password',
            'email': 'student@ncu.edu.com',
            'role': Users.roles.STUDENT,
            'title': Users.titles.MS,
            'institute': 'NCU',
            'first_name': 'Tyler',
            'last_name': 'Lin'
        }
        cls.admin = Users.objects.create(**admin)
        cls.faculty = Users.objects.create(**faculty)
        cls.professor = Users.objects.create(**professor)
        cls.student = Users.objects.create(**student)

    def test_existed_admin(self):
        admin = Users.objects.get(username='admin')
        self.assertEqual(admin.username, 'admin')
        self.assertEqual(admin.email, 'admin@ncu.edu.com')
        self.assertEqual(admin.role, Users.roles.ADMIN)
        self.assertEqual(admin.title, Users.titles.MS)
        self.assertEqual(admin.institute, 'NCU')
        self.assertTrue(admin.is_superuser)
        self.assertTrue(admin.use_demo_targets)

    def test_existed_faculty(self):
        faculty = Users.objects.get(username='faculty')
        self.assertEqual(faculty.username, 'faculty')
        self.assertEqual(faculty.email, 'faculty@ncu.edu.com')
        self.assertEqual(faculty.role, Users.roles.FACULTY)
        self.assertEqual(faculty.title, Users.titles.MS)
        self.assertEqual(faculty.institute, 'NCU')
        self.assertFalse(faculty.is_superuser)

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


class TagsModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
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

        cls.user = user

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


class AnnouncementsModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.user = Users.objects.create(
            username='admin',
            password='password',
            email='tom@ncu.edu.com',
            role=Users.roles.ADMIN,
            title=Users.titles.MS,
            institute='NCU',
            first_name='Tyler',
            last_name='Lin')
        Announcements.objects.create(
            user=cls.user,
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
