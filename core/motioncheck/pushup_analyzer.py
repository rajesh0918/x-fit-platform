from .angle_calculator import calculate_angle


class PushUpAnalyzer:

    def __init__(self):

        self.state = "up"
        self.rep_count = 0

        self.current_rep_min_angle = 180
        self.rep_angles = []

        # Stores reps that reached depth
        # but did not fully lock out
        self.partial_lockout_reps = []

    # ==================================================
    # ANALYZE
    # ==================================================

    def analyze(
        self,
        shoulder,
        elbow,
        wrist
    ):

        elbow_angle = calculate_angle(
            shoulder,
            elbow,
            wrist
        )

        # Ignore unrealistic / noisy values
        if (
            elbow_angle < 20
            or elbow_angle > 180
        ):

            return {
                "valid": False,
                "elbow_angle": round(
                    elbow_angle,
                    2
                ),
                "state": self.state,
                "rep_count": self.rep_count,
            }

        # Track deepest angle
        # during current repetition
        if (
            elbow_angle
            < self.current_rep_min_angle
        ):

            self.current_rep_min_angle = (
                elbow_angle
            )

        # ==============================================
        # PUSH-UP STATE MACHINE
        # ==============================================

        if self.state == "up":

            # Start lowering
            if elbow_angle < 140:

                self.state = "descending"

        elif self.state == "descending":

            # Reached valid bottom
            if elbow_angle < 100:

                self.state = "bottom"

            # Returned to top
            # without enough depth
            elif elbow_angle > 160:

                self.current_rep_min_angle = 180
                self.state = "up"

        elif self.state == "bottom":

            # Start pressing upward
            if elbow_angle > 115:

                self.state = "ascending"

        elif self.state == "ascending":

            # Full completed repetition
            if elbow_angle > 140:

                self.rep_count += 1

                self.rep_angles.append(
                    self.current_rep_min_angle
                )

                self.current_rep_min_angle = 180

                self.state = "up"

        return {
            "valid": True,
            "elbow_angle": round(
                elbow_angle,
                2
            ),
            "state": self.state,
            "rep_count": self.rep_count,
        }

    # ==================================================
    # HANDLE VIDEO END
    # ==================================================

    def finalize_video(self):

        """
        If the video ends after the user
        reached the bottom and started coming
        back up, preserve that repetition as
        a partial-lockout rep.
        """

        if (
            self.state == "ascending"
            and self.current_rep_min_angle < 100
        ):

            self.rep_count += 1

            self.rep_angles.append(
                self.current_rep_min_angle
            )

            self.partial_lockout_reps.append(
                self.rep_count
            )

            self.current_rep_min_angle = 180

            self.state = "up"

    # ==================================================
    # REP QUALITY
    # ==================================================

    def get_rep_quality(self):

        results = []

        for index, angle in enumerate(
            self.rep_angles,
            start=1
        ):

            if (
                index
                in self.partial_lockout_reps
            ):

                quality = "partial_lockout"

            elif angle <= 90:

                quality = "good_depth"

            elif angle <= 105:

                quality = "acceptable_depth"

            else:

                quality = "shallow"

            results.append({

                "rep": index,

                "minimum_elbow_angle":
                    round(angle, 2),

                "quality":
                    quality,
            })

        return results

    # ==================================================
    # FORM SCORE
    # ==================================================

    def calculate_form_score(self):

        if not self.rep_angles:
            return 0

        total_points = 0

        for index, angle in enumerate(
            self.rep_angles,
            start=1
        ):

            # Reached depth but did not
            # fully return to top
            if (
                index
                in self.partial_lockout_reps
            ):

                total_points += 70

            elif angle <= 90:

                total_points += 100

            elif angle <= 105:

                total_points += 80

            else:

                total_points += 50

        score = (
            total_points
            /
            len(self.rep_angles)
        )

        return round(score, 2)

    # ==================================================
    # FEEDBACK
    # ==================================================

    def get_feedback(self):

        feedback = []

        if not self.rep_angles:
            return feedback

        shallow_reps = 0
        good_reps = 0

        for index, angle in enumerate(
            self.rep_angles,
            start=1
        ):

            if (
                index
                in self.partial_lockout_reps
            ):

                continue

            if angle > 105:

                shallow_reps += 1

            else:

                good_reps += 1

        # ----------------------------------------------
        # GOOD DEPTH
        # ----------------------------------------------

        if good_reps > 0:

            feedback.append({

                "type":
                    "good_depth",

                "what":
                    (
                        f"{good_reps} rep(s) "
                        "reached the target "
                        "push-up depth."
                    ),

                "why":
                    (
                        "Your elbow angle entered "
                        "the target range used "
                        "by MotionCheck."
                    ),

                "how":
                    (
                        "Continue lowering under "
                        "control and press back "
                        "toward the top position."
                    ),
            })

        # ----------------------------------------------
        # SHALLOW DEPTH
        # ----------------------------------------------

        if shallow_reps > 0:

            feedback.append({

                "type":
                    "shallow_depth",

                "what":
                    (
                        f"{shallow_reps} rep(s) were "
                        "shallower than the target "
                        "range."
                    ),

                "why":
                    (
                        "The elbow angle did not "
                        "reach the target "
                        "push-up depth."
                    ),

                "how":
                    (
                        "Lower further under control "
                        "while keeping your body "
                        "position stable."
                    ),
            })

        # ----------------------------------------------
        # PARTIAL LOCKOUT
        # ----------------------------------------------

        if self.partial_lockout_reps:

            feedback.append({

                "type":
                    "partial_lockout",

                "what":
                    (
                        f"{len(self.partial_lockout_reps)} "
                        "rep(s) reached depth but "
                        "did not return to the full "
                        "top-position threshold before "
                        "the video ended."
                    ),

                "why":
                    (
                        "MotionCheck detected the "
                        "upward phase, but the recording "
                        "ended before full extension "
                        "could be confirmed."
                    ),

                "how":
                    (
                        "Keep recording until you are "
                        "fully back at the top position "
                        "after your final rep."
                    ),
            })

        return feedback