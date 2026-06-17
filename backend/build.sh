#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Run collectstatic to fix the admin CSS/JS layout
python manage.py collectstatic --no-input

# Run database migrations (optional, but highly recommended here)
python manage.py migrate
