from .base import *
import os

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

# Database
# if .env file has DATABASE_URL key set  then use this else fallback to sqlite3
if os.getenv("DATABASE_URL"):
    DATABASES = {
        'default': dj_database_url.config(default=os.getenv("DATABASE_URL"))
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Use MD5 password hasher to significantly speed up login/auth in local development
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.MD5PasswordHasher',
    'django.contrib.auth.hashers.PBKDF2PasswordHasher',
    'django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher',
    'django.contrib.auth.hashers.BCryptSHA256PasswordHasher',
    'django.contrib.auth.hashers.BCryptPasswordHasher',
]