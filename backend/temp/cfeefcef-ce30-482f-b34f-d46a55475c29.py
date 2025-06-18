from manim import *

class MyAnimation(Scene):
    def construct(self):
        # Black background
        self.camera.background_color = "#000000"
        
        # Axes
        axis_length = 6
        x_axis = Line(LEFT * axis_length/2, RIGHT * axis_length/2, color=GRAY_B)
        y_axis = Line(DOWN * axis_length/2, UP * axis_length/2, color=GRAY_B)
        self.add(x_axis, y_axis)

        # Sine wave generators: little circles at axis ends
        osc_radius = 0.25
        osc_x = Circle(radius=osc_radius, color=BLUE).move_to(RIGHT * axis_length/2)
        osc_y = Circle(radius=osc_radius, color=GREEN).move_to(UP * axis_length/2)
        self.add(osc_x, osc_y)

        # Labels
        x_label = Text("X Oscillation", font_size=24, color=WHITE)
        y_label = Text("Y Oscillation", font_size=24, color=WHITE)
        x_label.next_to(x_axis, DOWN, buff=0.3).shift(RIGHT * (axis_length/2 - 1))
        y_label.next_to(y_axis, LEFT, buff=0.3).shift(UP * (axis_length/2 - 1))
        self.add(x_label, y_label)

        # Lissajous curve settings
        A = 2.0  # x amplitude
        B = 2.0  # y amplitude
        a = 3    # x frequency (Hz)
        b = 2    # y frequency (Hz)
        delta = PI / 2  # phase difference

        total_time = 6      # seconds
        self.wait(0.2)
        # Dot and trace initialization
        dot = Dot(radius=0.08, color=WHITE, glow_factor=0.9)
        trace = VMobject()
        trace.set_stroke(width=6)
        points = []

        def get_point(t):
            # Theta mapped so animation loops
            theta = TAU * t / total_time
            x = A * np.sin(a * theta + delta)
            y = B * np.sin(b * theta)
            return np.array([x, y, 0])

        # Glowing trail gradient colors (soft purple-cyan loop)
        gradient_colors = [BLUE_B, PURPLE, MAROON_C, ORANGE, TEAL, BLUE_B]

        # Animate!
        def update_anim(mob, alpha):
            t = alpha * total_time
            point = get_point(t)
            dot.move_to(point)
            points.append(point)
            # Only keep the whole history to trail
            if len(points) > 2:
                trace.set_points_smoothly(points)
                # Optional: Soft color gradient
                color_idx = int((len(points)/300)*len(gradient_colors))
                trace.set_color(gradient_colors[color_idx%len(gradient_colors)])

        self.add(dot, trace)
        self.bring_to_front(dot)
        self.play(
            UpdateFromAlphaFunc(dot, update_anim),
            UpdateFromAlphaFunc(trace, update_anim),
            run_time=total_time,
            rate_func=linear
        )

        self.wait(1)