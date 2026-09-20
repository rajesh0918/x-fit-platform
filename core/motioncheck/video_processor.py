import cv2

from .pose_detector import PoseDetector
from .angle_calculator import calculate_angle
from .squat_analyzer import SquatAnalyzer
from .pushup_analyzer import PushUpAnalyzer
from .bicep_curl_analyzer import BicepCurlAnalyzer


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def get_point(landmark):
    """
    Convert a landmark object into an (x, y) tuple.
    """
    return (
        landmark.x,
        landmark.y
    )


def get_visibility(landmark):
    """
    Get landmark confidence / visibility.
    """
    return float(
        getattr(
            landmark,
            "visibility",
            0.0
        )
    )


# ============================================================
# SQUAT
# ============================================================

def process_squat_video(video_path):
    """
    Process a squat video using MoveNet.
    """

    detector = PoseDetector()
    analyzer = SquatAnalyzer()

    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        detector.close()
        raise ValueError(
            f"Could not open video: {video_path}"
        )

    processed_frames = 0
    skipped_frames = 0

    selected_leg = None

    try:

        while True:

            ret, frame = cap.read()

            if not ret:
                break

            try:

                result = detector.process_frame(frame)

                if not result.pose_landmarks:
                    skipped_frames += 1
                    continue

                landmarks = result.pose_landmarks[0]

                # ------------------------------------------------
                # Select the better visible leg
                # ------------------------------------------------

                if selected_leg is None:

                    left_visibility = min(
                        get_visibility(
                            landmarks[PoseDetector.LEFT_HIP]
                        ),
                        get_visibility(
                            landmarks[PoseDetector.LEFT_KNEE]
                        ),
                        get_visibility(
                            landmarks[PoseDetector.LEFT_ANKLE]
                        )
                    )

                    right_visibility = min(
                        get_visibility(
                            landmarks[PoseDetector.RIGHT_HIP]
                        ),
                        get_visibility(
                            landmarks[PoseDetector.RIGHT_KNEE]
                        ),
                        get_visibility(
                            landmarks[PoseDetector.RIGHT_ANKLE]
                        )
                    )

                    if (
                        left_visibility >= 0.40
                        and left_visibility >= right_visibility
                    ):
                        selected_leg = "left"

                    elif right_visibility >= 0.40:
                        selected_leg = "right"

                    else:
                        skipped_frames += 1
                        continue

                # ------------------------------------------------
                # Get selected leg
                # ------------------------------------------------

                if selected_leg == "left":

                    hip = landmarks[
                        PoseDetector.LEFT_HIP
                    ]

                    knee = landmarks[
                        PoseDetector.LEFT_KNEE
                    ]

                    ankle = landmarks[
                        PoseDetector.LEFT_ANKLE
                    ]

                else:

                    hip = landmarks[
                        PoseDetector.RIGHT_HIP
                    ]

                    knee = landmarks[
                        PoseDetector.RIGHT_KNEE
                    ]

                    ankle = landmarks[
                        PoseDetector.RIGHT_ANKLE
                    ]

                # ------------------------------------------------
                # Visibility check
                # ------------------------------------------------

                if (
                    get_visibility(hip) < 0.20
                    or get_visibility(knee) < 0.20
                    or get_visibility(ankle) < 0.20
                ):
                    skipped_frames += 1
                    continue

                # ------------------------------------------------
                # Analyze squat
                # ------------------------------------------------

                analyzer.analyze(
                    get_point(hip),
                    get_point(knee),
                    get_point(ankle)
                )

                processed_frames += 1

            except Exception:
                skipped_frames += 1
                continue

    finally:

        cap.release()
        detector.close()

    # ------------------------------------------------------------
    # IMPORTANT:
    # Views expects rep_quality.
    # ------------------------------------------------------------

    return {
        "exercise": "squat",
        "selected_leg": selected_leg,
        "rep_count": analyzer.rep_count,
        "rep_angles": analyzer.rep_angles,
        "rep_quality": analyzer.get_rep_quality(),
        "form_score": analyzer.calculate_form_score(),
        "feedback": analyzer.get_feedback(),
        "processed_frames": processed_frames,
        "skipped_frames": skipped_frames,
        "debug": analyzer.get_debug_data(),
    }


# ============================================================
# PUSH-UP
# ============================================================

