from asyncio.log import logger
import stripe
import logging
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from core.responses import success_response, error_response
from django.contrib.auth import get_user_model

stripe.api_key = settings.STRIPE_SECRET_KEY
logger = logging.getLogger(__name__)
User = get_user_model()


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_checkout_session(request):
    """
    Creates a Stripe checkout session for the user to subscribe to the Pro plan. 
    """
    user = request.user 
    
    session_kwargs = {
        'payment_method_types': ['card'],
        'line_items': [{
            'price': settings.STRIPE_PRO_PRICE_ID,
            'quantity': 1,
        }],
        'mode': 'subscription',
        'success_url': settings.FRONTEND_URL + "/billing/success",
        'cancel_url': settings.FRONTEND_URL + "/billing/cancel",
        'client_reference_id': str(user.id),
    }

    if user.stripe_customer_id:
        session_kwargs['customer'] = user.stripe_customer_id
    else:
        session_kwargs['customer_email'] = user.email

    session = stripe.checkout.Session.create(**session_kwargs)
    
    return Response({
        'url': session.url
    })


@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except Exception as e:
        logger.error("Webhook signature verification failed: %s", e)
        return HttpResponse(status=400)

    if event["type"] == "checkout.session.completed":
        #  Convert the Stripe Object to a native Python dictionary
        session = event["data"]["object"].to_dict()

        # Now .get() works perfectly!
        user_id = session.get("client_reference_id")
        email = session.get("customer_email") or session.get("customer_details", {}).get("email")
        customer_id = session.get("customer")

        logger.info("Checkout completed for user_id=%s email=%s customer_id=%s", user_id, email, customer_id)

        try:
            user = None
            if user_id:
                user = User.objects.get(id=user_id)
            elif customer_id:
                user = User.objects.get(stripe_customer_id=customer_id)
            elif email:
                user = User.objects.get(email=email)

            if user:
                user.plan = "pro"
                if customer_id:
                    user.stripe_customer_id = customer_id
                user.save()
                logger.info("User %s upgraded to Pro", user.email)
            else:
                logger.warning("No user found for user_id=%s email=%s or customer_id=%s", user_id, email, customer_id)
        except User.DoesNotExist:
            logger.warning("No user found for user_id=%s email=%s or customer_id=%s", user_id, email, customer_id)

    return HttpResponse(status=200)