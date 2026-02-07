
from manim import *

class MyAnimation(Scene):
    def construct(self):
        axes = VGroup(
            Line(start=LEFT*3, end=RIGHT*3),
            Line(start=DOWN*2, end=UP*2)
        )
        curve = Circle(radius=1.5).shift(RIGHT*1.5).scale([2, 1, 0]).set_color(BLUE)
        
        self.play(Create(axes))
        self.play(Create(curve))
        self.wait(0.5)
        
        rectangles = VGroup()
        for x in range(-3, 3):
            rect = Rectangle(
                height=abs(1.5 * math.sin(x)),
                width=0.5,
                fill_opacity=0.5
            ).shift(DOWN + RIGHT*x*0.5)
            rectangles.add(rect)
        
        self.play(LaggedStart(
            *[Create(rect) for rect in rectangles],
            lag_ratio=0.2
        ))
        
        label = Text("Integration = Area under curve").next_to(axes, UP)
        self.play(Write(label))
        self.wait(2)
