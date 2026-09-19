from django.contrib.auth.models import User
from rest_framework import serializers
from .models import (
    Profile,
    Assessment,
    WorkoutPlan,
    WorkoutDay,
    WorkoutExercise,
    MotionCheckAnalysis,
    SafeModeProgress,
    DietPlan,
    DietMeal,
    Membership,
    Product,
)


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
        )

        Profile.objects.create(user=user)

        return user
class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Profile
        fields = [
            "username",
            "email",
            "name",
            "age",
            "height",
            "weight",
            "training_experience",
            "fitness_goal",
            "workout_days_per_week",
            "dietary_preference",
        ]   
class AssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assessment
        fields = [
            "id",
            "training_duration",
            "days_per_week",
            "equipment_familiarity",
            "compound_experience",
            "squat_confidence",
            "pushup_confidence",
            "curl_confidence",
            "workout_location",
            "structured_program",
            "score",
            "level",
            "created_at",
        ]

        read_only_fields = [
            "score",
            "level",
            "created_at",
        ]         
class WorkoutExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkoutExercise
        fields = [
            "id",
            "name",
            "sets",
            "reps",
            "rest_seconds",
            "equipment",
            "motioncheck_supported",
            "completed",
        ]


class WorkoutDaySerializer(serializers.ModelSerializer):
    exercises = WorkoutExerciseSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = WorkoutDay
        fields = [
            "id",
            "week_number",
            "day_number",
            "title",
            "theme",
            "is_rest_day",
            "completed",
            "exercises",
        ]


class WorkoutPlanSerializer(serializers.ModelSerializer):
    days = WorkoutDaySerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = WorkoutPlan
        fields = [
            "id",
            "level",
            "fitness_goal",
            "workout_days_per_week",
            "is_active",
            "created_at",
            "days",
        ]  
class MotionCheckAnalysisSerializer(serializers.ModelSerializer):
    video_url = serializers.SerializerMethodField()

    class Meta:
        model = MotionCheckAnalysis
        fields = [
            "id",
            "exercise",
            "video",
            "video_url",
            "rep_count",
            "form_score",
            "feedback",
            "metric_breakdown",
            "created_at",
        ]

        read_only_fields = [
            "rep_count",
            "form_score",
            "feedback",
            "metric_breakdown",
            "created_at",
        ]

    def get_video_url(self, obj):
        request = self.context.get("request")

        if obj.video and request:
            return request.build_absolute_uri(
                obj.video.url
            )

        if obj.video:
            return obj.video.url

        return None  
class SafeModeProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = SafeModeProgress
        fields = [
            "completed_modules",
            "total_correct",
            "total_questions",
            "knowledge_score",
            "updated_at",
        ]

        read_only_fields = [
            "knowledge_score",
            "updated_at",
        ]    
# ==================================================
# DIET MEAL SERIALIZER
# ==================================================

class DietMealSerializer(serializers.ModelSerializer):
    class Meta:
        model = DietMeal
        fields = [
            "id",
            "meal_type",
            "title",
            "foods",
            "calories",
            "protein",
            "carbs",
            "fats",
            "order",
        ]


# ==================================================
# DIET PLAN SERIALIZER
# ==================================================

class DietPlanSerializer(serializers.ModelSerializer):
    meals = DietMealSerializer(
        many=True,
        read_only=True
    )

    class Meta:
        model = DietPlan
        fields = [
            "id",
            "fitness_goal",
            "dietary_preference",
            "daily_calories",
            "protein_grams",
            "carbs_grams",
            "fats_grams",
            "is_active",
            "created_at",
            "meals",
        ]                    

# =========================================================
# PRODUCT SERIALIZER
# =========================================================

class ProductSerializer(serializers.ModelSerializer):

    class Meta:

        model = Product

        fields = [
            "id",
            "name",
            "slug",
            "category",
            "description",
            "price",
            "stock",
            "colors",
            "sizes",
            "material",
            "fit",
            "features",
            "rating",
            "review_count",
            "image",
            "is_active",
            "created_at",
            "updated_at",
        ]        