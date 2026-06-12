from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from apps.users.models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = (
        "email",
        "display_name",
        "is_premium",
        "is_staff",
        "is_active",
        "last_login",
    )

    list_filter = (
        "is_premium",
        "is_staff",
        "is_superuser",
        "is_active",
    )

    search_fields = (
        "email",
        "display_name",
    )

    ordering = ("email",)

    readonly_fields = (
        "last_login",
        "date_joined",
        "stripe_customer_id"
    )

    fieldsets = (
        (
            "Account Information",
            {
                "fields": (
                    "email",
                    "password",
                )
            },
        ),
        (
            "Profile",
            {
                "fields": (
                    "display_name",
                )
            },
        ),
        (
            "Subscription",
            {
                "fields": (
                    "is_premium",
                    "stripe_customer_id",
                )
            },
        ),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        (
            "Important Dates",
            {
                "fields": (
                    "last_login",
                    "date_joined",
                )
            },
        ),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "display_name",
                    "password1",
                    "password2",
                    "is_staff",
                    "is_active",
                ),
            },
        ),
    )
    '''
    These are used to define custom actions for the admin panel
    -used to upgrade or downgrade multiple user premium status without leaving the admin panel
    '''
    @admin.action(description="Mark selected users as premium")
    def make_premium(modeladmin, request, queryset):
        queryset.update(is_premium=True)


    @admin.action(description="Remove premium status")
    def remove_premium(modeladmin, request, queryset):
        queryset.update(is_premium=False)

    actions = [make_premium, remove_premium]