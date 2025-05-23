import os
from datetime import timedelta
from pathlib import Path

import dotenv
from django.core.management.utils import get_random_secret_key

BASE_DIR = Path(__file__).resolve().parent.parent

STAGE = os.getenv("DJANGO_STAGE", "local")
if STAGE == "test":
    pass
elif STAGE == "local":
    dotenv.load_dotenv(BASE_DIR / ".env.local", override=True)
else:
    dotenv.load_dotenv(BASE_DIR / ".env.prod", override=True)

SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", get_random_secret_key())

DEBUG = os.getenv("DEBUG", "False").lower() == "true"

ALLOWED_HOSTS = os.getenv(
    "ALLOWED_HOSTS", "127.0.0.1,localhost,django").split(",")

CORS_ORIGIN_ALLOW_ALL = False
CORS_ALLOWED_ORIGINS = os.getenv(
    "CORS_ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000,http://nextjs:3000").split(",")
CSRF_TRUSTED_ORIGINS = os.getenv(
    "CSRF_TRUSTED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000,http://nextjs:3000").split(",")
CORS_ALLOW_CREDENTIALS = True

AUTH_COOKIE = "access"
AUTH_COOKIE_MAX_AGE = 60 * 60 * 24
AUTH_COOKIE_SECURE = os.getenv("AUTH_COOKIE_SECURE", "True").lower() == "true"
AUTH_COOKIE_HTTPONLY = True
AUTH_COOKIE_PATH = "/"
AUTH_COOKIE_SAMESITE = os.getenv("AUTH_COOKIE_SAMESITE", "strict")

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'corsheaders',
    'targets',
    'observations',
    'dataproducts',
    'helpers',
    'system',
    'drf_spectacular',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'allauth.socialaccount.providers.github',
    'dj_rest_auth',
    'dj_rest_auth.registration',
    'rest_framework',
    'rest_framework.authtoken',
    'rest_framework_simplejwt',
]

SITE_ID = 1

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'allauth.account.middleware.AccountMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'tom.middleware.RequestLogMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


ROOT_URLCONF = 'tom.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'frontend', 'build'), os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


WSGI_APPLICATION = 'tom.wsgi.application'

if STAGE == "test":
    DATABASES = {
        "default": {
            "ENGINE": os.getenv("ENGINE", "django.db.backends.postgresql"),
            "NAME": os.getenv("DATABASE", "tom"),
            "USER": os.getenv("USER", "tom"),
            "PASSWORD": os.getenv("PASSWORD", "Password"),
            "HOST": os.getenv("DBHOST", "localhost"),
            "PORT": os.getenv("PORT", "5432"),
        }
    }
elif os.getenv("ENGINE") == "django.db.backends.postgresql":
    DATABASES = {
        "default": {
            "ENGINE": os.getenv("ENGINE"),
            "NAME": os.getenv("DATABASE"),
            "USER": os.getenv("USER"),
            "PASSWORD": os.getenv("PASSWORD"),
            "HOST": os.getenv("DBHOST"),
            "PORT": os.getenv("PORT"),
        }
    }
elif os.getenv("ENGINE") == "django.db.backends.sqlite3":
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# Point the default user model to our custom user model
AUTH_USER_MODEL = "system.User"


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


LANGUAGE_CODE = 'en-us'

DATETIME_FORMAT = "%Y-%m-%d%H:%M:%S"
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

DOMAIN = os.getenv("DOMAIN", "localhost")
SITE_NAME = os.getenv("SITE_NAME", "NCU TOM")

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
STATICFILED_DRIS = [os.path.join(BASE_DIR, 'frontend', 'build', 'static')]

MEDIA_URL = 'media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


AUTHENTICATION_BACKENDS = (
    "allauth.account.auth_backends.AuthenticationBackend",
    'django.contrib.auth.backends.ModelBackend',
)


# DRF settings
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "system.authentication.TOMJWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'helpers.paginator.Pagination',
    'PAGE_SIZE': 10,
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

SPECTACULAR_SETTINGS = {
    'TITLE': 'NCU TOM API',
    'DESCRIPTION': '',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': True
}


