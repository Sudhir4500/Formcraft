from django.contrib.auth.models import AbstractUser
from django.db import models
from .managers import UserManager

class User(AbstractUser):
    username = None  # Removes default username field
    
    # user profile fields
    display_name = models.CharField(max_length=255,blank=True, null=True)
    email = models.EmailField(unique=True)
    
    # SaaS Fields
    stripe_customer_id = models.CharField(max_length=255, blank=True, null=True)
    is_premium = models.BooleanField(default=False)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email