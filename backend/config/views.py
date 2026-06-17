# views.py
from django.http import JsonResponse

def health_check(request):
    """
    A lightweight endpoint that returns a 200 OK status 
    to keep the Render instance awake.
    """
    return JsonResponse({"status": "healthy"}, status=200)