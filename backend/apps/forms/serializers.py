from rest_framework import serializers
from .models import Form, Question

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'question_type', 'label', 'placeholder', 'options', 'required', 'order']

class FormSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Form
        fields = ['id', 'owner', 'title', 'description', 'slug', 'is_published', 'success_message', 'created_at', 'updated_at', 'questions']
        read_only_fields = ['owner', 'slug', 'created_at', 'updated_at']
        
    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        if request and request.method == 'GET':
            data.pop("success_message", None)
        return data