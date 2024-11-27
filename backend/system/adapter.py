from allauth.account.adapter import DefaultAccountAdapter


class AccountAdapter(DefaultAccountAdapter):
    def pre_login(self, request, user, *, email_verification, signal_kwargs, email, signup, redirect_url):
        pass