def process_pushup_video(video_path):
    """
    Process a push-up video using MoveNet.
    """

    detector = PoseDetector()
    analyzer = PushUpAnalyzer()

    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        detector.close()
        raise ValueError(
            f"Could not open video: {video_path}"
        )

    processed_frames = 0
    skipped_frames = 0

    selected_arm = None

    try:

        while True:

            ret, frame = cap.read()

            if not ret:
                break

            try:

                result = detector.process_frame(frame)

                if not result.pose_landmarks:
                    skipped_frames += 1
                    continue

                landmarks = result.pose_landmarks[0]

                # ------------------------------------------------
                # Select arm
                # ------------------------------------------------

                if selected_arm is None:

                    left_visibility = min(
                        get_visibility(
                            landmarks[PoseDetector.LEFT_SHOULDER]
                        ),
                        get_visibility(
                            landmarks[PoseDetector.LEFT_ELBOW]
                        ),
                        get_visibility(
                            landmarks[PoseDetector.LEFT_WRIST]
                        )
                    )

                    right_visibility = min(
                        get_visibility(
                            landmarks[PoseDetector.RIGHT_SHOULDER]
                        ),
                        get_visibility(
                            landmarks[PoseDetector.RIGHT_ELBOW]
                        ),
                        get_visibility(
                            landmarks[PoseDetector.RIGHT_WRIST]
                        )
                    )

                    if (
                        left_visibility >= 0.10
                        and left_visibility >= right_visibility
                    ):
                        selected_arm = "left"

                    elif right_visibility >= 0.10:
                        selected_arm = "right"

                    else:
                        skipped_frames += 1
                        continue

                # ------------------------------------------------
                # Get selected arm
                # ------------------------------------------------

                if selected_arm == "left":

                    shoulder = landmarks[
                        PoseDetector.LEFT_SHOULDER
                    ]

                    elbow = landmarks[
                        PoseDetector.LEFT_ELBOW
                    ]

                    wrist = landmarks[
                        PoseDetector.LEFT_WRIST
                    ]

                else:

                    shoulder = landmarks[
                        PoseDetector.RIGHT_SHOULDER
                    ]

                    elbow = landmarks[
                        PoseDetector.RIGHT_ELBOW
                    ]

                    wrist = landmarks[
                        PoseDetector.RIGHT_WRIST
                    ]

                # ------------------------------------------------
                # Visibility check
                # ------------------------------------------------

                if (
                    get_visibility(shoulder) < 0.10
                    or get_visibility(elbow) < 0.10
                    or get_visibility(wrist) < 0.10
                ):
                    skipped_frames += 1
                    continue

                # ------------------------------------------------
                # Analyze push-up
                # ------------------------------------------------

                analyzer.analyze(
                    get_point(shoulder),
                    get_point(elbow),
                    get_point(wrist)
                )

                processed_frames += 1

            except Exception:
                skipped_frames += 1
                continue

        # --------------------------------------------------------
        # Finalize last rep
        # --------------------------------------------------------

        analyzer.finalize_video()

    finally:

        cap.release()
        detector.close()

    return {
        "exercise": "pushup",
        "selected_arm": selected_arm,
        "rep_count": analyzer.rep_count,
        "rep_angles": analyzer.rep_angles,
        "rep_quality": analyzer.get_rep_quality(),
        "form_score": analyzer.calculate_form_score(),
        "feedback": analyzer.get_feedback(),
        "processed_frames": processed_frames,
        "skipped_frames": skipped_frames,
    }


# ============================================================
# BICEP CURL - ACTIVE ARM DETECTION
# ============================================================

def detect_active_curl_arm(video_path):
    """
    Detect which arm is performing the curl.

    Uses elbow-angle movement over the video.
    """

    detector = PoseDetector()

    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        detector.close()
        raise ValueError(
            f"Could not open video: {video_path}"
        )

    left_angles = []
    right_angles = []

    try:

        while True:

            ret, frame = cap.read()

            if not ret:
                break

            try:

                result = detector.process_frame(frame)

                if not result.pose_landmarks:
                    continue

                landmarks = result.pose_landmarks[0]

                # ------------------------------------------------
                # LEFT ARM
                # ------------------------------------------------

                left_shoulder = landmarks[
                    PoseDetector.LEFT_SHOULDER
                ]

                left_elbow = landmarks[
                    PoseDetector.LEFT_ELBOW
                ]

                left_wrist = landmarks[
                    PoseDetector.LEFT_WRIST
                ]

                left_visibility = min(
                    get_visibility(left_shoulder),
                    get_visibility(left_elbow),
                    get_visibility(left_wrist)
                )

                if left_visibility >= 0.10:

                    left_angle = calculate_angle(
                        get_point(left_shoulder),
                        get_point(left_elbow),
                        get_point(left_wrist)
                    )

                    if 20 <= left_angle <= 180:

                        left_angles.append(
                            left_angle
                        )

                # ------------------------------------------------
                # RIGHT ARM
                # ------------------------------------------------

                right_shoulder = landmarks[
                    PoseDetector.RIGHT_SHOULDER
                ]

                right_elbow = landmarks[
                    PoseDetector.RIGHT_ELBOW
                ]

                right_wrist = landmarks[
                    PoseDetector.RIGHT_WRIST
                ]

                right_visibility = min(
                    get_visibility(right_shoulder),
                    get_visibility(right_elbow),
                    get_visibility(right_wrist)
                )

                if right_visibility >= 0.10:

                    right_angle = calculate_angle(
                        get_point(right_shoulder),
                        get_point(right_elbow),
                        get_point(right_wrist)
                    )

                    if 20 <= right_angle <= 180:

                        right_angles.append(
                            right_angle
                        )

            except Exception:
                continue

    finally:

        cap.release()
        detector.close()

    # ------------------------------------------------------------
    # Calculate movement range
    # ------------------------------------------------------------

    def calculate_movement(angles):

        if len(angles) < 5:
            return 0.0

        minimum = min(angles)
        maximum = max(angles)

        return maximum - minimum

    left_movement = calculate_movement(
        left_angles
    )

    right_movement = calculate_movement(
        right_angles
    )

    # ------------------------------------------------------------
    # Select active arm
    # ------------------------------------------------------------

    if (
        left_movement == 0
        and right_movement == 0
    ):
        raise ValueError(
            "Could not detect sufficient arm movement."
        )

    if left_movement >= right_movement:

        selected_arm = "left"

    else:

        selected_arm = "right"

    return {
        "selected_arm": selected_arm,
        "left_movement": round(
            left_movement,
            2
        ),
        "right_movement": round(
            right_movement,
            2
        ),
        "left_samples": len(left_angles),
        "right_samples": len(right_angles),
    }


