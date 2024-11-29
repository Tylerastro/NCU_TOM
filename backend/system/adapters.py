from allauth.account.adapter import DefaultAccountAdapter
from allauth.account.utils import user_email
from allauth.exceptions import ImmediateHttpResponse
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.contrib.auth import get_user_model
from system.models import User


class AccountAdapter(DefaultAccountAdapter):
    def pre_login(self, request, user, *, email_verification, signal_kwargs, email, signup, redirect_url):
        pass


class SocialAccountAdapter(DefaultSocialAccountAdapter):
    def pre_social_login(self, request, sociallogin):
        """
        Invoked just after a user successfully authenticates via a
        social provider, but before the login is actually processed
        (and before the pre_social_login signal is emitted).

        We're trying to solve different use cases:
        - social account already exists, just go on
        - social account has no email or email is unknown, just go on
        - social account's email exists, link social account to existing user
        """

        # Ignore existing social accounts, just do this stuff for new ones
        if sociallogin.is_existing:
            return

        # some social logins don't have an email address, e.g. facebook accounts
        # with mobile numbers only, but allauth takes care of this case so just
        # ignore it

        print(sociallogin)
        print(sociallogin.account)
        print(sociallogin.account.extra_data)
        if 'email' not in sociallogin.account.extra_data:
            return

        # check if given email address already exists.
        # Note: __iexact is used to ignore cases
        try:
            email = sociallogin.account.extra_data['email'].lower()
            user = User.objects.get(email=email)

        # if it does not, let allauth take care of this new social account
        except user.DoesNotExist:
            return

        # if it does, connect this new social login to the existing user
        sociallogin.connect(request, user)
