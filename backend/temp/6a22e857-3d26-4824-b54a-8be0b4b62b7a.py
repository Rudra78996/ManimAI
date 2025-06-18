from manim import *
import random
import math

class MyAnimation(Scene):
    def twinkle_stars(self, stars, n_frames=40):
        anims = []
        for i, s in enumerate(stars):
            op = s.get_fill_opacity()
            new_op = random.uniform(0.2, 1.0)
            anims.append(s.animate.set_fill(opacity=new_op).set_stroke(opacity=new_op))
        return AnimationGroup(*anims, lag_ratio=0.01, run_time=0.5)

    def create_starfield(self, n_stars=65):
        stars = VGroup()
        for _ in range(n_stars):
            pos = [
                random.uniform(-7, 7),
                random.uniform(-4, 4),
                0,
            ]
            radius = random.uniform(0.02, 0.06)
            c = Circle(radius=radius, color=WHITE, fill_opacity=random.uniform(0.2, 1))
            c.set_stroke(color=WHITE, opacity=c.get_fill_opacity())
            c.move_to(pos)
            stars.add(c)
        return stars

    def create_grid(self, nx=16, ny=9, color=BLUE_B, width=14, height=8):
        lines = VGroup()
        for i in range(nx + 1):
            x = -width / 2 + width * i / nx
            l = Line(
                start=[x, -height / 2, 0], end=[x, height / 2, 0],
                color=color, stroke_opacity=0.45 if i % 2 == 0 else 0.25
            ).set_stroke(width=1)
            lines.add(l)
        for i in range(ny + 1):
            y = -height / 2 + height * i / ny
            l = Line(
                start=[-width / 2, y, 0], end=[width / 2, y, 0],
                color=color, stroke_opacity=0.45 if i % 2 == 0 else 0.25
            ).set_stroke(width=1)
            lines.add(l)
        return lines

    def grid_wave_distortion(self, grid, t, collision_center, amplitude=0.6, speed=3.1, wavelength=1.6):
        # Ripples radiating from collision_center (should be ORIGIN)
        for line in grid:
            new_points = []
            for p in line.get_start_and_end():
                distances = []
                num_points = 28
                for a in range(num_points + 1):
                    point = line.point_from_proportion(a / num_points)
                    dist = np.linalg.norm(point[:2] - collision_center[:2])
                    phase = 2 * PI * (dist / wavelength - speed * t)
                    offset = amplitude * math.exp(-0.1 * dist) * math.sin(phase)
                    vec = point - collision_center
                    if np.linalg.norm(vec[:2]) == 0:
                        direction = np.array([0,0,0])
                    else:
                        direction = np.array([vec[0], vec[1], 0]) / np.linalg.norm(vec[:2])
                    ripple = point + offset * direction
                    new_points.append(ripple)
                # set new points to line
                line.set_points_smoothly(new_points)
        return grid

    def animate_neutron_star_orbit(self, mob1, mob2, total_time, center, initial_r, spiral_in=2.7):
        def spiral_updater(mob, idx):
            def update(m, alpha):
                t = total_time * alpha
                theta = (t * 2*PI / spiral_in) + idx * PI
                # Spiral in towards center
                r = initial_r * (1 - 0.58 * (t / total_time)**1.3)
                pos = np.array([
                    center[0] + r*math.cos(theta),
                    center[1] + r*math.sin(theta),
                    0
                ])
                m.move_to(pos)
            return update
        return spiral_updater(mob1,0), spiral_updater(mob2,1)

    def create_wave_rings(self, n, max_r, center=ORIGIN, color=BLUE_B):
        rings = VGroup()
        for i in range(n):
            r = max_r * i / n
            circ = Circle(radius=r, color=color, stroke_width=2, fill_opacity=0)
            circ.move_to(center)
            rings.add(circ)
        return rings

    def show_sound_visualizer(self, group, ripple_strength=1.0):
        # Simulate bars moving up and down, higher is more intense
        anims = []
        for i, bar in enumerate(group):
            h = 0.12 + ripple_strength*0.5*random.uniform(0.2, 1.0) * ((i+2) % 4) / 4
            anims.append(bar.animate.stretch_to_fit_height(h))
        return AnimationGroup(*anims, lag_ratio=0.13, run_time=0.3)

    def construct(self):
        # 1. Dark background
        background = Rectangle(width=14.3, height=8.2, fill_color=BLACK, fill_opacity=1, stroke_opacity=0)
        self.add(background)

        # 2. Starfield
        stars = self.create_starfield(65)
        self.add(stars)
        for _ in range(8):
            self.play(self.twinkle_stars(stars), run_time=0.4)
        
        # 3. Space-Time Grid
        grid = self.create_grid()
        grid.set_z_index(1)
        self.play(FadeIn(grid, shift=UP, lag_ratio=0.05), run_time=1.2)
        fabric_label = Text("Space-Time Fabric", color=BLUE_A, font_size=28).to_corner(UL).shift(DOWN*0.3+RIGHT*0.3)
        self.play(FadeIn(fabric_label), run_time=0.6)

        # 4. Neutron Stars
        star1 = Circle(radius=0.53, fill_color=WHITE, fill_opacity=1, stroke_color=BLUE_E, stroke_width=6)
        star2 = Circle(radius=0.53, fill_color=WHITE, fill_opacity=1, stroke_color=BLUE_E, stroke_width=6)
        star1.glow = OuterGlow(star1, color=WHITE, stroke_width=20, opacity=0.45)
        star2.glow = OuterGlow(star2, color=WHITE, stroke_width=20, opacity=0.45)
        group1 = VGroup(star1, star1.glow).move_to([-4.7, 0, 0])
        group2 = VGroup(star2, star2.glow).move_to([4.7, 0, 0])
        self.play(FadeIn(group1), FadeIn(group2), run_time=0.6)
        ns_label1 = Text("Neutron Star", font_size=21, color=WHITE).next_to(group1, DOWN, buff=0.25)
        ns_label2 = Text("Neutron Star", font_size=21, color=WHITE).next_to(group2, DOWN, buff=0.25)
        self.play(Write(ns_label1), Write(ns_label2), run_time=0.5)

        # 5. Neutron Stars Spiral In
        total_orbit_time = 3.1
        initial_r = 4.7
        spiral1, spiral2 = self.animate_neutron_star_orbit(group1, group2, total_time=total_orbit_time, center=ORIGIN, initial_r=initial_r)
        self.add(group1, group2)
        
        # Show label for "Gravitational Wave"
        gw_label = Text("Gravitational Wave", font_size=27, color=BLUE_B).to_corner(DR).shift(UP*0.7+LEFT*0.5)
        self.wait(0.2)
        self.play(FadeIn(gw_label), run_time=0.8)

        # 6. Grid Ripples start weak, become intense as stars approach
        n_frames = 28
        for i in range(n_frames):
            alpha = i / n_frames
            spiral1(group1, alpha)
            spiral2(group2, alpha)
            # Tweak: ripple strength grows as alpha increases
            ripple_amp = 0.09 + 0.41*alpha**1.3
            self.grid_wave_distortion(grid, t=alpha, collision_center=ORIGIN, amplitude=ripple_amp, speed=3 + 3*alpha, wavelength=1.91-0.4*alpha)
            self.wait(0.03)

        # 7. Collision "Flash", ripple increases
        flash = Circle(radius=0.8, color=WHITE, fill_opacity=1, stroke_opacity=0).move_to(ORIGIN)
        self.play(FadeOut(group1), FadeOut(group2), FadeOut(ns_label1), FadeOut(ns_label2), FadeIn(flash), run_time=0.23)
        self.wait(0.15)
        self.play(FadeOut(flash, scale=2), run_time=0.48)

        # 8. Ripple Propagation and Visible Concentric Waves
        wave_circles = self.create_wave_rings(12, max_r=6.8)
        wave_circles.set_z_index(2)
        for i, circ in enumerate(wave_circles):
            circ.set_stroke(width=2, opacity=0.24+0.055*i)
        self.play(LaggedStart(*[Create(c) for c in wave_circles], lag_ratio=0.13), run_time=1.3)

        # "Gravitational Wave" label pulse
        self.play(gw_label.animate.scale(1.15).set_color(BLUE_A), run_time=0.38)
        self.play(gw_label.animate.scale(0.88).set_color(BLUE_B), run_time=0.37)

        for s in range(18):
            alpha = s / 18
            self.grid_wave_distortion(grid, t=1+alpha*2, collision_center=ORIGIN, amplitude=0.49+0.12*alpha, speed=4.1, wavelength=1.17)
            for i, circ in enumerate(wave_circles):
                curr_r = 0.21 + 7.2*((alpha*0.4) + (i/len(wave_circles))*0.8)
                circ.set(width=curr_r*2, height=curr_r*2)
                circ.set_opacity(0.26+0.06*i - alpha*0.19)
            self.wait(0.04)
        
        # Fade out grid and rings
        self.play(FadeOut(grid, shift=UP*0.15, lag_ratio=0.15), FadeOut(wave_circles, lag_ratio=0.15), run_time=1)

        # 9. Soundtrack Visualizer (bars at corner) - sync to intensity
        n_bars = 8
        bars = VGroup()
        for i in range(n_bars):
            bar = Rectangle(width=0.13, height=0.18, fill_color=BLUE_B, fill_opacity=0.9, stroke_opacity=0)
            bar.move_to(RIGHT*6 + DOWN*3.3 + DOWN*bar.height/2 + RIGHT*i*0.18)
            bars.add(bar)
        self.play(FadeIn(bars), run_time=0.5)
        intensity = [0.14,0.32,0.53,0.95,0.88,0.50,0.28,0.12,0.09,0.05,0.02]
        for n in range(len(intensity)):
            self.play(self.show_sound_visualizer(bars, ripple_strength=intensity[n]), run_time=0.22)
        self.wait(0.42)

        # 10. Zoom out and show Earth/detector receiving ripple
        earth = Circle(radius=0.39, color=WHITE, fill_opacity=0.5, stroke_width=2, z_index=2).move_to([5.4, -2.5, 0])
        detector = Rectangle(width=0.33, height=0.14, color=YELLOW, fill_opacity=1, stroke_opacity=0).move_to(earth.get_center()+RIGHT*0.7)
        detector_label = Text("Detector", font_size=21, color=YELLOW_B).next_to(detector, RIGHT, buff=0.12)
        self.play(FadeIn(earth), FadeIn(detector), FadeIn(detector_label), run_time=0.8)
        # Animate a gentle wave crest passing earth
        for j in range(16):
            t = j / 8
            # half-sine/crest
            wave = FunctionGraph(
                lambda x: 0.19*math.exp(-(x-5.4)**2/0.9)*math.sin(7*(x-5.4) + t*1.4),
                x_range=[5.1, 5.7],
                color=BLUE_B,
                stroke_width=4,
            ).move_to([0, -2.5, 0])
            if j == 0:
                wave_ref = wave
                self.add(wave)
            else:
                self.play(Transform(wave_ref, wave), run_time=0.08)
        etext = Text("Earth", color=WHITE, font_size=23).next_to(earth, DOWN, buff=0.14)
        gw_label2 = Text("Gravitational Wave", color=BLUE_B, font_size=25).next_to(wave_ref, UP, buff=0.23)
        self.play(FadeIn(etext), FadeIn(gw_label2), run_time=0.5)
        self.wait(1.3)
        self.play(*[FadeOut(m) for m in self.mobjects], run_time=1.0)
