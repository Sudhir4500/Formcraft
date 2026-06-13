from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from apps.users.models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = (
        "email",
        "name",
        "plan",
        "is_staff",
        "is_active",
        "last_login",
    )

    list_filter = (
        "plan",
        "is_staff",
        "is_superuser",
        "is_active",
    )

    search_fields = (
        "email",
        "name",
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
                    "name",
                )
            },
        ),
        (
            "Subscription",
            {
                "fields": (
                    "plan",
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
                    "name",
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
    -used to upgrade or downgrade multiple user plan status without leaving the admin panel
    '''
    @admin.action(description="Mark selected users as Pro")
    def make_pro(self, request, queryset):
        queryset.update(plan="pro")


    @admin.action(description="Mark selected users as Free")
    def make_free(self, request, queryset):
        queryset.update(plan="free")

    actions = [make_pro, make_free]