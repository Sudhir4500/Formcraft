import uuid
import base64
import hmac
import hashlib
import requests
import logging
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import json

logger = logging.getLogger(__name__)
User = get_user_model()

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_esewa_initiation_params(request):
    """
    Generates required signing payload and secure hash signature for eSewa Form Post.
    """
    user = request.user
    
    # Financial parameters for the Pro Tier subscription
    amount = "1000.00"  # Core price variant in NPR
    tax_amount = "0"
    total_amount = amount 
    
    # Unique cross-reference id linking back directly to the active user profile
    transaction_uuid = f"FC-{user.id}-{uuid.uuid4().hex[:8]}"
    product_code = getattr(settings, "ESEWA_PRODUCT_CODE", "EPAYTEST")
    
    # Message format layout defined strictly by eSewa documentation
    data_to_sign = f"total_amount={total_amount},transaction_uuid={transaction_uuid},product_code={product_code}"
    
    # Secure HMAC-SHA256 signature generation using environment keys
    secret_key = getattr(settings, "ESEWA_SECRET_KEY", "8gBm/:&EnhH.1/q")
    key_bytes = secret_key.encode('utf-8')
    message_bytes = data_to_sign.encode('utf-8')
    
    signature = hmac.new(key_bytes, message_bytes, hashlib.sha256)
    signature_base64 = base64.b64encode(signature.digest()).decode('utf-8')

    return Response({
        "url": "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
        "formData": {
            "amount": amount,
            "tax_amount": tax_amount,
            "total_amount": total_amount,
            "transaction_uuid": transaction_uuid,
            "product_code": product_code,
            "product_service_charge": "0",
            "product_delivery_charge": "0",
            "product_coupon_discount": "0",
            "signature": signature_base64,
            "signed_field_names": "total_amount,transaction_uuid,product_code",
            "success_url": f"{settings.FRONTEND_URL}/billing/esewa-verify",
            "failure_url": f"{settings.FRONTEND_URL}/billing/cancel"
        }
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_esewa_payment(request):
    encoded_data = request.data.get("data")
    if not encoded_data:
        return Response({"success": False, "message": "Missing verification payload."}, status=400)
        
    try:
        # FIX: Restore stripped base64 padding characters if missing
        missing_padding = len(encoded_data) % 4
        if missing_padding:
            encoded_data += '=' * (4 - missing_padding)

        # Decode data metrics safely
        decoded_bytes = base64.b64decode(encoded_data)
        payment_info = json.loads(decoded_bytes.decode('utf-8'))
        
        status = payment_info.get("status")
        total_amount = payment_info.get("total_amount")
        transaction_uuid = payment_info.get("transaction_uuid")
        product_code = payment_info.get("product_code")
        
        if status != "COMPLETE":
            return Response({"success": False, "message": "Transaction state failed validation."}, status=400)
            
        # Perform remote confirmation validation check
        verify_url = f"https://rc-epay.esewa.com.np/api/epay/transaction/status/?product_code={product_code}&total_amount={total_amount}&transaction_uuid={transaction_uuid}"
        response = requests.get(verify_url, timeout=10)
        verification_data = response.json()
        
        if response.status_code == 200 and verification_data.get("status") == "COMPLETE":
            user_id = transaction_uuid.split("-")[1]
            user = User.objects.get(id=user_id)
            user.plan = "pro"
            user.save()
            
            # Return matching schema root structure
            return Response({"success": True, "message": "Account upgraded safely."})
                
        return Response({"success": False, "message": "External validation check rejected."}, status=400)
        
    except Exception as e:
        logger.error("eSewa verification exception trace: %s", str(e))
        # Ensure we ALWAYS return valid JSON response strings even during server exceptions
        return Response({"success": False, "message": f"Payment processing system error: {str(e)}"}, status=500)