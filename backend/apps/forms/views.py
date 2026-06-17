from rest_framework import viewsets,status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Form,Question
from .serializers import FormSerializer,QuestionSerializer
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
        return Form.objects.filter(owner=self.request.user)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return success_response(
            message="Forms fetched successfully",
            data=serializer.data
        )

    def retrieve(self, request, *args, **kwargs):
        form = self.get_object()
        serializer = self.get_serializer(form)
        return success_response(
            message="Form fetched successfully",
            data=serializer.data
        )

    def create(self, request, *args, **kwargs):
        user = request.user
        if user.plan == 'free' and user.forms.count() >= free_plan_form_limit:
            return forbidden_response(
                message='Free plan limit reached. Upgrade to pro to create unlimited forms.'
            )
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(owner=user)
        return success_response(
            message='Form created successfully',
            data=serializer.data,
            status_code=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['patch'], url_path='publish')
    def publish(self, request, slug=None):
        form = self.get_object()
        form.is_published = True
        form.save()
        return success_response(
            message='Form published successfully',
            data=FormSerializer(form).data
        )
    
    @action(detail=True, methods=['get', 'post'], url_path='questions')
    def questions(self, request, slug=None):
        form = self.get_object()  # ownership enforced by IsOwner

        if request.method == 'GET':
            serializer = QuestionSerializer(form.questions.all(), many=True)
            return success_response(
                message="Questions fetched successfully",
                data=serializer.data
            )

        elif request.method == 'POST':
            serializer = QuestionSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(form=form)
            return success_response(
                message="Question created successfully",
                data=serializer.data,
                status_code=status.HTTP_201_CREATED
            )
    @action(detail=True, methods=['patch', 'delete'], url_path='questions/(?P<question_id>[^/.]+)')
    def question_detail(self, request, slug=None, question_id=None):
        form = self.get_object()
        try:
            question = form.questions.get(id=question_id)
        except Question.DoesNotExist:
            return Response({"detail": "Question not found"}, status=status.HTTP_404_NOT_FOUND)

        if request.method == 'PATCH':
            serializer = QuestionSerializer(question, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return success_response("Question updated successfully", serializer.data)

        elif request.method == 'DELETE':
            question.delete()
            return success_response("Question deleted successfully", None)
        
    @action(detail=True, methods=['post'], url_path='bulk-questions')
    def bulk_questions(self, request, slug=None):
        """
        Bulk create or update questions for a form.
        Expects an array of question objects in the request body.
        If 'id' is provided, update that question; otherwise create new.
        """
        form = self.get_object()
        results = []

        for q_data in request.data:
            q_id = q_data.get("id")
            if q_id:
                try:
                    question = form.questions.get(id=q_id)
                except Question.DoesNotExist:
                    continue  # skip invalid IDs
                serializer = QuestionSerializer(question, data=q_data, partial=True)
                serializer.is_valid(raise_exception=True)
                serializer.save()
                results.append(serializer.data)
            else:
                serializer = QuestionSerializer(data=q_data)
                serializer.is_valid(raise_exception=True)
                serializer.save(form=form)
                results.append(serializer.data)

        return success_response(
            message="Questions bulk processed successfully",
            data=results,
            status_code=status.HTTP_201_CREATED
        )
