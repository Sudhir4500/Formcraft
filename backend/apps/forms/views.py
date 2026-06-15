from rest_framework import viewsets,status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Form
from .serializers import FormSerializer
from core.responses import forbidden_response,success_response
from .permission import IsOwner
from rest_framework.decorators import action

# free users can create up to 3 forms, pro users can create unlimited forms
free_plan_form_limit = 3

class FormViewSet(viewsets.ModelViewSet):
    serializer_class = FormSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    lookup_field = 'slug'

    def get_queryset(self):
        '''
        Return forms owned by the authenticated user or current user.
        '''
        return Form.objects.filter(owner=self.request.user)
    
    def perform_create(self, serializer):
        '''Set the owner of the form to the authenticated user.
        '''
        user = self.request.user
        # ensure free plan limit
        if user.plan == 'free' and user.forms.count() >= free_plan_form_limit:
           return forbidden_response(
                message='free paln limit reached. Upgrade to pro to create unlimited forms.',
           )
        # set owner to current user
        serializer.save(owner=user)

    @action(detail=True, methods=['patch'],url_path='publish')
    def publish(self, request, slug=None):
        '''
        Publish the form.
        '''
        form = self.get_object()
        form.is_published = True
        form.save()
        return success_response(message='Form published successfully',data=FormSerializer(form).data)