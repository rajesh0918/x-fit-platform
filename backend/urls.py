from django.contrib import admin
from django.urls import path
from django.http import JsonResponse
from django.conf import settings
from django.conf.urls.static import static

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from core.views import (
    test_api,
    RegisterView,
    ProfileView,
    submit_assessment,
    generate_workout_plan,
    get_active_workout_plan,
    analyze_squat_video,
    analyze_pushup_video,
    analyze_bicep_curl_video,
    motioncheck_history,
    progress_dna,
    safe_mode_progress,
    toggle_workout_exercise,
    workout_stats,

    # DIET
    generate_diet_plan,
    get_active_diet_plan,
    complete_diet_day,
    nutrition_chat,

    # MEMBERSHIP
    membership_plans,
    create_membership_order,
    verify_membership_payment,
    membership_status,
    membership_history,
    submit_upi_payment,

    # SHOP
    create_shop_order,
    my_shop_orders,
    shop_products,
    shop_product_detail,
)


def api_home(request):
    return JsonResponse({
        "status": "online",
        "message": "X-Fit API Online",
        "version": "1.0",
    })


urlpatterns = [

    # ADMIN
    path(
        "admin/",
        admin.site.urls
    ),

    # API HOME
    path(
        "api/",
        api_home,
        name="api-home"
    ),

    # TEST API
    path(
        "api/test/",
        test_api,
        name="test-api"
    ),

    # AUTHENTICATION
    path(
        "api/register/",
        RegisterView.as_view(),
        name="register"
    ),

    path(
        "api/login/",
        TokenObtainPairView.as_view(),
        name="login"
    ),

    path(
        "api/refresh/",
        TokenRefreshView.as_view(),
        name="refresh"
    ),

    # PROFILE
    path(
        "api/profile/",
        ProfileView.as_view(),
        name="profile"
    ),

    # ASSESSMENT
    path(
        "api/assessment/submit/",
        submit_assessment,
        name="assessment-submit"
    ),

    # WORKOUT PLAN
    path(
        "api/workouts/generate/",
        generate_workout_plan,
        name="generate-workout-plan"
    ),

    path(
        "api/workouts/active/",
        get_active_workout_plan,
        name="active-workout-plan"
    ),

    # WORKOUT EXERCISE COMPLETION
    path(
        "api/workouts/exercises/<int:exercise_id>/toggle/",
        toggle_workout_exercise,
        name="toggle-workout-exercise"
    ),

    # WORKOUT STATISTICS
    path(
        "api/workouts/stats/",
        workout_stats,
        name="workout-stats"
    ),

    # MOTIONCHECK - SQUAT
    path(
        "api/motioncheck/squat/analyze/",
        analyze_squat_video,
        name="motioncheck-squat-analyze"
    ),

    # MOTIONCHECK - PUSHUP
    path(
        "api/motioncheck/pushup/analyze/",
        analyze_pushup_video,
        name="motioncheck-pushup-analyze"
    ),

    # MOTIONCHECK - BICEP CURL
    path(
        "api/motioncheck/bicep-curl/analyze/",
        analyze_bicep_curl_video,
        name="motioncheck-bicep-curl-analyze"
    ),

    # MOTIONCHECK HISTORY
    path(
        "api/motioncheck/history/",
        motioncheck_history,
        name="motioncheck-history"
    ),

    # PROGRESS DNA
    path(
        "api/progress-dna/",
        progress_dna,
        name="progress-dna"
    ),

    # SAFE MODE
    path(
        "api/safe-mode/progress/",
        safe_mode_progress,
        name="safe-mode-progress"
    ),

    # DIET PLAN
    path(
        "api/diet/generate/",
        generate_diet_plan,
        name="generate-diet-plan"
    ),

    path(
        "api/diet/active/",
        get_active_diet_plan,
        name="active-diet-plan"
    ),

    # COMPLETE DIET DAY
    path(
        "api/diet/complete-day/",
        complete_diet_day,
        name="complete-diet-day"
    ),

    # NUTRITION AI CHAT
    path(
        "api/nutrition/chat/",
        nutrition_chat,
        name="nutrition-chat"
    ),

    # MEMBERSHIP
    path(
        "api/membership/plans/",
        membership_plans,
        name="membership-plans"
    ),

    path(
        "api/membership/create-order/",
        create_membership_order,
        name="membership-create-order"
    ),

    path(
        "api/membership/verify/",
        verify_membership_payment,
        name="membership-verify"
    ),

    path(
        "api/membership/status/",
        membership_status,
        name="membership-status"
    ),

    path(
        "api/membership/history/",
        membership_history,
        name="membership-history"
    ),

    # SUBMIT UPI PAYMENT
    path(
    "api/membership/submit-upi/",
    submit_upi_payment,
    name="membership-submit-upi"
),

    # SHOP
    path(
        "api/shop/orders/",
        create_shop_order,
        name="create-shop-order"
    ),

    path(
        "api/shop/orders/my/",
        my_shop_orders,
        name="my-shop-orders"
    ),

    path(
        "api/shop/products/",
        shop_products,
        name="shop-products"
    ),

    path(
        "api/shop/products/<int:product_id>/",
        shop_product_detail,
        name="shop-product-detail"
    ),
]


if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )