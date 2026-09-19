import math


def calculate_angle(a, b, c):
    """
    Calculate angle ABC.

    a, b, c are (x, y) points.
    b is the joint point.
    """

    ax, ay = a
    bx, by = b
    cx, cy = c

    radians = math.atan2(
        cy - by,
        cx - bx
    ) - math.atan2(
        ay - by,
        ax - bx
    )

    angle = abs(math.degrees(radians))

    if angle > 180:
        angle = 360 - angle

    return angle