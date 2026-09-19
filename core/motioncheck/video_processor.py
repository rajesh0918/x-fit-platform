import cv2

from .pose_detector import PoseDetector
from .angle_calculator import calculate_angle
from .squat_analyzer import SquatAnalyzer
from .pushup_analyzer import PushUpAnalyzer
from .bicep_curl_analyzer import BicepCurlAnalyzer


# ==================================================
# HELPERS
# ==================================================

def get_point(landmark):
    return (
        landmark.x,
        landmark.y
    )


def get_visibility(*landmarks):
    return min(
        landmark.visibility
        for landmark in landmarks
    )


# ==================================================
# SQUAT
# ==================================================

def process_squat_video(video_path):
    detector = PoseDetector()
    analyzer = SquatAnalyzer()

    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        detector.close()
        raise ValueError(
            f"Could not open video file: {video_path}"
        )

    fps = cap.get(cv2.CAP_PROP_FPS)

    if not fps or fps <= 0:
        fps = 30

    frame_index = 0
    processed_frames = 0
    skipped_frames = 0

    try:
        while True:
            success, frame = cap.read()

            if not success:
                break

            timestamp_ms = int(
                (frame_index / fps) * 1000
            )

            frame_index += 1

            result = detector.process_frame(
                frame,
                timestamp_ms
            )

            if not result.pose_landmarks:
                skipped_frames += 1
                continue

            landmarks = result.pose_landmarks[0]

            hip_landmark = landmarks[24]
            knee_landmark = landmarks[26]
            ankle_landmark = landmarks[28]

            visibility = get_visibility(
                hip_landmark,
                knee_landmark,
                ankle_landmark
            )

            if visibility < 0.40:
                skipped_frames += 1
                continue

            hip = get_point(hip_landmark)
            knee = get_point(knee_landmark)
            ankle = get_point(ankle_landmark)

            analysis = analyzer.analyze(
                hip,
                knee,
                ankle
            )

            if not analysis["valid"]:
                skipped_frames += 1
                continue

            processed_frames += 1

    finally:
        cap.release()
        detector.close()

    return {
        "exercise": "squat",

        "rep_count":
            analyzer.rep_count,

        "rep_angles": [
            round(angle, 2)
            for angle in analyzer.rep_angles
        ],

        "rep_quality":
            analyzer.get_rep_quality(),

        "form_score":
            analyzer.calculate_form_score(),

        "feedback":
            analyzer.get_feedback(),

        "processed_frames":
            processed_frames,

        "skipped_frames":
            skipped_frames,
    }


# ==================================================
# PUSH-UP
# ==================================================

def process_pushup_video(video_path):
    detector = PoseDetector()
    analyzer = PushUpAnalyzer()

    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        detector.close()
        raise ValueError(
            f"Could not open video file: {video_path}"
        )

    fps = cap.get(cv2.CAP_PROP_FPS)

    if not fps or fps <= 0:
        fps = 30

    frame_index = 0
    processed_frames = 0
    skipped_frames = 0

    try:
        while True:
            success, frame = cap.read()

            if not success:
                break

            timestamp_ms = int(
                (frame_index / fps) * 1000
            )

            frame_index += 1

            result = detector.process_frame(
                frame,
                timestamp_ms
            )

            if not result.pose_landmarks:
                skipped_frames += 1
                continue

            landmarks = result.pose_landmarks[0]

            shoulder_landmark = landmarks[12]
            elbow_landmark = landmarks[14]
            wrist_landmark = landmarks[16]

            visibility = get_visibility(
                shoulder_landmark,
                elbow_landmark,
                wrist_landmark
            )

            if visibility < 0.40:
                skipped_frames += 1
                continue

            shoulder = get_point(
                shoulder_landmark
            )

            elbow = get_point(
                elbow_landmark
            )

            wrist = get_point(
                wrist_landmark
            )

            analysis = analyzer.analyze(
                shoulder,
                elbow,
                wrist
            )

            if not analysis["valid"]:
                skipped_frames += 1
                continue

            processed_frames += 1

    finally:
        cap.release()
        detector.close()

    analyzer.finalize_video()

    return {
        "exercise": "pushup",

        "rep_count":
            analyzer.rep_count,

        "rep_angles": [
            round(angle, 2)
            for angle in analyzer.rep_angles
        ],

        "rep_quality":
            analyzer.get_rep_quality(),

        "form_score":
            analyzer.calculate_form_score(),

        "feedback":
            analyzer.get_feedback(),

        "processed_frames":
            processed_frames,

        "skipped_frames":
            skipped_frames,
    }


# ==================================================
# ACTIVE CURL ARM DETECTION
# ==================================================

