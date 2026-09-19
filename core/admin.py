from django.contrib import admin
from .models import Product
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

# Register your models here.
