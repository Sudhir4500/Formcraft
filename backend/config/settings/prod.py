from .base import *
import dj_database_url
from decouple import config
import os

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = ['*']

# Database and fall back to SQLite if DATABASE_URL is not set
DATABASES = {
    'default': dj_database_url.config(
        default=config('DATABASE_URL', default=f'sqlite:///{os.path.join(BASE_DIR, "db.sqlite3")}')
    )
}
# force all http to https
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_SSL_REDIRECT = True

# send session cookie over https only
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# it will help to prevent XSS attacks
SECURE_BROWSER_XSS_FILTER = True

# it will help to prevent MIME type sniffing
SECURE_CONTENT_TYPE_NOSNIFF = True

# it will help to prevent Clickjacking attacks
X_FRAME_OPTIONS = 'DENY'


# Whitenoise for static files
MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')
# Add this line below your STATIC_ROOT config
STORAGES = {
    "default": {
        "BACKEND": "django.db.models.fields.files.FieldFile", # default fallback if not defined
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}