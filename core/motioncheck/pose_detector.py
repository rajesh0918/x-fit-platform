from pathlib import Path

import cv2
import numpy as np
import onnxruntime as ort


class PoseLandmark:
    """
    MediaPipe-like landmark object.

    Keeps x/y/z/visibility attributes so the
    rest of the MotionCheck system can work
    with landmark-style data.
    """

    def __init__(
        self,
        x,
        y,
        visibility=0.0,
        z=0.0,
    ):
        self.x = float(x)
        self.y = float(y)
        self.z = float(z)
        self.visibility = float(visibility)


class PoseResult:
    """
    MediaPipe-like result object.

    pose_landmarks[0] contains the 17 MoveNet
    landmarks.
    """

    def __init__(self, landmarks):
        self.pose_landmarks = [landmarks]


class PoseDetector:

    # ==================================================
    # MOVE NET KEYPOINT INDICES
    # ==================================================

    NOSE = 0

    LEFT_EYE = 1
    RIGHT_EYE = 2

    LEFT_EAR = 3
    RIGHT_EAR = 4

    LEFT_SHOULDER = 5
    RIGHT_SHOULDER = 6

    LEFT_ELBOW = 7
    RIGHT_ELBOW = 8

    LEFT_WRIST = 9
    RIGHT_WRIST = 10

    LEFT_HIP = 11
    RIGHT_HIP = 12

    LEFT_KNEE = 13
    RIGHT_KNEE = 14

    LEFT_ANKLE = 15
    RIGHT_ANKLE = 16

    # ==================================================
    # INITIALIZATION
    # ==================================================

    def __init__(self):

        model_path = (
            Path(__file__).resolve().parent
            / "models"
            / "movenet_singlepose_lightning_4.onnx"
        )

        if not model_path.exists():
            raise FileNotFoundError(
                f"MoveNet model not found: {model_path}"
            )

        # --------------------------------------------------
        # Create ONNX Runtime session
        # --------------------------------------------------

        self.session = ort.InferenceSession(
            str(model_path),
            providers=["CPUExecutionProvider"],
        )

        # --------------------------------------------------
        # Model input information
        # --------------------------------------------------

        self.input_name = (
            self.session
            .get_inputs()[0]
            .name
        )

        self.input_size = 192

    # ==================================================
    # PROCESS FRAME
    # ==================================================

    def process_frame(
        self,
        frame,
        timestamp_ms=None,
    ):

        if frame is None:
            raise ValueError(
                "Frame cannot be None."
            )

        # --------------------------------------------------
        # Original frame dimensions
        # --------------------------------------------------

        original_height, original_width = (
            frame.shape[:2]
        )

        # Avoid unused-variable warnings
        _ = original_height
        _ = original_width

        # --------------------------------------------------
        # OpenCV BGR -> RGB
        # --------------------------------------------------

        rgb_frame = cv2.cvtColor(
            frame,
            cv2.COLOR_BGR2RGB,
        )

        # --------------------------------------------------
        # Resize to MoveNet input
        #
        # MoveNet Lightning expects:
        # 192 x 192 x 3
        # --------------------------------------------------

        resized = cv2.resize(
            rgb_frame,
            (
                self.input_size,
                self.input_size,
            ),
        )

        # --------------------------------------------------
        # MoveNet expects integer RGB pixels
        # in the range 0-255.
        # --------------------------------------------------

        input_tensor = np.asarray(
            resized,
            dtype=np.int32,
        )[None, ...]

        # --------------------------------------------------
        # Run ONNX inference
        # --------------------------------------------------

        outputs = self.session.run(
            None,
            {
                self.input_name: input_tensor
            },
        )

        # --------------------------------------------------
        # MoveNet output:
        #
        # [1, 1, 17, 3]
        #
        # Each keypoint:
        #
        # [y, x, confidence]
        # --------------------------------------------------

        keypoints = np.asarray(
            outputs[0]
        )

        # Remove batch dimensions
        #
        # Result:
        #
        # [17, 3]

        keypoints = keypoints[0][0]

        # --------------------------------------------------
        # Convert MoveNet landmarks into
        # MediaPipe-like landmark objects.
        # --------------------------------------------------

        landmarks = []

        for keypoint in keypoints:

            y = float(
                keypoint[0]
            )

            x = float(
                keypoint[1]
            )

            confidence = float(
                keypoint[2]
            )

            # MoveNet gives normalized
            # coordinates from 0 to 1.

            landmark = PoseLandmark(
                x=x,
                y=y,
                visibility=confidence,
                z=0.0,
            )

            landmarks.append(
                landmark
            )

        # --------------------------------------------------
        # Return MediaPipe-like result
        # --------------------------------------------------

        return PoseResult(
            landmarks
        )

    # ==================================================
    # CLOSE
    # ==================================================

    def close(self):

        self.session = None