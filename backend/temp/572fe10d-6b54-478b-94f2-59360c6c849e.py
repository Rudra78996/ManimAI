from manim import *
import numpy as np

class MyAnimation(Scene):
    def construct(self):
        # Background
        background = Rectangle(width=14, height=8)
        background.set_fill(BLACK, opacity=1)
        self.add(background)

        # Starfield
        np.random.seed(42)
        stars = VGroup()
        for _ in range(110):
            pos = np.array([
                np.random.uniform(-6.8, 6.8),
                np.random.uniform(-3.8, 3.8),
                0
            ])
            star = Dot(point=pos, radius=0.05, color=WHITE)
            if np.random.rand() < 0.55:
                star.scale(0.7)
            stars.add(star)
        self.add(stars)

        # Twinkle animation
        def update_twinkle(mob, dt):
            for star in mob:
                factor = 0.85 + 0.3*np.abs(np.sin(self.time * 0.6 + hash(star)%100))
                star.set_opacity(factor)
        stars.add_updater(update_twinkle)

        # Space-Time Grid
        grid_lines = VGroup()
        for y in np.linspace(-3.5, 3.5, 15):
            grid_lines.add(Line(
                start=[-6.5, y, 0], end=[6.5, y, 0], color=BLUE_D, opacity=0.37
            ))
        for x in np.linspace(-6, 6, 19):
            grid_lines.add(Line(
                start=[x, -3.3, 0], end=[x, 3.3, 0], color=BLUE_D, opacity=0.37
            ))
        grid_lines.set_stroke(width=1.4)
        grid_lines.set_opacity(0)
        self.play(FadeIn(grid_lines, run_time=2))
        grid_lines.set_opacity(1)

        self.wait(0.5)

        # Space-Time Fabric label
        fabric_label = Text("Space-Time Fabric", font_size=32, color=BLUE_B)
        fabric_label.next_to(grid_lines, UP).shift(UP * 0.45)
        fabric_label.set_opacity(0.7)
        self.play(FadeIn(fabric_label), run_time=1.2)

        # Neutron Stars
        ns1 = Circle(radius=0.48, color=WHITE, fill_opacity=1, stroke_width=4)
        ns1.set_gloss(0.92)
        ns1.move_to(LEFT*4.3)
        ns1_glow = ns1.copy().set_stroke(width=14, color=WHITE, opacity=0.25)
        ns2 = ns1.copy().move_to(RIGHT*4.3)
        ns2_glow = ns2.copy().set_stroke(width=14, opacity=0.25)

        ns_g1 = VGroup(ns1, ns1_glow)
        ns_g2 = VGroup(ns2, ns2_glow)

        self.play(
            LaggedStart(FadeIn(ns_g1), FadeIn(ns_g2), lag_ratio=0.18),
            run_time=1.1
        )

        # Neutron Star labels
        ns1_label = Text("Neutron Star", font_size=22, color=WHITE)
        ns1_label.next_to(ns1, DOWN, buff=0.37)
        ns2_label = ns1_label.copy().next_to(ns2, DOWN, buff=0.37)
        self.play(FadeIn(ns1_label), FadeIn(ns2_label), run_time=0.8)

        # Spiral toward each other
        spiral_time = 3.0
        def spiral(mob1, mob2, dt):
            # Move toward center and rotate around center
            t = min(self.time/spiral_time, 1)
            r = interpolate(4.3, 0.1, t)
            angle = t*TAU*2.5
            pos1 = [r*np.cos(angle), r*np.sin(angle), 0]
            pos2 = [r*np.cos(angle+PI), r*np.sin(angle+PI), 0]
            mob1.move_to(pos1)
            mob2.move_to(pos2)
        ns_g1.add_updater(lambda m, dt: spiral(ns_g1, ns_g2, dt))
        ns_g2.add_updater(lambda m, dt: None)

        # Update neutron star labels
        def follow_label(label, mob):
            label.move_to(mob.get_center() + np.array([0, -0.85, 0]))
        ns1_label.add_updater(lambda m: follow_label(m, ns_g1[0]))
        ns2_label.add_updater(lambda m: follow_label(m, ns_g2[0]))

        self.wait(spiral_time)
        ns_g1.remove_updater(lambda m, dt: spiral(ns_g1, ns_g2, dt))
        ns1_label.clear_updaters()
        ns2_label.clear_updaters()
        self.remove(ns1_label, ns2_label)

        # Collision flash
        flash = Circle(radius=1.1, stroke_width=0, fill_opacity=1, fill_color=WHITE)
        flash.move_to(ORIGIN).set_opacity(0)
        self.add(flash)
        self.play(
            ns_g1[0].animate.scale(1.55).set_opacity(0.0), 
            ns_g2[0].animate.scale(1.55).set_opacity(0.0),
            ns_g1[1].animate.set_opacity(0), 
            ns_g2[1].animate.set_opacity(0),
            FadeOut(ns1_label, ns2_label),
            flash.animate.set_opacity(0.85).scale(1.3),
            run_time=0.38
        )
        self.play(flash.animate.set_opacity(0).scale(0.4), run_time=0.50)
        self.remove(flash, ns_g1, ns_g2)

        # Gravitational Wave Label
        gw_label = Text("Gravitational Wave", font_size=32, color=YELLOW)
        gw_label.to_corner(UR).shift(DOWN*0.25 + LEFT*0.3)
        self.play(FadeIn(gw_label), run_time=0.8)
        
        # Space-time ripple effect via grid warp + manual rings
        rings = VGroup()
        n_rings = 8
        for i in range(n_rings):
            alpha = 0.18*i + 0.25
            ring = Circle(radius=1.15 + 0.44*i, color=YELLOW_E, stroke_width=3)
            ring.set_opacity(max(0.05, 0.14 - 0.015*i))
            ring.move_to(ORIGIN)
            rings.add(ring)
        rings.set_z_index(2)
        self.add(rings)

        def animate_rings(rings, dt):
            for i, ring in enumerate(rings):
                expand = (self.time-i*0.27)*1.43
                if expand > 0:
                    ring.set_stroke(width=2.5-0.18*i)
                    ring.set_opacity(0.18-0.018*i - 0.12*expand/rings[-1].radius)
                    ring.scale(1 + 0.57*dt)
        rings.add_updater(animate_rings)

        # Animate grid warping (ripple)
        def ripple_grid(mob, alpha):
            for i, line in enumerate(mob):
                if line.get_start()[1] == line.get_end()[1]:  # horizontal
                    y = line.get_start()[1]
                    new_start = [-6.5, y + 0.22*np.sin(self.time*2+0.85*y), 0]
                    new_end = [6.5, y + 0.22*np.sin(self.time*2+0.85*y), 0]
                    line.put_start_and_end_on(new_start, new_end)
                else:  # vertical
                    x = line.get_start()[0]
                    new_start = [x + 0.20*np.sin(self.time*2+0.95*x), -3.3, 0]
                    new_end = [x + 0.20*np.sin(self.time*2+0.95*x), 3.3, 0]
                    line.put_start_and_end_on(new_start, new_end)
        grid_lines.add_updater(ripple_grid)

        self.wait(2.8)

        # Remove neutron star group if not already
        if ns_g1 in self.mobjects:
            self.remove(ns_g1, ns_g2)

        # Calm down ripple, fade out space grid
        grid_lines.clear_updaters()
        rings.clear_updaters()
        self.play(
            grid_lines.animate.set_opacity(0.15),
            rings.animate.set_opacity(0.07),
            gw_label.animate.set_opacity(0.5),
            run_time=1.45
        )

        # Zoom out, show Earth with wave crest
        earth = Circle(radius=0.38, color=GREEN_B, fill_opacity=1, stroke_width=3)
        earth.move_to(DOWN*2.25+RIGHT*4.7)
        earth_label = Text("Earth", font_size=23, color=GREEN_C).next_to(earth, DOWN, buff=0.22)
        detector = Rectangle(height=0.08, width=0.74, color=WHITE, fill_opacity=0.79).move_to(earth.get_center() + UP*0.48)
        detector_label = Text("Detector", font_size=19, color=WHITE).next_to(detector, UP, buff=0.18)
        wave = Arc(start_angle=PI, angle=-PI, radius=0.6, color=YELLOW)
        wave.move_to(earth.get_center()+LEFT*0.3+UP*0.09)

        self.play(
            FadeIn(earth),
            FadeIn(earth_label),
            FadeIn(detector),
            FadeIn(detector_label), 
            FadeIn(wave),
            run_time=1.1
        )

        self.wait(0.2)

        self.play(wave.animate.shift(RIGHT*0.38), run_time=1.0)
        self.play(FadeOut(wave), detector.animate.set_opacity(0.33), run_time=0.35)

        # Fade out grid, rings, labels
        self.play(
            FadeOut(grid_lines), 
            FadeOut(rings),
            FadeOut(fabric_label), 
            FadeOut(gw_label),
            run_time=1.7)

        # Calm ambient soundtrack visualizer (bars)
        bars = VGroup()
        base_pos = DOWN*3.4 + LEFT*5.4
        for i in range(7):
            h = np.sin(i+1)+1.5
            bar = Rectangle(width=0.19, height=0.27*h, color=MAROON_B, fill_opacity=0.65, stroke_opacity=0.55)
            bar.move_to(base_pos+RIGHT*0.23*i)
            bars.add(bar)
        label_viz = Text("Sound", font_size=15, color=MAROON_C).next_to(bars, UP, buff=0.03)
        self.play(FadeIn(bars), FadeIn(label_viz), run_time=0.7)

        # Animate bars pulsating
        def update_bars(bars, dt):
            for i, bar in enumerate(bars):
                bar.height = 0.2 + 0.45 * np.abs(np.sin(self.time*1.1 + i*0.8))
                # Centering
                bar.move_to(base_pos+RIGHT*0.23*i)
        bars.add_updater(update_bars)

        self.wait(1.2)
        self.play(FadeOut(earth), FadeOut(earth_label), FadeOut(bars), FadeOut(label_viz), FadeOut(detector), FadeOut(detector_label))
        self.wait(0.4)