# ============================================================
# BICEP CURL
# ============================================================

def process_bicep_curl_video(video_path):
    """
    Process a bicep curl video using MoveNet.

    Important:
    BicepCurlAnalyzer uses `rep_data`.
    It does NOT use `rep_angles`.
    """

    # ------------------------------------------------------------
    # Detect active arm
    # ------------------------------------------------------------

    arm_detection = detect_active_curl_arm(
        video_path
    )

    selected_arm = arm_detection[
        "selected_arm"
    ]

    # ------------------------------------------------------------
    # Create detector and analyzer
    # ------------------------------------------------------------

    detector = PoseDetector()
    analyzer = BicepCurlAnalyzer()

    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        detector.close()
        raise ValueError(
            f"Could not open video: {video_path}"
        )

    processed_frames = 0
    skipped_frames = 0

    try:

        while True:

            ret, frame = cap.read()

            if not ret:
                break

            try:

                result = detector.process_frame(
                    frame
                )

                if not result.pose_landmarks:
                    skipped_frames += 1
                    continue

                landmarks = result.pose_landmarks[0]

                # ------------------------------------------------
                # Select active arm
                # ------------------------------------------------

                if selected_arm == "left":

                    shoulder = landmarks[
                        PoseDetector.LEFT_SHOULDER
                    ]

                    elbow = landmarks[
                        PoseDetector.LEFT_ELBOW
                    ]

                    wrist = landmarks[
                        PoseDetector.LEFT_WRIST
                    ]

                else:

                    shoulder = landmarks[
                        PoseDetector.RIGHT_SHOULDER
                    ]

                    elbow = landmarks[
                        PoseDetector.RIGHT_ELBOW
                    ]

                    wrist = landmarks[
                        PoseDetector.RIGHT_WRIST
                    ]

                # ------------------------------------------------
                # Calculate elbow angle
                #
                # We intentionally don't reject the frame based
                # on individual MoveNet visibility values.
                # ------------------------------------------------

                elbow_angle = calculate_angle(
                    get_point(shoulder),
                    get_point(elbow),
                    get_point(wrist)
                )

                # ------------------------------------------------
                # Validate angle
                # ------------------------------------------------

                if not (
                    20 <= elbow_angle <= 180
                ):
                    skipped_frames += 1
                    continue

                # ------------------------------------------------
                # Analyze curl
                # ------------------------------------------------

                analyzer.analyze(
                    get_point(shoulder),
                    get_point(elbow),
                    get_point(wrist)
                )

                processed_frames += 1

            except Exception:
                skipped_frames += 1
                continue

    finally:

        cap.release()
        detector.close()

    # ------------------------------------------------------------
    # IMPORTANT:
    # BicepCurlAnalyzer uses rep_data.
    # ------------------------------------------------------------

    return {
        "exercise": "bicep_curl",
        "selected_arm": selected_arm,
        "arm_detection": arm_detection,
        "rep_count": analyzer.rep_count,
        "rep_data": analyzer.rep_data,
        "rep_quality": analyzer.get_rep_quality(),
        "form_score": analyzer.calculate_form_score(),
        "feedback": analyzer.get_feedback(),
        "processed_frames": processed_frames,
        "skipped_frames": skipped_frames,
    }