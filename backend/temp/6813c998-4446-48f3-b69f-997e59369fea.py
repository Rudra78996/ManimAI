from manim import *

class MyAnimation(Scene):
    def construct(self):
        # Parameters
        n_ripples = 7  # Number of ripple "rings" visible at any moment per point
        ripple_spacing = 0.7  # Distance between ripples
        max_radius = n_ripples * ripple_spacing
        duration = 4  # seconds for full cycle
        fade_frac = 0.75  # fraction of opacity fade at max radius

        # Point positions
        d = 2.0  # half-distance between centers
        center1 = LEFT * d
        center2 = RIGHT * d

        # For seamless looping, use phase shift and animate from 0 to duration
        def get_ripples(t):
            ripples = VGroup()
            for center in [center1, center2]:
                for k in range(n_ripples):
                    # Each ring starts at offset so that spacing is maintained
                    phase = (t + (k * duration / n_ripples)) % duration
                    radius = phase / duration * max_radius
                    if radius < 0.001 or radius > max_radius:
                        continue
                    alpha = (1 - radius/max_radius) * fade_frac
                    ring = Circle(radius=radius, color=BLUE, stroke_width=6, stroke_opacity=alpha)
                    ring.move_to(center)
                    ripples.add(ring)
            return ripples

        # Interference: create rings at same radius from both centers
        def get_interference(t):
            inter = VGroup()
            for k in range(1, n_ripples*2):
                # Avg radius of k-th intersection ring
                radius = (k * ripple_spacing/2)
                if radius > max_radius:
                    continue
                # Find points where both waves overlap: midpoint circles
                # Make constructive (even k) brighter, destructive (odd k) darker
                opacity = 0.33 if k % 2 else 0.7
                color = YELLOW if k % 2 == 0 else BLACK
                ring = Circle(radius=radius, color=color, stroke_width=12, stroke_opacity=opacity)
                ring.move_to(ORIGIN)
                inter.add(ring)
            return inter

        # Animation updater
        waves = VGroup()
        inter = VGroup()
        def update_waves(mob, dt):
            t = (self.time % duration)
            new_ripples = get_ripples(t)
            mob.become(new_ripples)
        waves.add_updater(update_waves)
        self.add(waves)

        def update_inter(mob, dt):
            t = (self.time % duration)
            new_inter = get_interference(t)
            mob.become(new_inter)
        inter.add_updater(update_inter)
        self.add(inter)

        # Show points at centers
        dot1 = Circle(radius=0.1, color=WHITE, fill_opacity=1).move_to(center1)
        dot2 = Circle(radius=0.1, color=WHITE, fill_opacity=1).move_to(center2)
        self.add(dot1, dot2)

        # Animate time for seamless loop
        self.time = 0
        def time_updater(dt):
            self.time += dt

        self.add_updater(lambda s, dt: time_updater(dt))
        self.wait(duration)
        self.remove_updater(lambda s, dt: time_updater(dt))