import React from "react";
import NavBar from "../components/NavBar";

const showcaseVideos = [
  {
    title: "Life Cycle of Star",
    video: "https://res.cloudinary.com/dxndjgy7k/video/upload/v1750071596/manim_animations/mwwxunvhzncuvp3rjixl.mp4",
  },
  {
    title: "Solar System",
    video: "https://res.cloudinary.com/dxndjgy7k/video/upload/v1750076935/manim_animations/ixgyjflqojzjxahotlev.mp4",
  },
  {
    title: " Area Under a Curve",
    video: "https://res.cloudinary.com/dxndjgy7k/video/upload/v1751112751/manim_animations/z37yevgaqervhgpt6oub.mp4",
  },
  {
    title: "Magnetic Field",
    video: "https://res.cloudinary.com/dxndjgy7k/video/upload/v1750077340/manim_animations/jksan7yvweuqpj5gxvid.mp4",
  },
  {
    title: "Parametric Spiral Animation on the XY Plane",
    video: "https://res.cloudinary.com/dxndjgy7k/video/upload/v1750212195/manim_animations/xtd6vuxuzeb8slbmh8qa.mp4",
  },
  {
    title: "Algebraic Curve : x^3",
    video: "https://res.cloudinary.com/dxndjgy7k/video/upload/v1750942265/manim_animations/otpah277gss7f01mhuws.mp4",
  },
];

const Gallery = () => {
  return (
    <div className="relative min-h-screen bg-background flex flex-col items-center justify-center px-6 ">
      <NavBar />
      <h1 className="text-4xl font-bold mb-8 text-center">Best of ManimAI</h1>
      <p className="text-lg text-muted-foreground mb-12 text-center max-w-2xl">
        Explore some of the most impressive animations created with ManimAI. These videos showcase the power and creativity possible with our platform.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-8xl">
        {showcaseVideos.map((v, idx) => (
          <div
            key={idx}
            className="bg-card rounded-2xl shadow-lg p-4 flex flex-col items-center border border-gray-200 dark:border-gray-800 hover:shadow-2xl transition group relative overflow-hidden"
          >
            <div className="w-full aspect-video rounded-xl overflow-hidden mb-4 bg-black relative group">
              <video
                src={v.video}
                className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                poster={v.thumbnail}
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white text-lg font-semibold px-4 py-2 bg-black/60 rounded-lg">{v.title}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;