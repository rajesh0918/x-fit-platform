from .angle_calculator import calculate_angle


class SquatAnalyzer:
    def __init__(self):
        self.state = "standing"
        self.rep_count = 0

        self.current_rep_min_angle = 180
        self.rep_angles = []

        # Diagnostic information
        self.frame_count = 0
        self.debug_data = []

    def analyze(self, hip, knee, ankle):

        knee_angle = calculate_angle(
            hip,
            knee,
            ankle
        )

        self.frame_count += 1

        # Reject unrealistic values
        if knee_angle < 25 or knee_angle > 180:

            return {
                "valid": False,
                "knee_angle": round(knee_angle, 2),
                "state": self.state,
                "rep_count": self.rep_count,
            }

        previous_state = self.state

        # Track deepest point
        if knee_angle < self.current_rep_min_angle:
            self.current_rep_min_angle = knee_angle

        # ==================================================
        # STATE MACHINE
        # ==================================================

        if self.state == "standing":

            if knee_angle < 160:
                self.state = "descending"

        elif self.state == "descending":

            if knee_angle < 120:
                self.state = "bottom"

            elif knee_angle > 160:
                self.current_rep_min_angle = 180
                self.state = "standing"

        elif self.state == "bottom":

            if knee_angle > 130:
                self.state = "ascending"

        elif self.state == "ascending":

            if knee_angle > 145:

                self.rep_count += 1

                self.rep_angles.append(
                    self.current_rep_min_angle
                )

                self.current_rep_min_angle = 180

                self.state = "standing"

        # ==================================================
        # SAVE ONLY IMPORTANT STATE CHANGES
        # ==================================================

        if previous_state != self.state:

            self.debug_data.append({
                "frame": self.frame_count,
                "angle": round(knee_angle, 2),
                "from": previous_state,
                "to": self.state,
                "rep_count": self.rep_count,
            })

        return {
            "valid": True,
            "knee_angle": round(knee_angle, 2),
            "state": self.state,
            "rep_count": self.rep_count,
        }

    # ==================================================
    # DEBUG INFORMATION
    # ==================================================

    def get_debug_data(self):
        return self.debug_data

    # ==================================================
    # REP QUALITY
    # ==================================================

    def get_rep_quality(self):

        results = []

        for index, angle in enumerate(
            self.rep_angles,
            start=1
        ):

            if angle <= 90:
                quality = "good_depth"

            elif angle <= 105:
                quality = "acceptable_depth"

            else:
                quality = "shallow"

            results.append({
                "rep": index,
                "minimum_knee_angle": round(angle, 2),
                "quality": quality,
            })

        return results

    # ==================================================
    # FEEDBACK
    # ==================================================

    def get_feedback(self):

        feedback = []

        if not self.rep_angles:
            return feedback

        shallow_reps = sum(
            1
            for angle in self.rep_angles
            if angle > 105
        )

        good_reps = len(self.rep_angles) - shallow_reps

        if shallow_reps > 0:

            feedback.append({
                "type": "shallow_depth",
                "what": (
                    f"{shallow_reps} of {len(self.rep_angles)} "
                    "rep(s) were shallower than the target range."
                ),
                "why": (
                    "Those reps did not reach the knee-angle "
                    "range used by MotionCheck for squat depth."
                ),
                "how": (
                    "Descend under control and aim for a deeper "
                    "position while keeping your movement stable."
                ),
            })

        if good_reps > 0:

            feedback.append({
                "type": "good_depth",
                "what": (
                    f"{good_reps} of {len(self.rep_angles)} "
                    "rep(s) reached the target depth."
                ),
                "why": (
                    "Your knee angle entered the expected depth "
                    "range used by MotionCheck."
                ),
                "how": (
                    "Keep using the same controlled movement pattern."
                ),
            })

        return feedback

    # ==================================================
    # FORM SCORE
    # ==================================================

    def calculate_form_score(self):

        if not self.rep_angles:
            return 0

        total_reps = len(self.rep_angles)

        good_reps = sum(
            1
            for angle in self.rep_angles
            if angle <= 90
        )

        acceptable_reps = sum(
            1
            for angle in self.rep_angles
            if 90 < angle <= 105
        )

        shallow_reps = sum(
            1
            for angle in self.rep_angles
            if angle > 105
        )

        earned_points = (
            good_reps * 100
            + acceptable_reps * 80
            + shallow_reps * 50
        )

        score = earned_points / total_reps

        return round(score, 2)