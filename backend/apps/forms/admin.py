from django.contrib import admin
from .models import Form, Question

# Register your models here.
@admin.register(Form)
class FormAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'owner', 'is_published', 'created_at')
    search_fields = ('title', 'owner__username')
    list_filter = ('is_published', 'created_at')

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('id', 'label', 'question_type', 'form', 'order')
    search_fields = ('label', 'form__title')
    list_filter = ('question_type',)
    
