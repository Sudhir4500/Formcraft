# apps/forms/views.py
from django.utils import timezone
from .models import Response
from .serializers import ResponseSerializer
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from core.responses import forbidden_response, success_response

FREE_PLAN_RESPONSE_LIMIT = 100

class ResponseViewSet(viewsets.ModelViewSet):
    serializer_class = ResponseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        '''
        users can only see responses to their own forms
        '''
        return Response.objects.filter(form__owner=self.request.user)

    def create(self, request, *args, **kwargs):
        '''
        free users can submit up to 100 responses per month, pro users have no limit
        '''
        user = request.user
        if user.plan == "free":
            monthly_count = Response.objects.filter(
                form__owner=user,
                created_at__year=timezone.now().year,
                created_at__month=timezone.now().month
            ).count()
            if monthly_count >= FREE_PLAN_RESPONSE_LIMIT:
                return forbidden_response("Free plan monthly response limit reached. Upgrade to Pro.")

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(submitted_by=user)
        return success_response("Response submitted successfully", serializer.data, status.HTTP_201_CREATED)