def detect_active_curl_arm(video_path):
    detector = PoseDetector()
    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        detector.close()

        raise ValueError(
            f"Could not open video file: {video_path}"
        )

    fps = cap.get(cv2.CAP_PROP_FPS)

    if not fps or fps <= 0:
        fps = 30

    frame_index = 0

    left_angles = []
    right_angles = []

    try:
        while True:
            success, frame = cap.read()

            if not success:
                break

            timestamp_ms = int(
                (frame_index / fps) * 1000
            )

            frame_index += 1

            result = detector.process_frame(
                frame,
                timestamp_ms
            )

            if not result.pose_landmarks:
                continue

            landmarks = result.pose_landmarks[0]

            # LEFT ARM
            left_shoulder = landmarks[11]
            left_elbow = landmarks[13]
            left_wrist = landmarks[15]

            left_visibility = get_visibility(
                left_shoulder,
                left_elbow,
                left_wrist
            )

            if left_visibility >= 0.15:
                left_angle = calculate_angle(
                    get_point(left_shoulder),
                    get_point(left_elbow),
                    get_point(left_wrist)
                )

                if 25 <= left_angle <= 180:
                    left_angles.append(
                        left_angle
                    )

            # RIGHT ARM
            right_shoulder = landmarks[12]
            right_elbow = landmarks[14]
            right_wrist = landmarks[16]

            right_visibility = get_visibility(
                right_shoulder,
                right_elbow,
                right_wrist
            )

            if right_visibility >= 0.15:
                right_angle = calculate_angle(
                    get_point(right_shoulder),
                    get_point(right_elbow),
                    get_point(right_wrist)
                )

                if 25 <= right_angle <= 180:
                    right_angles.append(
                        right_angle
                    )

    finally:
        cap.release()
        detector.close()

    def movement_score(angles):
        if len(angles) < 10:
            return 0

        sorted_angles = sorted(
            angles
        )

        lower_index = int(
            len(sorted_angles) * 0.10
        )

        upper_index = int(
            len(sorted_angles) * 0.90
        )

        low = sorted_angles[
            lower_index
        ]

        high = sorted_angles[
            min(
                upper_index,
                len(sorted_angles) - 1
            )
        ]

        movement_range = (
            high - low
        )

        coverage_bonus = min(
            len(angles) / 100,
            1
        )

        return (
            movement_range *
            coverage_bonus
        )

    left_score = movement_score(
        left_angles
    )

    right_score = movement_score(
        right_angles
    )

    if (
        left_score == 0
        and right_score == 0
    ):
        raise ValueError(
            "MotionCheck could not confidently detect "
            "the active curling arm."
        )

    if right_score > left_score:
        selected_arm = "right"
    else:
        selected_arm = "left"

    return {
        "selected_arm":
            selected_arm,

        "left_score":
            round(left_score, 2),

        "right_score":
            round(right_score, 2),

        "left_samples":
            len(left_angles),

        "right_samples":
            len(right_angles),
    }


# ==================================================
# BICEP CURL
# ==================================================

def process_bicep_curl_video(video_path):
    arm_detection = detect_active_curl_arm(
        video_path
    )

    selected_arm = (
        arm_detection["selected_arm"]
    )

    detector = PoseDetector()
    analyzer = BicepCurlAnalyzer()

    cap = cv2.VideoCapture(
        video_path
    )

    if not cap.isOpened():
        detector.close()

        raise ValueError(
            f"Could not open video file: {video_path}"
        )

    fps = cap.get(cv2.CAP_PROP_FPS)

    if not fps or fps <= 0:
        fps = 30

    frame_index = 0
    processed_frames = 0
    skipped_frames = 0

    try:
        while True:
            success, frame = cap.read()

            if not success:
                break

            timestamp_ms = int(
                (frame_index / fps) * 1000
            )

            frame_index += 1

            result = detector.process_frame(
                frame,
                timestamp_ms
            )

            if not result.pose_landmarks:
                skipped_frames += 1
                continue

            landmarks = result.pose_landmarks[0]

            # ----------------------------------
            # Use detected active arm
            # ----------------------------------

            if selected_arm == "right":
                shoulder_landmark = landmarks[12]
                elbow_landmark = landmarks[14]
                wrist_landmark = landmarks[16]

            else:
                shoulder_landmark = landmarks[11]
                elbow_landmark = landmarks[13]
                wrist_landmark = landmarks[15]

            visibility = get_visibility(
                shoulder_landmark,
                elbow_landmark,
                wrist_landmark
            )

            # IMPORTANT:
            # Lowered from 0.18 to 0.10
            if visibility < 0.10:
                skipped_frames += 1
                continue

            shoulder = get_point(
                shoulder_landmark
            )

            elbow = get_point(
                elbow_landmark
            )

            wrist = get_point(
                wrist_landmark
            )

            analysis = analyzer.analyze(
                shoulder,
                elbow,
                wrist
            )

            if not analysis["valid"]:
                skipped_frames += 1
                continue

            processed_frames += 1

    finally:
        cap.release()
        detector.close()

    return {
        "exercise":
            "bicep_curl",

        "selected_arm":
            selected_arm,

        "arm_detection":
            arm_detection,

        "rep_count":
            analyzer.rep_count,

        "rep_data":
            analyzer.rep_data,

        "rep_quality":
            analyzer.get_rep_quality(),

        "form_score":
            analyzer.calculate_form_score(),

        "feedback":
            analyzer.get_feedback(),

        "processed_frames":
            processed_frames,

        "skipped_frames":
            skipped_frames,
    }