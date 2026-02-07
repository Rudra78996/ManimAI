
from manim import *

class MyAnimation(Scene):
    def construct(self):
        ball = Circle(radius=0.5, color=BLUE, fill_opacity=1)
        ball.shift(LEFT * 4)
        
        self.add(ball)
        self.play(ball.animate.shift(RIGHT * 4 + DOWN * 2), run_time=1)
        self.play(ball.animate.shift(RIGHT * 4 + UP * 2), run_time=1)
        self.wait()
