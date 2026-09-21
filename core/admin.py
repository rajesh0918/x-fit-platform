from datetime import timedelta

from django.contrib import admin
from django.utils import timezone

from .models import Product, Membership


# =========================================================
# X-FIT SHOP PRODUCT ADMIN
# =========================================================

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "name",
        "category",
        "price",
        "stock",
        "rating",
        "review_count",
        "is_active",
        "created_at",
    )

    list_filter = (
        "category",
        "is_active",
    )

    search_fields = (
        "name",
        "slug",
        "description",
    )

    prepopulated_fields = {
        "slug": (
            "name",
        )
    }

    list_editable = (
        "price",
        "stock",
        "is_active",
    )

    ordering = (
        "-created_at",
    )


# =========================================================
# X-FIT MEMBERSHIP ADMIN
# =========================================================

@admin.action(description="Approve selected UPI payments")
def approve_memberships(modeladmin, request, queryset):

    plan_days = {
        "monthly": 30,
        "quarterly": 180,
        "yearly": 365,
    }

    approved = 0

    for membership in queryset:

        if membership.status != "created":
            continue

        days = plan_days.get(membership.plan)

        if not days:
            continue

        now = timezone.now()

        # -------------------------------------------------
        # If user already has an active paid membership,
        # extend from its current expiry date.
        # -------------------------------------------------

        active_membership = (
            Membership.objects
            .filter(
                user=membership.user,
                status="paid",
                expires_at__gt=now,
            )
            .exclude(id=membership.id)
            .order_by("-expires_at")
            .first()
        )

        if active_membership:
            start_date = active_membership.expires_at
        else:
            start_date = now

        membership.status = "paid"
        membership.started_at = start_date
        membership.expires_at = (
            start_date + timedelta(days=days)
        )

        membership.save()

        approved += 1

    modeladmin.message_user(
        request,
        f"{approved} membership payment(s) approved successfully."
    )


@admin.action(description="Reject selected UPI payments")
def reject_memberships(modeladmin, request, queryset):

    rejected = 0

    for membership in queryset:

        if membership.status == "created":

            membership.status = "failed"

            membership.save(
                update_fields=[
                    "status",
                    "updated_at",
                ]
            )

            rejected += 1

    modeladmin.message_user(
        request,
        f"{rejected} membership payment(s) rejected."
    )


@admin.register(Membership)
class MembershipAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "user",
        "plan",
        "amount",
        "status",
        "started_at",
        "expires_at",
        "created_at",
    )

    list_filter = (
        "status",
        "plan",
        "created_at",
    )

    search_fields = (
        "user__username",
        "user__email",
        "razorpay_order_id",
        "razorpay_payment_id",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    fieldsets = (
        (
            "Membership",
            {
                "fields": (
                    "user",
                    "plan",
                    "amount",
                    "status",
                )
            },
        ),

        (
            "UPI Payment",
            {
                "fields": (
                    "payment_screenshot",
                )
            },
        ),

        (
            "Membership Period",
            {
                "fields": (
                    "started_at",
                    "expires_at",
                )
            },
        ),

        (
            "Payment Compatibility",
            {
                "fields": (
                    "razorpay_order_id",
                    "razorpay_payment_id",
                    "razorpay_signature",
                ),
                "classes": (
                    "collapse",
                ),
            },
        ),

        (
            "Timestamps",
            {
                "fields": (
                    "created_at",
                    "updated_at",
                )
            },
        ),
    )

    actions = (
        approve_memberships,
        reject_memberships,
    )

    ordering = (
        "-created_at",
    )