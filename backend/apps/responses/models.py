# apps/responses/models.py
from django.db import models
from django.conf import settings
from apps.forms.models import Form   # <-- import Form from forms app

class Response(models.Model):
    form = models.ForeignKey(Form, related_name="responses", on_delete=models.CASCADE)
    submitted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    data = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Response to {self.form.title} at {self.created_at}"
