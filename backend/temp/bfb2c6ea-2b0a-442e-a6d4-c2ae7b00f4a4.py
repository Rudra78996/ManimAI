from manim import *

class MyAnimation(Scene):
    def construct(self):
        # Create axes using lines
        x_axis = Line(LEFT * 4, RIGHT * 4, color=WHITE)
        y_axis = Line(DOWN * 3, UP * 3, color=WHITE)
        self.add(x_axis, y_axis)

        # Function graph: y = x^2 (approximated with small segments)
        points = [LEFT * 3 + UP * 0]
        for i in range(1, 7):
            x = -3 + i
            y = x**2 / 9
            points.append(Dot(RIGHT * x + UP * y, color=YELLOW, radius=0.05))
        curve = VGroup(*points)
        self.play(Create(curve))

        # Area under curve (Riemann sum approximation)
        rectangles = []
        for i in range(6):
            rect = Rectangle(
                width=1,
                height=(i**2) / 9,
                fill_color=BLUE,
                fill_opacity=0.5,
                stroke_color=WHITE
            )
            rect.move_to(LEFT * 2.5 + RIGHT * i + UP * ((i**2) / 18))
            rectangles.append(rect)

        # Animate rectangles appearing
        for rect in rectangles:
            self.play(Create(rect), run_time=0.3)

        # Show integral notation
        integral_text = Text("∫₋₃⁰ x² dx", font_size=36)
        integral_text.move_to(UP * 2.5)
        self.play(Write(integral_text))

        # Show result
        result_text = Text("= 9", font_size=36)
        result_text.next_to(integral_text, RIGHT)
        self.play(Write(result_text))

        self.wait(2)