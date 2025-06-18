from manim import *
import numpy as np

class MyAnimation(Scene):
    def construct(self):
        # 1. Starfield background
        self.camera.background_color = "#10101a"
        num_stars = 70
        stars = VGroup()
        np.random.seed(42)
        for _ in range(num_stars):
            x = np.random.uniform(-7, 7)
            y = np.random.uniform(-4, 4)
            s = Dot(point=[x, y, 0], radius=np.random.uniform(0.02, 0.05), color=WHITE, fill_opacity=np.random.uniform(0.5, 1))
            stars.add(s)
        self.add(stars)
        self.wait(0.5)
        # Twinkling animation
        for i in range(7):
            self.play(
                stars.animate.set_opacity(0.7 + 0.3*np.sin(i)),
                run_time=0.3, rate_func=there_and_back
            )

        # 2. Space-time grid
        grid = VGroup()
        # Horizontal lines
        for y in np.linspace(-3, 3, 13):
            l = Line(start=[-6.5, y, 0], end=[6.5, y, 0], color=BLUE_A, stroke_width=1)
            l.set_opacity(0.5)
            grid.add(l)
        # Vertical lines
        for x in np.linspace(-6, 6, 17):
            l = Line(start=[x, -3.2, 0], end=[x, 3.2, 0], color=BLUE_A, stroke_width=1)
            l.set_opacity(0.5)
            grid.add(l)

        grid_bg = Rectangle(width=13, height=6.6, fill_color=BLACK, fill_opacity=0.7, stroke_opacity=0)
        self.play(FadeIn(grid_bg, run_time=0.7))
        self.play(
            FadeIn(grid, lag_ratio=0.04, run_time=1.0)
        )
        self.wait(0.5)
        
        # 3. Add "Space-Time Fabric" label
        label_grid = Text("Space-Time Fabric", font_size=30, color=BLUE_B).move_to([0, 3.8, 0])
        self.play(FadeIn(label_grid), run_time=0.7)
        
        # 4. Neutron stars initialization
        r_star = 0.45
        neutron_star1 = Circle(radius=r_star, color=WHITE, fill_color=WHITE, fill_opacity=1, stroke_width=4, glow_factor=0.5)
        neutron_star2 = Circle(radius=r_star, color=WHITE, fill_color=WHITE, fill_opacity=1, stroke_width=4, glow_factor=0.5)
        neutron_star1.move_to([-4, 0.8, 0])
        neutron_star2.move_to([4, -0.8, 0])
        glow1 = Circle(radius=r_star+0.18, color=WHITE, stroke_opacity=0.0, fill_opacity=0.23).move_to(neutron_star1)
        glow2 = Circle(radius=r_star+0.18, color=WHITE, stroke_opacity=0.0, fill_opacity=0.23).move_to(neutron_star2)
        star_group = VGroup(glow1, neutron_star1, glow2, neutron_star2)
        self.play(FadeIn(star_group, run_time=0.8))
        # Add labels
        label_ns1 = Text("Neutron Star", font_size=24, color=WHITE, weight=BOLD).next_to(neutron_star1, DOWN)
        label_ns2 = Text("Neutron Star", font_size=24, color=WHITE, weight=BOLD).next_to(neutron_star2, UP)
        self.play(FadeIn(label_ns1), FadeIn(label_ns2), run_time=0.45)
        
        # 5. Spiral in animation
        spiral_center = [0, 0, 0]
        spiral_r1 = 4.0
        spiral_r2 = 4.0
        steps = 33
        spiral_path1 = [np.array([
            spiral_center[0] + spiral_r1 * np.cos(1.25*np.pi - 1.3 * t/steps * np.pi),
            spiral_center[1] + spiral_r1 * np.sin(1.25*np.pi - 1.3 * t/steps * np.pi),
            0])
            for t in range(steps)]
        spiral_path2 = [np.array([
            spiral_center[0] + spiral_r2 * np.cos(4.25*np.pi + 1.3 * t/steps * np.pi),
            spiral_center[1] + spiral_r2 * np.sin(4.25*np.pi + 1.3 * t/steps * np.pi),
            0])
            for t in range(steps)]
        
        # 6. Animate spiral in
        for t in range(steps):
            neutron_star1.move_to(spiral_path1[t])
            glow1.move_to(spiral_path1[t])
            neutron_star2.move_to(spiral_path2[t])
            glow2.move_to(spiral_path2[t])
            label_ns1.next_to(neutron_star1, DOWN)
            label_ns2.next_to(neutron_star2, UP)
            self.wait(0.018 + 0.015 * (t/steps))
        self.wait(0.15)
        
        # 7. Add "Gravitational Wave" label (visible only after spiraling starts)
        wave_label = Text("Gravitational Wave", font_size=28, color=YELLOW_A, weight=BOLD)
        wave_label.move_to([3.7, 2.6, 0])
        self.play(FadeIn(wave_label), run_time=0.7)
        
        # 8. Space-time ripple generation
        ripple_groups = []
        
        def make_ripple(radius, amp, phase, opacity=0.47):
            points = []
            for theta in np.linspace(0, TAU, 100):
                dx = 0.21 * amp * np.sin(5*theta + phase)
                dy = 0.21 * amp * np.sin(6*theta + phase + 1)
                points.append([
                    radius * np.cos(theta) + dx,
                    radius * np.sin(theta) + dy,
                    0
                ])
            ripple = VMobject(stroke_color=YELLOW, stroke_width=2, fill_opacity=0).set_points_as_corners(points + [points[0]])
            ripple.set_opacity(opacity)
            return ripple

        ripple_start = 0.4
        num_ripples = 4
        ripples = VGroup()
        for i in range(num_ripples):
            r = ripple_start + 0.9*i
            ripple = make_ripple(r, amp=1.0-(i*0.18), phase=-i)
            ripple.set_opacity(0.0)
            ripples.add(ripple)
        self.add(ripples)
        self.wait(0.35)
        
        # 9. Spiraling stars closer and ripples intensifying
        ripple_anim_steps = 16
        for t in range(ripple_anim_steps):
            angle = ((ripple_anim_steps-t)/ripple_anim_steps)*1.8 * np.pi
            radius = 2.1*(1 - t/ripple_anim_steps)
            neutron_star1.move_to([radius * np.cos(angle), radius * np.sin(angle), 0])
            neutron_star2.move_to([-radius * np.cos(angle), -radius * np.sin(angle), 0])
            glow1.move_to(neutron_star1.get_center())
            glow2.move_to(neutron_star2.get_center())
            label_ns1.next_to(neutron_star1, DOWN)
            label_ns2.next_to(neutron_star2, UP)
            # Animate ripple expansion and slight deformation
            for k, ripple in enumerate(ripples):
                phase = t*0.2 + k*0.7
                amp = 1.01 + 0.26 * np.sin(t + k)
                new_ripple = make_ripple(ripple_start + 0.65*t+ 0.8*k, amp=amp, phase=phase, opacity=0.28+0.12*k)
                ripple.become(new_ripple)
                ripple.set_opacity(min(1, (t-k+1)/4.0))
            self.wait(0.04 + 0.02*np.sin(t))
       
        # 10. COLLISION FLASH
        center = [0, 0, 0]
        neutron_star1.move_to(center)
        neutron_star2.move_to(center)
        glow1.move_to(center)
        glow2.move_to(center)
        label_ns1.next_to(center, DOWN)
        label_ns2.next_to(center, UP)
        flash = Circle(radius=1.0, color=WHITE, fill_opacity=1, fill_color=WHITE, stroke_opacity=0.5, stroke_width=0)
        flash.move_to(center)
        self.bring_to_front(flash)
        self.play(
            FadeIn(flash, run_time=0.18),
            star_group.animate.set_opacity(0.05), 
            FadeOut(label_ns1),
            FadeOut(label_ns2),
        )
        self.wait(0.11)
        self.play(FadeOut(flash, run_time=0.7))
        star_group.set_opacity(0)
        # Remove neutron star visuals after flash
        self.remove(star_group)
        
        # 11. Concentric big ripples after collision
        big_ripples = VGroup()
        n_big = 5
        for i in range(n_big):
            r = 1.95 + 1.25*i
            ripple = make_ripple(r, amp=1.27, phase=0.8*i, opacity=0.36)
            ripple.set_opacity(0)
            big_ripples.add(ripple)
        self.add(big_ripples)
        for t in range(16):
            for k, ripple in enumerate(big_ripples):
                phase = t*0.5 + k*1.0
                amp = 1.3 + 0.45 * np.sin(t + k*1.17)
                new_ripple = make_ripple(1.9 + 1.12*t + 1.1*k, amp=amp, phase=phase, opacity=0.2+0.1*k)
                ripple.become(new_ripple)
                ripple.set_opacity(min(1, (t-k+2)/4.0))
            self.wait(0.055)
        # Fade outer ripples out
        self.play(big_ripples.animate.set_opacity(0.05), run_time=0.67)
        
        # 12. Ambient soundtrack visualizer (bottom left)
        bar_count = 12
        viz_bars = VGroup()
        for i in range(bar_count):
            bar = Rectangle(width=0.12, height=0.21 + 0.07 * np.sin(i), color=BLUE_C, fill_color=BLUE_D, fill_opacity=1, stroke_opacity=0.5)
            bar.move_to([-5.6 + i*0.22, -3.4, 0], DOWN)
            viz_bars.add(bar)
        viz_bg = Rectangle(width=3.4, height=0.5, color=WHITE, fill_color=BLACK, fill_opacity=0.56, stroke_opacity=0.28)
        viz_bg.move_to([-4.1, -3.4, 0])
        self.play(FadeIn(viz_bg, run_time=0.4), FadeIn(viz_bars, run_time=0.6))
        
        # Animating the visualizer sync to ripple intensity
        for t in range(19):
            scale = (1 + 0.6*np.abs(np.sin(t/2))) if t<10 else (1 + 0.18*np.abs(np.sin(t)))
            for i, bar in enumerate(viz_bars):
                height = 0.18 + np.abs(np.sin(t*0.63 + i/2))*0.235*scale
                bar.set_height(height, about_edge=DOWN)
            self.wait(0.055 if t<15 else 0.10)

        # 13. Zoom out, show Earth and detector
        earth = Circle(radius=0.28, color=GREEN, fill_opacity=1, fill_color=GREEN_E).move_to([5.3, -2.6, 0])
        earth_label = Text("Earth", font_size=22, color=GREEN).next_to(earth, DOWN)
        detector = Square(side_length=0.15, color=YELLOW, fill_opacity=1, fill_color=YELLOW).move_to([5.3, -2.46, 0])
        detector_label = Text("Detector", font_size=18, color=YELLOW).next_to(detector, UP, buff=0.14)
        self.play(FadeIn(earth), FadeIn(earth_label), FadeIn(detector), FadeIn(detector_label), run_time=0.8)
        
        # Draw incoming final wave crest
        wave_points = []
        for x in np.linspace(4.1, 6.6, 36):
            y = -2.6 + 0.23 * np.sin(2.5*(x-4.1))
            wave_points.append([x, y, 0])
        wave_line = VMobject(stroke_color=YELLOW, stroke_width=3)
        wave_line.set_points_as_corners(wave_points)
        wave_line.set_opacity(0)
        self.add(wave_line)
        
        # Animate the final small crest passing Earth/Detector
        self.play(wave_line.animate.set_opacity(1.0), run_time=0.4)
        for shift_val in np.linspace(0, 0.7, 7):
            for n, x in enumerate(np.linspace(4.1, 6.6, 36)):
                y = -2.6 + 0.23 * np.sin(2.5*(x-4.1) - 3*shift_val)
                wave_points[n] = [x, y, 0]
            wave_line.set_points_as_corners(wave_points)
            self.wait(0.09)
        # Emphasize wave at detector
        d_flash = Circle(radius=0.14, color=YELLOW, fill_opacity=0.26, stroke_opacity=0.7).move_to(detector)
        self.play(FadeIn(d_flash, run_time=0.32))
        self.wait(0.19)
        self.play(FadeOut(d_flash, run_time=0.41))

        self.wait(0.7)
        # Fade out to black
        self.play(
            FadeOut(grid, run_time=0.9),
            FadeOut(label_grid, run_time=0.6),
            FadeOut(ripples, run_time=0.6),
            FadeOut(big_ripples, run_time=0.6),
            FadeOut(wave_label),
            FadeOut(viz_bg),
            FadeOut(viz_bars),
            FadeOut(earth), FadeOut(earth_label),
            FadeOut(detector), FadeOut(detector_label),
            FadeOut(wave_line),
            *[FadeOut(s) for s in stars],
        )