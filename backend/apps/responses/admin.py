from django.contrib import admin
from .models import Response

@admin.register(Response)
class ResponseAdmin(admin.ModelAdmin):
    list_display = ('id', 'form', 'submitted_by', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('form__title', 'submitted_by__username')
    readonly_fields = ('id', 'form', 'submitted_by', 'data', 'created_at')
