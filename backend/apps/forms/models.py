from django.db import models
from django.conf import settings
from slugify import slugify

# Create your models here.
class Form(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='forms')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True,default="")
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    is_published = models.BooleanField(default=False)
    success_message = models.TextField(blank=True, default="Thank you for submitting the form!")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
    
    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 2
            while Form.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

class QuestionType(models.TextChoices):
    SHORT_TEXT = 'short_text', 'Short Text'
    LONG_TEXT = 'long_text', 'Long Text'
    MULTIPLE_CHOICE = 'multiple_choice', 'Multiple Choice'
    CHECKBOXES = 'checkboxes', 'Checkboxes'
    DROPDOWN = 'dropdown', 'Dropdown'
    RATING = 'rating', 'Rating'
    EMAIL = 'email', 'Email'
    NUMBER = 'number', 'Number'

class Question(models.Model):
    form = models.ForeignKey(Form, on_delete=models.CASCADE, related_name='questions')
    question_type = models.CharField(max_length=20, choices=QuestionType.choices, default = QuestionType.SHORT_TEXT)
    label = models.CharField(max_length=255)
    placeholder = models.CharField(max_length=255, blank=True)
    options = models.JSONField(blank=True, null=True)  # For multiple choice, checkboxes, dropdown
    required = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.label
