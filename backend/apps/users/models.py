from django.contrib.auth.models import AbstractUser
from django.db import models
from .managers import UserManager

class User(AbstractUser):
    username = None  # Removes default username field
    
    # user profile fields
    name = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(unique=True)
    
    # SaaS Fields
    PLAN_CHOICES = [
        ('free', 'Free'),
        ('pro', 'Pro'),
    ]
    plan = models.CharField(max_length=10, choices=PLAN_CHOICES, default='free')
    stripe_customer_id = models.CharField(max_length=255, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    # since email is unique and required , we dont need to add it to the required fields
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email
