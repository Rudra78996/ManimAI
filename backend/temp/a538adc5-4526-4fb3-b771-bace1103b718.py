
from manim import *

class MyAnimation(Scene):
    def construct(self):
        # Create a circle
        circle = Circle(radius=1, color=BLUE)
        circle.move_to(LEFT * 3)

        # Create a square
        square = Square(side_length=2, color=RED)
        square.move_to(RIGHT * 3)

        # Animate the circle moving to the center
        self.play(circle.animate.shift(RIGHT * 3))

        # Animate the square moving to the center
        self.play(square.animate.shift(LEFT * 3))

        # Scale the circle
        self.play(circle.animate.scale(2))

        # Rotate the square
        self.play(square.animate.rotate(PI/2))

        # Wait for 2 seconds
        self.wait(2)
