
from manim import *

class MyAnimation(Scene):
    def construct(self):
        # Create a simple representation of x^3
        x = ValueTracker(1)
        cube = Square(side_length=1)

        x_label = Text("x = 1", font_size=20)
        x_label.move_to(UP * 2)

        cube_label = Text("x^3 = 1", font_size=20)
        cube_label.move_to(DOWN * 2)

        def update_cube(cube):
            new_side = x.get_value()
            new_cube = Square(side_length=new_side)
            new_cube.move_to(cube.get_center())  # Keep the cube centered
            return new_cube

        def update_labels(mob):
            x_val = x.get_value()
            x_label_text = Text(f"x = {x_val:.2f}", font_size=20)
            x_label_text.move_to(UP * 2)

            cube_val = x_val**3
            cube_label_text = Text(f"x^3 = {cube_val:.2f}", font_size=20)
            cube_label_text.move_to(DOWN * 2)

            return VGroup(x_label_text, cube_label_text)

        self.add(cube, x_label, cube_label)

        animated_cube = always_redraw(lambda: update_cube(cube))
        animated_labels = always_redraw(update_labels)

        self.play(Create(animated_cube), Create(animated_labels[0]), Create(animated_labels[1]))

        self.play(x.animate.set_value(3), run_time=5)
        self.wait(1)

        self.play(x.animate.set_value(0.5), run_time=3)
        self.wait(1)

        self.play(x.animate.set_value(2), run_time=4)
        self.wait(1)
