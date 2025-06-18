from manim import *
import numpy as np
import random

class MyAnimation(Scene):
    def construct(self):
        # Parameters
        width = config.frame_width
        height = config.frame_height

        # 1. Dark Starfield Background
        starfield = VGroup()
        n_stars = 90
        random.seed(7)
        for _ in range(n_stars):
            x = random.uniform(-width / 2, width / 2)
            y = random.uniform(-height / 2, height / 2)
            size = random.uniform(0.01, 0.05)
            star = Dot(point=[x, y, 0], radius=size, color=WHITE, stroke_width=0)
            flicker = random.uniform(0, 1)
            star.set_opacity(0.6 + 0.35 * np.sin(flicker * 2 * PI))
            starfield.add(star)
        self.add(Rectangle(width=width*1.1, height=height*1.1, fill_color=BLACK, fill_opacity=1, stroke_width=0))
        self.add(starfield)

        self.wait(0.5)

        # 2. Space-Time Grid
        n_lines = 13
        grid_lines = VGroup()
        color_grid = BLUE_B
        grid_alpha = 0.68
        x_min = -6
        x_max = 6
        y_min = -3.6
        y_max = 3.6
        # Horizontal
        for i in range(n_lines):
            y = np.interp(i, [0, n_lines-1], [y_min, y_max])
            line = Line([x_min, y, 0], [x_max, y, 0], color=color_grid)
            line.set_opacity(grid_alpha)
            grid_lines.add(line)
        # Vertical
        for i in range(n_lines):
            x = np.interp(i, [0, n_lines-1], [x_min, x_max])
            line = Line([x, y_min, 0], [x, y_max, 0], color=color_grid)
            line.set_opacity(grid_alpha)
            grid_lines.add(line)
        grid_lines.set_z_index(1)

        # Animate grid fade-in
        self.play(FadeIn(grid_lines, run_time=1.0))
        self.wait(0.5)

        # 3. "Space-Time Fabric" label
        grid_label = Text("Space-Time Fabric", font_size=30, color=BLUE_B).to_corner(UL).shift(0.2*DOWN+0.3*RIGHT)
        grid_label.set_z_index(3)
        self.play(FadeIn(grid_label), run_time=0.6)
        
        # 4. Neutron Stars
        neutron_radius = 0.32
        nstar_glow_radius = neutron_radius * 2.5
        left_pos = np.array([-3.6, 0, 0])
        right_pos = np.array([3.6, 0, 0])
        nstar_left = VGroup(Circle(radius=nstar_glow_radius, color=WHITE, fill_opacity=0.19, stroke_width=0),
                            Circle(radius=neutron_radius, color=WHITE, fill_opacity=1.0, stroke_width=2))
        nstar_right = VGroup(Circle(radius=nstar_glow_radius, color=WHITE, fill_opacity=0.19, stroke_width=0),
                             Circle(radius=neutron_radius, color=WHITE, fill_opacity=1.0, stroke_width=2))
        nstar_left.move_to(left_pos)
        nstar_right.move_to(right_pos)

        # 5. "Neutron Star" labels
        nstar_left_label = Text("Neutron Star", font_size=22, color=WHITE).next_to(nstar_left, UP)
        nstar_right_label = Text("Neutron Star", font_size=22, color=WHITE).next_to(nstar_right, UP)
        
        # Animate Neutron star appearance
        self.play(FadeIn(nstar_left), FadeIn(nstar_right), FadeIn(nstar_left_label), FadeIn(nstar_right_label), run_time=0.8)
        self.wait(0.7)

        # 6. Spiraling Neutron Stars
        duration_spiral = 4
        center = np.array([0, 0, 0])

        def get_spiral_pos(start_theta, t, R0, spirals=2, collapse=0.4):
            # t in [0, 1], R0 is initial radius, stars spiral 'spirals' times and move closer
            theta = start_theta + 2*PI*spirals*t
            r = R0 * (1 - collapse * t)
            return np.array([r * np.cos(theta), r * np.sin(theta), 0])

        nframes = int(duration_spiral*60)
        def stars_updater(mob, alpha):
            left = nstar_left
            right = nstar_right
            l_pos = get_spiral_pos(np.pi/2, alpha, 3.2)
            r_pos = get_spiral_pos(-np.pi/2, alpha, 3.2)
            left.move_to(l_pos)
            right.move_to(r_pos)
            nstar_left_label.next_to(left, UP)
            nstar_right_label.next_to(right, UP)

        stars_grp = VGroup(nstar_left, nstar_right, nstar_left_label, nstar_right_label)
        self.play(UpdateFromAlphaFunc(stars_grp, stars_updater), run_time=duration_spiral, rate_func=smooth)
        self.wait(0.3)

        # As they spiral, start the grid ripple
        # 7. Concentric Rippling Grid (Gravitational Waves)
        wave_label = Text("Gravitational Wave", font_size=26, color=YELLOW_E).next_to(ORIGIN, UP).shift(0.7*UP)
        self.play(FadeIn(wave_label), run_time=0.5)

        rippling_grid = VGroup()
        grid_horizontal = []
        grid_vertical = []
        for i in range(n_lines):
            y = np.interp(i, [0, n_lines-1], [y_min, y_max])
            locs = []
            for j in range(25):
                x = np.interp(j, [0, 24], [x_min, x_max])
                locs.append(np.array([x, y, 0]))
            grid_horizontal.append(locs)
        for i in range(n_lines):
            x = np.interp(i, [0, n_lines-1], [x_min, x_max])
            locs = []
            for j in range(19):
                y = np.interp(j, [0, 18], [y_min, y_max])
                locs.append(np.array([x, y, 0]))
            grid_vertical.append(locs)
        
        smooth_curve = lambda pts: VMobject().set_points_smoothly(pts)
        horizontal_lines = [VMobject().set_points_smoothly(pts) for pts in grid_horizontal]
        vertical_lines = [VMobject().set_points_smoothly(pts) for pts in grid_vertical]
        [line.set_color(color_grid).set_opacity(grid_alpha) for line in (horizontal_lines+vertical_lines)]
        rippling_grid.add(*horizontal_lines, *vertical_lines)
        rippling_grid.set_z_index(2)

        self.add(rippling_grid)

        # Animate the ripples and stars merging
        n_ripples_frames = 75
        collision_flash = Circle(radius=1.18, color=WHITE, fill_opacity=0.4, stroke_width=0).move_to(center)
        collision_flash.set_z_index(10)

        def create_wave_displacement(xy, t, base_amp=0.23, speed=6, wave_r=0.19, n_pulse=2):
            # t in [0, 1]
            x, y = xy[0], xy[1]
            d = np.linalg.norm(xy - center[:2])
            ripple = base_amp * np.exp(-d*0.25) * np.sin(speed*d - 2*PI*t*n_pulse)
            return ripple

        def update_grid(grid, alpha):
            t = alpha * 2.5 # Arbitrary unit for ripple propagation
            for idx, pts in enumerate(grid_horizontal):
                points = []
                for pt in pts:
                    d = np.linalg.norm(pt[:2] - center[:2])
                    offset = 0.23 * np.exp(-0.23*d) * np.sin(2.8*d - 4*PI*alpha)
                    new_pt = pt + np.array([0, offset, 0])
                    points.append(new_pt)
                horizontal_lines[idx].set_points_smoothly(points)
            for idx, pts in enumerate(grid_vertical):
                points = []
                for pt in pts:
                    d = np.linalg.norm(pt[:2] - center[:2])
                    offset = 0.23 * np.exp(-0.23*d) * np.sin(2.8*d - 4*PI*alpha)
                    new_pt = pt + np.array([offset, 0, 0])
                    points.append(new_pt)
                vertical_lines[idx].set_points_smoothly(points)

        # 8. Stars collision at center
        def stars_collapse(mob, alpha):
            left = nstar_left
            right = nstar_right
            pos_left = left.get_center()
            pos_right = right.get_center()
            left.move_to(interpolate(pos_left, center, alpha))
            right.move_to(interpolate(pos_right, center, alpha))
            nstar_left_label.next_to(left, UP)
            nstar_right_label.next_to(right, UP)
            if alpha > 0.85:
                left.set_opacity(1-alpha)
                right.set_opacity(1-alpha)
        
        self.play(
            UpdateFromAlphaFunc(stars_grp, stars_collapse),
            UpdateFromAlphaFunc(rippling_grid, update_grid),
            run_time=1.0, rate_func=there_and_back_with_pause
        )

        # White flash at collision
        self.bring_to_front(collision_flash)
        self.play(FadeIn(collision_flash, run_time=0.16), FadeOut(collision_flash, run_time=0.6))
        self.play(FadeOut(nstar_left_label), FadeOut(nstar_right_label), run_time=0.15)

        # Continue ripples after collision
        def update_ripples(grid, alpha):
            t = 1.0 + alpha * 2.5
            for idx, pts in enumerate(grid_horizontal):
                points = []
                for pt in pts:
                    d = np.linalg.norm(pt[:2] - center[:2])
                    offset = 0.34 * np.exp(-0.18*d) * np.sin(3*d - 2*PI*t)
                    new_pt = pt + np.array([0, offset, 0])
                    points.append(new_pt)
                horizontal_lines[idx].set_points_smoothly(points)
            for idx, pts in enumerate(grid_vertical):
                points = []
                for pt in pts:
                    d = np.linalg.norm(pt[:2] - center[:2])
                    offset = 0.34 * np.exp(-0.18*d) * np.sin(3*d - 2*PI*t)
                    new_pt = pt + np.array([offset, 0, 0])
                    points.append(new_pt)
                vertical_lines[idx].set_points_smoothly(points)
        self.wait(0.12)
        self.play(
            UpdateFromAlphaFunc(rippling_grid, update_ripples),
            FadeOut(nstar_left), FadeOut(nstar_right), FadeOut(wave_label),
            run_time=2.2
        )
        
        self.wait(0.15)

        # 9. Soundtrack "Visualiser" - Simple animated bar in corner
        visualizer_g = VGroup()
        n_bars = 10
        vis_left = 5.3
        vis_bottom = -3.2
        for i in range(n_bars):
            bar = Rectangle(width=0.13, height=0.25, color=BLUE_B, fill_opacity=0.86, stroke_width=0)
            bar.move_to([vis_left+0.14*i, vis_bottom, 0])
            visualizer_g.add(bar)
        vis_label = Text("Soundtrack", font_size=16, color=BLUE_B).next_to(visualizer_g, UP, buff=0.08)
        visualizer_g.add(vis_label)
        self.add(visualizer_g)

        # Visualizer animation synced to intensity of ripples
        def update_visualizer(mob, alpha):
            t = alpha*2*PI+PI/2
            for i, bar in enumerate(visualizer_g[:n_bars]):
                h = 0.3 + 0.42 * np.abs(np.sin(t + i*0.7))
                bar.height = h
                bar.stretch_to_fit_height(h)
        self.play(UpdateFromAlphaFunc(visualizer_g, update_visualizer), run_time=1.4)

        self.wait(0.26)

        # 10. Earth detector receiving faint wave
        # Fade out background, add Earth detector and label, show final gentle crest
        detector_pos = np.array([5.4, -2.0, 0])
        earth = Circle(radius=0.25, color=GREEN, fill_opacity=0.9, stroke_width=2).move_to(detector_pos)
        earth_label = Text("Earth", font_size=22, color=GREEN).next_to(earth, DOWN)
        detector = Rectangle(width=0.28, height=0.06, color=WHITE, fill_opacity=0.85).next_to(earth, RIGHT, buff=0.02)
        det_label = Text("Detector", font_size=16, color=WHITE).next_to(detector, RIGHT, buff=0.055)
        self.play(FadeIn(earth), FadeIn(detector), FadeIn(earth_label), FadeIn(det_label), run_time=0.8)

        # Draw gentle wave crest passing Earth
        def make_wave_crest(alpha):
            # Returns a small sine curve over detector
            n_points = 28
            pts = []
            for i in range(n_points):
                x = np.interp(i, [0, n_points-1], [detector_pos[0]-0.49, detector_pos[0]+0.44])
                y = detector_pos[1] + 0.18 * np.sin(5*PI*(x-detector_pos[0])+alpha*3*PI)
                pts.append([x, y, 0])
            crest = VMobject(stroke_color=YELLOW_B, stroke_width=3)
            crest.set_points_smoothly(pts)
            return crest

        crest = make_wave_crest(0)
        self.add(crest)

        def update_crest(crest_obj, alpha):
            new_crest = make_wave_crest(alpha)
            crest_obj.set_points(new_crest.get_points())

        # Fade out grid and stars, zoom out, show gentle wave crest
        self.play(
            FadeOut(grid_lines), 
            FadeOut(rippling_grid), 
            FadeOut(starfield, run_time=1.5),
            FadeOut(grid_label),
            FadeOut(visualizer_g, run_time=0.7),
            UpdateFromAlphaFunc(crest, update_crest),
            self.camera.frame.animate.scale(1.32),
            run_time=1.8
        )
        # "Gravitational Wave" label at Earth
        earth_wave_label = Text("Gravitational Wave", font_size=20, color=YELLOW_B).next_to(earth, UP, buff=0.18)
        self.play(FadeIn(earth_wave_label), run_time=0.9)
        self.wait(1.3)