from collections import deque

from .angle_calculator import calculate_angle


class BicepCurlAnalyzer:
    def __init__(self):
        self.state = "waiting"

        self.rep_count = 0
        self.rep_data = []

        # Smooth last few angles
        self.angle_buffer = deque(maxlen=5)

        # State confirmation
        self.confirm_count = 0
        self.required_confirm_frames = 2

        # Rep timing
        self.current_rep_frames = 0
        self.minimum_rep_frames = 12

        self.current_rep_min_angle = 180
        self.current_rep_max_angle = 0

    # ==================================================
    # MAIN ANALYSIS
    # ==================================================

    def analyze(
        self,
        shoulder,
        elbow,
        wrist
    ):
        raw_angle = calculate_angle(
            shoulder,
            elbow,
            wrist
        )

        # Reject clearly unreliable geometry
        if raw_angle < 30 or raw_angle > 180:
            return {
                "valid": False,
                "elbow_angle": round(raw_angle, 2),
                "state": self.state,
                "rep_count": self.rep_count,
            }

        # ------------------------------------------
        # Smooth angle
        # ------------------------------------------

        self.angle_buffer.append(raw_angle)

        elbow_angle = (
            sum(self.angle_buffer)
            / len(self.angle_buffer)
        )

        # ==========================================
        # WAITING FOR START POSITION
        # ==========================================

        if self.state == "waiting":

            # Require stable extended arm first
            if elbow_angle >= 145:
                self.confirm_count += 1

                if (
                    self.confirm_count
                    >= self.required_confirm_frames
                ):
                    self.state = "extended"
                    self.confirm_count = 0

            else:
                self.confirm_count = 0

            return {
                "valid": True,
                "elbow_angle": round(elbow_angle, 2),
                "state": self.state,
                "rep_count": self.rep_count,
            }

        # ==========================================
        # EXTENDED
        # ==========================================

        if self.state == "extended":

            # Stronger hysteresis:
            # don't start a curl until angle is clearly decreasing
            if elbow_angle < 130:
                self.confirm_count += 1

                if (
                    self.confirm_count
                    >= self.required_confirm_frames
                ):
                    self.state = "curling"

                    self.current_rep_frames = 0

                    self.current_rep_min_angle = (
                        elbow_angle
                    )

                    self.current_rep_max_angle = (
                        elbow_angle
                    )

                    self.confirm_count = 0

            else:
                self.confirm_count = 0

        # ==========================================
        # CURLING
        # ==========================================

        elif self.state == "curling":

            self.current_rep_frames += 1

            self._track_rom(elbow_angle)

            # Need real contraction for several frames
            if elbow_angle <= 70:
                self.confirm_count += 1

                if (
                    self.confirm_count
                    >= self.required_confirm_frames
                ):
                    self.state = "contracted"
                    self.confirm_count = 0

            else:
                self.confirm_count = 0

            # Cancel false start
            if (
                elbow_angle >= 155
                and self.current_rep_frames < 8
            ):
                self._reset_current_rep()
                self.state = "extended"
                self.confirm_count = 0

        # ==========================================
        # CONTRACTED
        # ==========================================

        elif self.state == "contracted":

            self.current_rep_frames += 1

            self._track_rom(elbow_angle)

            # Do not immediately leave contracted state
            # because of one noisy frame.
            if elbow_angle > 90:
                self.confirm_count += 1

                if (
                    self.confirm_count
                    >= self.required_confirm_frames
                ):
                    self.state = "lowering"
                    self.confirm_count = 0

            else:
                self.confirm_count = 0

        # ==========================================
        # LOWERING
        # ==========================================

        elif self.state == "lowering":

            self.current_rep_frames += 1

            self._track_rom(elbow_angle)

            # Rep only completes after stable extension
            if elbow_angle >= 145:
                self.confirm_count += 1

                if (
                    self.confirm_count
                    >= self.required_confirm_frames
                ):
                    if (
                        self.current_rep_frames
                        >= self.minimum_rep_frames
                    ):
                        self._save_rep()

                    self._reset_current_rep()

                    self.state = "extended"
                    self.confirm_count = 0

            else:
                self.confirm_count = 0

        return {
            "valid": True,
            "elbow_angle": round(elbow_angle, 2),
            "state": self.state,
            "rep_count": self.rep_count,
        }

    # ==================================================
    # ROM TRACKING
    # ==================================================

    def _track_rom(self, angle):

        if angle < self.current_rep_min_angle:
            self.current_rep_min_angle = angle

        if angle > self.current_rep_max_angle:
            self.current_rep_max_angle = angle

    # ==================================================
    # SAVE REP
    # ==================================================

    def _save_rep(self):

        self.rep_count += 1

        self.rep_data.append({
            "rep": self.rep_count,

            "minimum_elbow_angle": round(
                self.current_rep_min_angle,
                2
            ),

            "maximum_elbow_angle": round(
                self.current_rep_max_angle,
                2
            ),
        })

    # ==================================================
    # RESET
    # ==================================================

    def _reset_current_rep(self):

        self.current_rep_min_angle = 180
        self.current_rep_max_angle = 0

        self.current_rep_frames = 0

    # ==================================================
    # REP QUALITY
    # ==================================================

    def get_rep_quality(self):

        results = []

        for rep in self.rep_data:

            minimum_angle = (
                rep["minimum_elbow_angle"]
            )

            maximum_angle = (
                rep["maximum_elbow_angle"]
            )

            contraction_good = (
                minimum_angle <= 70
            )

            extension_good = (
                maximum_angle >= 145
            )

            if (
                contraction_good
                and extension_good
            ):
                quality = "full_rom"

            elif (
                contraction_good
                or extension_good
            ):
                quality = "partial_rom"

            else:
                quality = "limited_rom"

            results.append({
                "rep": rep["rep"],

                "minimum_elbow_angle":
                    minimum_angle,

                "maximum_elbow_angle":
                    maximum_angle,

                "quality":
                    quality,
            })

        return results

    # ==================================================
    # FORM SCORE
    # ==================================================

    def calculate_form_score(self):

        if not self.rep_data:
            return 0

        points = 0

        for rep in self.rep_data:

            minimum_angle = (
                rep["minimum_elbow_angle"]
            )

            maximum_angle = (
                rep["maximum_elbow_angle"]
            )

            contraction_good = (
                minimum_angle <= 70
            )

            extension_good = (
                maximum_angle >= 145
            )

            if (
                contraction_good
                and extension_good
            ):
                points += 100

            elif (
                contraction_good
                or extension_good
            ):
                points += 75

            else:
                points += 50

        return round(
            points / len(self.rep_data),
            2
        )

    # ==================================================
    # FEEDBACK
    # ==================================================

    def get_feedback(self):

        feedback = []

        if not self.rep_data:
            return feedback

        full_rom = 0
        incomplete_contraction = 0
        incomplete_extension = 0

        for rep in self.rep_data:

            minimum_angle = (
                rep["minimum_elbow_angle"]
            )

            maximum_angle = (
                rep["maximum_elbow_angle"]
            )

            contraction_good = (
                minimum_angle <= 70
            )

            extension_good = (
                maximum_angle >= 145
            )

            if (
                contraction_good
                and extension_good
            ):
                full_rom += 1

            if not contraction_good:
                incomplete_contraction += 1

            if not extension_good:
                incomplete_extension += 1

        if full_rom:

            feedback.append({
                "type": "good_rom",

                "what": (
                    f"{full_rom} rep(s) completed "
                    "the target curl range of motion."
                ),

                "why": (
                    "The elbow moved through the "
                    "target contracted and extended "
                    "ranges used by MotionCheck."
                ),

                "how": (
                    "Continue using a controlled "
                    "curl through the same range."
                ),
            })

        if incomplete_contraction:

            feedback.append({
                "type": "incomplete_contraction",

                "what": (
                    f"{incomplete_contraction} rep(s) "
                    "did not reach the target "
                    "contracted position."
                ),

                "why": (
                    "The elbow angle did not enter "
                    "the target contraction range."
                ),

                "how": (
                    "Curl further upward while keeping "
                    "the upper arm stable."
                ),
            })

        if incomplete_extension:

            feedback.append({
                "type": "incomplete_extension",

                "what": (
                    f"{incomplete_extension} rep(s) "
                    "did not return to the target "
                    "extended position."
                ),

                "why": (
                    "The elbow did not return close "
                    "enough to the starting angle."
                ),

                "how": (
                    "Lower under control until the "
                    "arm returns closer to extension."
                ),
            })

        return feedback