# JWT settings
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": False,
    "BLACKLIST_AFTER_ROTATION": False,
    "UPDATE_LAST_LOGIN": True,
    "SIGNING_KEY": os.getenv("SIGNING_KEY", None),
    "VERIFYING_KEY": os.getenv("VERIFYING_KEY", None),
    "ALGORITHM": os.getenv("ALGORITHM", "HS256"),
    'AUTH_HEADER_TYPES': ('JWT', 'Bearer'),
}


ACCOUNT_ADAPTER = "system.adapters.AccountAdapter"
ACCOUNT_AUTHENTICATION_METHOD = "username"
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_EMAIL_VERIFICATION = "none"
SOCIALACCOUNT_ADAPTER = "system.adapters.SocialAccountAdapter"
SOCIALACCOUNT_AUTO_SIGNUP = True

REST_AUTH = {
    'LOGIN_SERIALIZER': 'dj_rest_auth.serializers.LoginSerializer',
    'TOKEN_SERIALIZER': 'dj_rest_auth.serializers.TokenSerializer',
    'JWT_SERIALIZER': 'dj_rest_auth.serializers.JWTSerializer',
    'JWT_SERIALIZER_WITH_EXPIRATION': 'dj_rest_auth.serializers.JWTSerializerWithExpiration',
    'JWT_TOKEN_CLAIMS_SERIALIZER': 'rest_framework_simplejwt.serializers.TokenObtainPairSerializer',
    'USER_DETAILS_SERIALIZER': 'system.serializers.UserSerializer',
    'PASSWORD_RESET_SERIALIZER': 'dj_rest_auth.serializers.PasswordResetSerializer',
    'PASSWORD_RESET_CONFIRM_SERIALIZER': 'dj_rest_auth.serializers.PasswordResetConfirmSerializer',
    'PASSWORD_CHANGE_SERIALIZER': 'dj_rest_auth.serializers.PasswordChangeSerializer',

    'REGISTER_PERMISSION_CLASSES': ('rest_framework.permissions.AllowAny',),

    'TOKEN_MODEL': 'rest_framework.authtoken.models.Token',
    'TOKEN_CREATOR': 'dj_rest_auth.utils.default_create_token',

    'PASSWORD_RESET_USE_SITES_DOMAIN': False,
    'OLD_PASSWORD_FIELD_ENABLED': False,
    'LOGOUT_ON_PASSWORD_CHANGE': False,
    'SESSION_LOGIN': True,
    'USE_JWT': True,

    'JWT_AUTH_COOKIE': None,
    'JWT_AUTH_REFRESH_COOKIE': None,
    'JWT_AUTH_REFRESH_COOKIE_PATH': '/',
    'JWT_AUTH_SECURE': False,
    'JWT_AUTH_HTTPONLY': False,
    'JWT_AUTH_SAMESITE': 'Lax',
    'JWT_AUTH_RETURN_EXPIRATION': False,
    'JWT_AUTH_COOKIE_USE_CSRF': False,
    'JWT_AUTH_COOKIE_ENFORCE_CSRF_ON_UNAUTHENTICATED': False,
}

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER", None)
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD", None)
EMAIL_PORT = 587
EMAIL_USE_TLS = True


SOCIALACCOUNT_PROVIDERS = {
    "google": {
        "APP": {
            "client_id": os.getenv("GOOGLE_CLIENT_ID", None),
            "secret": os.getenv("GOOGLE_CLIENT_SECRET", None),
            "key": "",
        },
        "SCOPE": [
            "profile",
            "email",
        ],
        "AUTH_PARAMS": {
            "access_type": "online",
        },
        "FETCH_USERINFO": True,
        "VERIFIED_EMAIL": True,
    },
    'github': {
        "APP": {
            'client_id': os.getenv("GITHUB_CLIENT_ID", None),
            'secret': os.getenv("GITHUB_CLIENT_SECRET", None),
        },
        'SCOPE': [
            'user',
            'email',
        ],
        "VERIFIED_EMAIL": True
    }
}

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
            'level': 'DEBUG',
        },
    },
    'loggers': {
        'tom.middleware': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': True,
        },
        'django.request': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': True,
        },
        'system.authentication': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
}
