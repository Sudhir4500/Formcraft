# apps/billing/urls.py
from django.urls import path
from .views.stripe_views import create_checkout_session, stripe_webhook
from .views.esewa_views import create_esewa_initiation_params, verify_esewa_payment

urlpatterns = [
    path("create-checkout-session/", create_checkout_session),
    path("webhook/", stripe_webhook),
    # Isolated eSewa Sub-Pipelines
    path('esewa/initiate/', create_esewa_initiation_params, name='esewa_initiate'),
    path('esewa/verify/', verify_esewa_payment, name='esewa_verify'),
]
