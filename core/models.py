from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


# =========================================================
# PROFILE
# =========================================================

class Profile(models.Model):

    EXPERIENCE_CHOICES = [
        ("beginner", "Beginner"),
        ("intermediate", "Intermediate"),
        ("advanced", "Advanced"),
    ]

    GOAL_CHOICES = [
        ("fat_loss", "Fat Loss"),
        ("muscle_gain", "Muscle Gain"),
        ("strength", "Strength"),
        ("general_fitness", "General Fitness"),
    ]

    DIET_CHOICES = [
        ("vegetarian", "Vegetarian"),
        ("non_vegetarian", "Non-Vegetarian"),
        ("vegan", "Vegan"),
    ]

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile"
    )

    name = models.CharField(
        max_length=100,
        blank=True,
        default=""
    )

    age = models.PositiveIntegerField(
        null=True,
        blank=True
    )

    height = models.FloatField(
        null=True,
        blank=True
    )

    weight = models.FloatField(
        null=True,
        blank=True
    )

    training_experience = models.CharField(
        max_length=20,
        choices=EXPERIENCE_CHOICES,
        blank=True,
        default=""
    )

    fitness_goal = models.CharField(
        max_length=30,
        choices=GOAL_CHOICES,
        blank=True,
        default=""
    )

    activity_level = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )

    workout_days_per_week = models.PositiveIntegerField(
        null=True,
        blank=True
    )

    dietary_preference = models.CharField(
        max_length=20,
        choices=DIET_CHOICES,
        blank=True,
        default=""
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"{self.user.username} Profile"


# =========================================================
# FITNESS ASSESSMENT
# =========================================================

class Assessment(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="assessments"
    )

    # =====================================================
    # ASSESSMENT INFORMATION
    # =====================================================

    training_duration = models.CharField(
        max_length=20,
        null=True,
        blank=True
    )

    days_per_week = models.PositiveIntegerField(
        null=True,
        blank=True
    )

    equipment_familiarity = models.CharField(
        max_length=20,
        null=True,
        blank=True
    )

    compound_experience = models.CharField(
        max_length=20,
        null=True,
        blank=True
    )

    squat_confidence = models.CharField(
        max_length=20,
        null=True,
        blank=True
    )

    pushup_confidence = models.CharField(
        max_length=20,
        null=True,
        blank=True
    )

    curl_confidence = models.CharField(
        max_length=20,
        null=True,
        blank=True
    )

    workout_location = models.CharField(
        max_length=20,
        null=True,
        blank=True
    )

    structured_program = models.CharField(
        max_length=10,
        null=True,
        blank=True
    )

    # =====================================================
    # ASSESSMENT RESULT
    # =====================================================

    score = models.PositiveIntegerField(
        default=0
    )

    level = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return (
            f"{self.user.username} Assessment"
        )


# =========================================================
# WORKOUT PLAN
# =========================================================

class WorkoutPlan(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="workout_plans"
    )

    name = models.CharField(
        max_length=200,
        default="X-FIT Workout Plan"
    )

    level = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )

    fitness_goal = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    goal = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    workout_days_per_week = models.PositiveIntegerField(
        default=3
    )

    duration_weeks = models.PositiveIntegerField(
        default=4
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return (
            f"{self.user.username} - "
            f"{self.name}"
        )


# =========================================================
# WORKOUT DAY
# =========================================================

class WorkoutDay(models.Model):

    plan = models.ForeignKey(
        WorkoutPlan,
        on_delete=models.CASCADE,
        related_name="days"
    )

    week_number = models.PositiveIntegerField(
        default=1
    )

    day_number = models.PositiveIntegerField(
        default=1
    )

    title = models.CharField(
        max_length=200
    )

    theme = models.CharField(
        max_length=200,
        blank=True,
        null=True
    )

    is_rest_day = models.BooleanField(
        default=False
    )

    completed = models.BooleanField(
        default=False
    )

    completed_at = models.DateTimeField(
        blank=True,
        null=True
    )

    def __str__(self):
        return (
            f"{self.plan.name} - "
            f"Week {self.week_number} - "
            f"Day {self.day_number}"
        )


# =========================================================
# WORKOUT EXERCISE
# =========================================================

class WorkoutExercise(models.Model):

    workout_day = models.ForeignKey(
        WorkoutDay,
        on_delete=models.CASCADE,
        related_name="exercises",
        null=True,
        blank=True
    )

    # Compatibility with older workout code
    workout_plan = models.ForeignKey(
        WorkoutPlan,
        on_delete=models.CASCADE,
        related_name="legacy_exercises",
        null=True,
        blank=True
    )

    name = models.CharField(
        max_length=200
    )

    day = models.CharField(
        max_length=50,
        blank=True,
        null=True
    )

    sets = models.PositiveIntegerField(
        default=3
    )

    reps = models.PositiveIntegerField(
        default=10
    )

    rest_seconds = models.PositiveIntegerField(
        default=60
    )

    equipment = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    motioncheck_supported = models.BooleanField(
        default=False
    )

    completed = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        if self.workout_day:
            return (
                f"{self.workout_day.title} - "
                f"{self.name}"
            )

        if self.workout_plan:
            return (
                f"{self.workout_plan.name} - "
                f"{self.name}"
            )

        return self.name


# =========================================================
# MOTION CHECK ANALYSIS
# =========================================================

class MotionCheckAnalysis(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="motioncheck_analyses"
    )

    exercise = models.CharField(
        max_length=50
    )

    video = models.FileField(
        upload_to="motioncheck/",
        blank=True,
        null=True
    )

    rep_count = models.PositiveIntegerField(
        default=0
    )

    form_score = models.FloatField(
        default=0
    )

    feedback = models.TextField(
        blank=True,
        null=True
    )

    metric_breakdown = models.JSONField(
        default=dict,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return (
            f"{self.user.username} - "
            f"{self.exercise} - "
            f"{self.form_score}"
        )


# =========================================================
# OLD MOTION CHECK
# Kept for compatibility with existing code/data
# =========================================================

class MotionCheck(models.Model):

    EXERCISE_CHOICES = [
        ("squat", "Squat"),
        ("pushup", "Push Up"),
        ("bicep_curl", "Bicep Curl"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="motion_checks"
    )

    exercise = models.CharField(
        max_length=30,
        choices=EXERCISE_CHOICES
    )

    score = models.FloatField(
        null=True,
        blank=True
    )

    feedback = models.TextField(
        blank=True,
        null=True
    )

    video = models.FileField(
        upload_to="motioncheck/",
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return (
            f"{self.user.username} - "
            f"{self.exercise}"
        )


# =========================================================
# SAFE MODE PROGRESS
# =========================================================

class SafeModeProgress(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="safe_mode_progress"
    )

    completed_modules = models.PositiveIntegerField(
        default=0
    )

    total_correct = models.PositiveIntegerField(
        default=0
    )

    total_questions = models.PositiveIntegerField(
        default=0
    )

    knowledge_score = models.FloatField(
        default=0
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return (
            f"{self.user.username} "
            f"Safe Mode Progress"
        )


# =========================================================
# DIET PLAN
# =========================================================

class DietPlan(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="diet_plans"
    )

    fitness_goal = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    dietary_preference = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    # Main nutrition fields
    daily_calories = models.FloatField(
        null=True,
        blank=True
    )

    protein_grams = models.FloatField(
        null=True,
        blank=True
    )

    carbs_grams = models.FloatField(
        null=True,
        blank=True
    )

    fats_grams = models.FloatField(
        null=True,
        blank=True
    )

    # Compatibility nutrition fields
    calories = models.FloatField(
        null=True,
        blank=True
    )

    protein = models.FloatField(
        null=True,
        blank=True
    )

    carbohydrates = models.FloatField(
        null=True,
        blank=True
    )

    fats = models.FloatField(
        null=True,
        blank=True
    )

    hydration = models.FloatField(
        null=True,
        blank=True
    )

    plan_data = models.JSONField(
        default=dict,
        blank=True
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return (
            f"{self.user.username} "
            f"Diet Plan"
        )


# =========================================================
# DIET MEAL
# =========================================================

class DietMeal(models.Model):

    plan = models.ForeignKey(
        DietPlan,
        on_delete=models.CASCADE,
        related_name="meals"
    )

    meal_type = models.CharField(
        max_length=50
    )

    title = models.CharField(
        max_length=200
    )

    foods = models.JSONField(
        default=list,
        blank=True
    )

    calories = models.FloatField(
        default=0
    )

    protein = models.FloatField(
        default=0
    )

    carbs = models.FloatField(
        default=0
    )

    fats = models.FloatField(
        default=0
    )

    order = models.PositiveIntegerField(
        default=0
    )

    def __str__(self):
        return (
            f"{self.plan.user.username} - "
            f"{self.meal_type} - "
            f"{self.title}"
        )


# =========================================================
# MEMBERSHIP
# =========================================================

class Membership(models.Model):

    PLAN_CHOICES = [
        ("monthly", "Monthly"),
        ("quarterly", "Quarterly"),
        ("yearly", "Yearly"),
    ]

    STATUS_CHOICES = [
        ("created", "Created"),
        ("paid", "Paid"),
        ("failed", "Failed"),
        ("expired", "Expired"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="memberships"
    )

    plan = models.CharField(
        max_length=20,
        choices=PLAN_CHOICES
    )

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="created"
    )

    # =====================================================
    # RAZORPAY COMPATIBILITY FIELDS
    # =====================================================

    razorpay_order_id = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    razorpay_payment_id = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    razorpay_signature = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    # =====================================================
    # UPI PAYMENT SCREENSHOT
    # =====================================================

    payment_screenshot = models.ImageField(
        upload_to="membership/payments/",
        blank=True,
        null=True
    )

    # Persistent payment proof for Vercel/serverless deployments.
    # The ImageField above is kept for compatibility, but these fields
    # store the uploaded screenshot directly in PostgreSQL.
    payment_screenshot_data = models.BinaryField(
        blank=True,
        null=True,
        editable=False
    )

    payment_screenshot_name = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        editable=False
    )

    payment_screenshot_type = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        editable=False
    )

    # =====================================================
    # MEMBERSHIP PERIOD
    # =====================================================

    started_at = models.DateTimeField(
        blank=True,
        null=True
    )

    expires_at = models.DateTimeField(
        blank=True,
        null=True
    )

    # =====================================================
    # SYSTEM TIMESTAMPS
    # =====================================================

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    # =====================================================
    # STRING
    # =====================================================

    def __str__(self):
        return (
            f"{self.user.username} - "
            f"{self.plan} - "
            f"{self.status}"
        )

    # =====================================================
    # ACTIVE CHECK
    # =====================================================

    @property
    def is_active(self):

        if self.status != "paid":
            return False

        if not self.expires_at:
            return False

        return timezone.now() < self.expires_at
# =========================================================
# X-FIT SHOP - ORDER SYSTEM
# =========================================================

class Order(models.Model):

    PAYMENT_STATUS_CHOICES = [
        ("pending", "Pending"),
        ("submitted", "Payment Submitted"),
        ("verified", "Verified"),
        ("rejected", "Rejected"),
    ]

    ORDER_STATUS_CHOICES = [
        ("pending_payment", "Pending Payment"),
        ("payment_review", "Payment Review"),
        ("confirmed", "Confirmed"),
        ("processing", "Processing"),
        ("shipped", "Shipped"),
        ("out_for_delivery", "Out For Delivery"),
        ("delivered", "Delivered"),
        ("cancelled", "Cancelled"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="shop_orders",
    )

    order_id = models.CharField(
        max_length=30,
        unique=True,
        editable=False,
    )

    # -----------------------------------------------------
    # CUSTOMER / SHIPPING
    # -----------------------------------------------------

    full_name = models.CharField(
        max_length=150,
    )

    phone = models.CharField(
        max_length=20,
    )

    address = models.TextField()

    city = models.CharField(
        max_length=100,
    )

    state = models.CharField(
        max_length=100,
    )

    pincode = models.CharField(
        max_length=10,
    )

    # -----------------------------------------------------
    # PRICE
    # -----------------------------------------------------

    subtotal = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    delivery_charge = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
    )

    total_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    # -----------------------------------------------------
    # PAYMENT
    # -----------------------------------------------------

    utr = models.CharField(
        max_length=100,
        blank=True,
    )

    payment_screenshot = models.ImageField(
        upload_to="shop/payment_proofs/",
        blank=True,
        null=True,
    )

    payment_status = models.CharField(
        max_length=30,
        choices=PAYMENT_STATUS_CHOICES,
        default="pending",
    )

    # -----------------------------------------------------
    # ORDER STATUS
    # -----------------------------------------------------

    order_status = models.CharField(
        max_length=30,
        choices=ORDER_STATUS_CHOICES,
        default="pending_payment",
    )

    # -----------------------------------------------------
    # TIMESTAMPS
    # -----------------------------------------------------

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def save(self, *args, **kwargs):

        if not self.order_id:

            import uuid

            self.order_id = (
                "XF-"
                + uuid.uuid4()
                .hex[:10]
                .upper()
            )

        super().save(
            *args,
            **kwargs
        )

    def __str__(self):

        return (
            f"{self.order_id} - "
            f"{self.user.username}"
        )


# =========================================================
# X-FIT ORDER ITEM
# =========================================================

class OrderItem(models.Model):

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items",
    )

    # -----------------------------------------------------
    # PRODUCT
    # -----------------------------------------------------

    product_id = models.PositiveIntegerField()

    product_name = models.CharField(
        max_length=200,
    )

    # -----------------------------------------------------
    # VARIANTS
    # -----------------------------------------------------

    color = models.CharField(
        max_length=100,
        blank=True,
    )

    size = models.CharField(
        max_length=20,
        blank=True,
    )

    # -----------------------------------------------------
    # PRICE / QUANTITY
    # -----------------------------------------------------

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    quantity = models.PositiveIntegerField(
        default=1,
    )

    # -----------------------------------------------------
    # TOTAL
    # -----------------------------------------------------

    item_total = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    def save(self, *args, **kwargs):

        self.item_total = (
            self.price *
            self.quantity
        )

        super().save(
            *args,
            **kwargs
        )

    def __str__(self):

        return (
            f"{self.product_name} - "
            f"{self.order.order_id}"
        )    
# =========================================================
# X-FIT SHOP - PRODUCT
# =========================================================

class Product(models.Model):

    CATEGORY_CHOICES = [
        ("tshirts", "T-Shirts"),
        ("compression", "Compression"),
        ("hoodies", "Hoodies"),
        ("shorts", "Shorts"),
        ("accessories", "Accessories"),
        ("bags", "Bags"),
    ]

    name = models.CharField(
        max_length=200
    )

    slug = models.SlugField(
        max_length=220,
        unique=True
    )

    category = models.CharField(
        max_length=30,
        choices=CATEGORY_CHOICES
    )

    description = models.TextField(
        blank=True
    )

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    stock = models.PositiveIntegerField(
        default=0
    )

    colors = models.JSONField(
        default=list,
        blank=True
    )

    sizes = models.JSONField(
        default=list,
        blank=True
    )

    material = models.CharField(
        max_length=255,
        blank=True
    )

    fit = models.CharField(
        max_length=255,
        blank=True
    )

    features = models.JSONField(
        default=list,
        blank=True
    )

    rating = models.DecimalField(
        max_digits=3,
        decimal_places=1,
        default=0
    )

    review_count = models.PositiveIntegerField(
        default=0
    )

    image = models.ImageField(
        upload_to="shop/products/",
        blank=True,
        null=True
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):

        return self.name    