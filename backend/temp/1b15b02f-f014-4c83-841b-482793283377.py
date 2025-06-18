from manim import *

class MyAnimation(Scene):
    def create_starfield(self, num=100):
        stars = VGroup()
        for _ in range(num):
            s = Dot(
                point=[
                    np.random.uniform(-7, 7), 
                    np.random.uniform(-4, 4), 
                    0
                ],
                radius=np.random.uniform(0.01, 0.04),
                color=WHITE,
                opacity=np.random.uniform(0.3, 1)
            )
            # Give a flicker animation attribute
            s.flicker_phase = np.random.uniform(0, 2 * np.pi)
            s.flicker_speed = np.random.uniform(0.5, 1.5)
            stars.add(s)
        return stars

    def animate_starfield_flicker(self, stars, run_time):
        def update_flicker(star, dt):
            t = self.time
            opac = 0.5 + 0.5 * np.sin(t * star.flicker_speed + star.flicker_phase)
            star.set_opacity(0.3 + 0.7 * opac)
        def updater(stars, dt):
            for star in stars:
                update_flicker(star, dt)
        stars.add_updater(updater)
        self.wait(run_time)
        stars.remove_updater(updater)

    def create_grid(self, size=6, num=10):
        grid = VGroup()
        for i in range(-num, num + 1):
            # Vertical
            l1 = Line(
                start=[i * size / num, -size, 0],
                end=[i * size / num, size, 0],
                color=BLUE_B, stroke_opacity=0.6, stroke_width=1.5
            )
            # Horizontal
            l2 = Line(
                start=[-size, i * size / num, 0],
                end=[size, i * size / num, 0],
                color=BLUE_B, stroke_opacity=0.6, stroke_width=1.5
            )
            grid.add(l1, l2)
        grid.set_z_index(1)
        return grid

    def create_wave_grid(self, grid, t, amplitude=0.4, speed=2, center=ORIGIN):
        new_grid = VGroup()
        for line in grid:
            points = line.get_start_and_end()
            n_points = 41
            points_array = [
                np.linspace(points[0][0], points[1][0], n_points),
                np.linspace(points[0][1], points[1][1], n_points),
            ]
            # For each line, create ripples perpendicular to propagation direction
            pts = []
            for ix in range(n_points):
                px = points_array[0][ix]
                py = points_array[1][ix]
                # Ripples radiate out from collision center
                dist = np.hypot(px - center[0], py - center[1])
                wave = amplitude * np.sin(2 * PI * (dist - speed * t)) * np.exp(-0.7 * dist)
                # Offset along direction from center
                dir_vec = np.array([px, py, 0]) - np.array([center[0], center[1], 0])
                if np.linalg.norm(dir_vec) > 0:
                    dir_vec = dir_vec / np.linalg.norm(dir_vec)
                else:
                    dir_vec = np.array([0, 0, 0])
                out_pt = np.array([px, py, 0]) + wave * dir_vec
                pts.append(out_pt)
            new_line = VMobject()
            new_line.set_points_as_corners(pts)
            new_line.set_color(BLUE_B)
            new_line.set_opacity(0.85)
            new_line.set_stroke(width=1.7)
            new_grid.add(new_line)
        new_grid.set_z_index(1)
        return new_grid        

    def spiral_positions(self, a, b, theta, steps):
        # Returns list of points along a spiral for two stars
        t = np.linspace(theta[0], theta[1], steps)
        r = a - b * t
        x1 = r * np.cos(t)
        y1 = r * np.sin(t)
        x2 = -r * np.cos(t)
        y2 = -r * np.sin(t)
        path1 = [np.array([x, y, 0]) for x, y in zip(x1, y1)]
        path2 = [np.array([x, y, 0]) for x, y in zip(x2, y2)]
        return path1, path2

    def construct(self):
        # Background
        bg_rect = Rectangle(width=14, height=8, fill_color=BLACK, fill_opacity=1, stroke_opacity=0)
        self.add(bg_rect)

        # Starfield
        stars = self.create_starfield(120)
        self.add(stars)
        self.animate_starfield_flicker(stars, run_time=1.5)

        # Space-time Grid
        grid = self.create_grid(size=5.5, num=9)
        grid.set_opacity(0.0)
        self.add(grid)
        self.play(grid.animate.set_opacity(0.8), run_time=1.5)

        # Introduce Neutron Stars
        neutron_star1 = Circle(radius=0.33, color=WHITE, fill_opacity=1).move_to(LEFT * 3.5)
        neutron_star1.set_glow_factor(2)
        neutron_star2 = Circle(radius=0.33, color=WHITE, fill_opacity=1).move_to(RIGHT * 3.5)
        neutron_star2.set_glow_factor(2)
        neutron_star_group = VGroup(neutron_star1, neutron_star2)
        label_ns1 = Text("Neutron Star", font_size=26, color=WHITE).next_to(neutron_star1, UP, buff=0.24)
        label_ns2 = Text("Neutron Star", font_size=26, color=WHITE).next_to(neutron_star2, UP, buff=0.24)
        self.play(FadeIn(neutron_star_group), FadeIn(label_ns1), FadeIn(label_ns2), run_time=1)

        # Label Space-Time
        label_grid = Text("Space-Time Fabric", font_size=32, color=BLUE_B).to_corner(UL, buff=0.25)
        self.play(FadeIn(label_grid), run_time=0.7)

        # BEGIN SPIRAL
        spiral_a = 3.6  # initial radius
        spiral_b = spiral_a / (5*PI)
        theta0 = PI/2
        theta1 = 5*PI
        steps = 90
        path1, path2 = self.spiral_positions(spiral_a, spiral_b, (theta0, theta1), steps)
        spiral_runtime = 4.0

        # For simple trajectory, animate positions per frame
        def neutron_updater(mob, alpha):
            idx = int(alpha * (steps-1))
            neutron_star1.move_to(path1[idx])
            neutron_star2.move_to(path2[idx])
            label_ns1.next_to(neutron_star1, UP, buff=0.24)
            label_ns2.next_to(neutron_star2, UP, buff=0.24)
            # Rippling grid animation
            grid_new = self.create_wave_grid(
                grid, 
                t=alpha * 0.8, 
                amplitude=0.23 + 0.24 * (alpha), 
                speed=1.8 + 1.2*alpha
            )
            grid.become(grid_new)

        anim = AnimationGroup(
            UpdateFromAlphaFunc(neutron_star_group, neutron_updater),
            UpdateFromAlphaFunc(label_ns1, neutron_updater),
            UpdateFromAlphaFunc(label_ns2, neutron_updater),
            run_time=spiral_runtime, rate_func=rate_functions.ease_in_out_sine
        )
        self.play(anim)

        # FINAL COLLISION
        collision_flash = Circle(radius=0.6, color=WHITE, fill_opacity=1, stroke_width=0).move_to(ORIGIN)
        collision_flash.set_opacity(0.7)
        self.add(collision_flash)
        self.play(collision_flash.animate.set_opacity(0), run_time=0.4)
        self.remove(collision_flash)
        self.remove(label_ns1, label_ns2)
        
        # Strong Ripples
        n_waves = 7
        wave_group = VGroup()
        for i in range(n_waves):
            ring = Circle(radius=0.71+i*0.56, color=BLUE_B, stroke_width=3, opacity=0.35)
            ring.move_to(ORIGIN)
            wave_group.add(ring)
        self.add(wave_group)
        ripple_label = Text("Gravitational Wave", font_size=28, color=BLUE_B).next_to(wave_group[2], RIGHT, buff=0.3)
        self.play(FadeIn(ripple_label), run_time=0.8)

        # Animate neutron stars shrinking/merging
        self.play(
            neutron_star1.animate.scale(0.6).move_to(ORIGIN),
            neutron_star2.animate.scale(0.6).move_to(ORIGIN),
            run_time=0.9
        )
        self.remove(neutron_star1, neutron_star2)

        # Ripples propagate outward
        def wave_updater(group, dt):
            for idx, ring in enumerate(group):
                scale_fac = 1 + 0.6 * dt * (idx+1)
                ring.scale(scale_fac)
                ring.set_opacity(max(0, ring.get_opacity() - 0.19 * dt * (idx+1)))
        wave_group.add_updater(wave_updater)
        
        # Animate spacetime grid ripple intensifying
        def grid_ripple_updater(mob, alpha):
            amp = 0.43 + 0.14 * (1-alpha)
            t = 1.2 + 1.5*alpha
            grid_new = self.create_wave_grid(
                grid, t=t, amplitude=amp, speed=2.3)
            grid.become(grid_new)
        self.play(UpdateFromAlphaFunc(grid, grid_ripple_updater), run_time=2)

        # Simulate a simple "music visualizer": volume goes up with wave
        bar_group = VGroup()
        n_bars = 8
        for i in range(n_bars):
            bar = Rectangle(
                height=0.12+0.14*np.sin(i*PI/3), width=0.11,
                color=BLUE_B, fill_opacity=0.7, stroke_width=0
            )
            bar.move_to(DOWN*3.3 + RIGHT*5.0 + RIGHT * i *0.19)
            bar_group.add(bar)
        visualizer_label = Text("Sound", font_size=18, color=BLUE_B).next_to(bar_group, UP, buff=0.06)
        bar_group.set_z_index(2)
        self.add(bar_group, visualizer_label)
        def visualizer_updater(group, alpha):
            for i, bar in enumerate(group):
                h = 0.16 + 0.18*(np.sin(i*PI/2 + alpha * 8 * PI)*0.5+0.5) * (1+0.8*alpha)
                bar.set_height(h, stretch=True)
        self.play(UpdateFromAlphaFunc(bar_group, visualizer_updater), run_time=2.0)

        wave_group.remove_updater(wave_updater)
        self.remove(wave_group, ripple_label)

        # ZOOM OUT TO EARTH
        earth = Circle(radius=0.34, color=GREEN, fill_opacity=1).move_to(DOWN*2.7 + RIGHT*4.6)
        earth_label = Text("Earth", font_size=21, color=GREEN).next_to(earth, DOWN, buff=0.13)
        detector = Rectangle(width=0.5, height=0.08, color=YELLOW, fill_opacity=1).next_to(earth, UP, buff=0.1)
        self.add(earth, earth_label, detector)

        # Faint wavefront reaching detector (just a single blue curve passing earth)
        wavefront = Arc(
            radius=0.34+0.3, start_angle=PI*1.1, angle=PI*0.7, color=BLUE_B, stroke_width=6, opacity=0.66
        ).move_arc_center_to(earth.get_center()).shift(LEFT*0.10)
        self.add(wavefront)
        self.play(
            wavefront.animate.shift(RIGHT * 1.32).set_opacity(0),
            detector.animate.set_fill(YELLOW_E, opacity=1),
            run_time=1.8
        )
        self.wait(0.7)