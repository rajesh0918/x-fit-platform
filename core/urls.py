from django.urls import path

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    test_api,
    RegisterView,
    ProfileView,
    submit_assessment,
    generate_workout_plan,
    get_active_workout_plan,
    toggle_workout_exercise,
    analyze_squat_video,
    analyze_pushup_video,
    analyze_bicep_curl_video,
    motioncheck_history,
    progress_dna,
    safe_mode_progress,
    workout_stats,
    generate_diet_plan,
    get_active_diet_plan,
    nutrition_chat,
    complete_diet_day
    
)


urlpatterns = [
    # --------------------------------
    # TEST
    # --------------------------------
    path(
        "test/",
        test_api,
        name="test-api"
    ),

    # --------------------------------
    # AUTHENTICATION
    # --------------------------------
    path(
        "register/",
        RegisterView.as_view(),
        name="register"
    ),

    path(
        "login/",
        TokenObtainPairView.as_view(),
        name="login"
    ),

    path(
        "refresh/",
        TokenRefreshView.as_view(),
        name="refresh"
    ),

    # --------------------------------
    # PROFILE
    # --------------------------------
    path(
        "profile/",
        ProfileView.as_view(),
        name="profile"
    ),

    # --------------------------------
    # ASSESSMENT
    # --------------------------------
    path(
        "assessment/submit/",
        submit_assessment,
        name="assessment-submit"
    ),

    # --------------------------------
    # WORKOUT PLAN
    # --------------------------------
    path(
        "workouts/generate/",
        generate_workout_plan,
        name="generate-workout-plan"
    ),

    path(
        "workouts/active/",
        get_active_workout_plan,
        name="active-workout-plan"
    ),

    # --------------------------------
    # MOTIONCHECK - SQUAT
    # --------------------------------
    path(
        "motioncheck/squat/analyze/",
        analyze_squat_video,
        name="motioncheck-squat-analyze"
    ),

    # --------------------------------
    # MOTIONCHECK - PUSH-UP
    # --------------------------------
    path(
        "motioncheck/pushup/analyze/",
        analyze_pushup_video,
        name="motioncheck-pushup-analyze"
    ),

    # --------------------------------
    # MOTIONCHECK - BICEP CURL
    # --------------------------------
    path(
        "motioncheck/bicep-curl/analyze/",
        analyze_bicep_curl_video,
        name="motioncheck-bicep-curl-analyze"
    ),

    # --------------------------------
    # MOTIONCHECK HISTORY
    # --------------------------------
    path(
        "motioncheck/history/",
        motioncheck_history,
        name="motioncheck-history"
    ),
    path(
    "progress-dna/",
    progress_dna,
    name="progress-dna"
),
    path(
    "safe-mode/progress/",
    safe_mode_progress,
    name="safe-mode-progress"
),
    path(
    "workouts/exercises/<int:exercise_id>/toggle/",
    toggle_workout_exercise,
    name="toggle-workout-exercise",
),
    path(
    "workouts/stats/",
    workout_stats,
    name="workout-stats",
),
    path(
    "diet/generate/",
    generate_diet_plan,
    name="generate-diet-plan",
),

path(
    "diet/active/",
    get_active_diet_plan,
    name="active-diet-plan",
),


path(
    "nutrition/chat/",
    nutrition_chat,
    name="nutrition-chat",
),
path(
    "diet/complete-day/",
    complete_diet_day,
    name="complete-diet-day",
),
]
