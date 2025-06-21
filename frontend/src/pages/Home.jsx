import React from "react";
import NavBar from "../components/NavBar";
import Header from "../components/Header";
import { Button } from "@/components/ui/button";
import HoverButton from "@/components/ui/hoverButton";

const Home = () => {
  return (
    <>
      <div className="absolute inset-0 -z-10 h-full w-full overflow-hidden">
        <div className="h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:hidden" />
        <div className="relative h-full w-full hidden dark:block bg-slate-950">
          <div className="absolute bottom-0 top-[-10%] left-[-250px] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]" />
          <div className="absolute bottom-0 top-[-10%] right-[-250px] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]" />
        </div>
      </div>

      <NavBar />
      <main>
        <div className="relative mx-auto max-w-3xl flex-col justify-center items-center">
          <HoverButton />
          <h1 className="text-center text-3xl font-medium text-gray-900 dark:text-gray-50 sm:text-6xl">
            Create stunning animations
            <br />
            <span className="animate-text-gradient inline-flex bg-gradient-to-r from-neutral-900 via-slate-500 to-neutral-500 bg-[200%_auto] bg-clip-text leading-tight text-transparent dark:from-neutral-100 dark:via-slate-400 dark:to-neutral-400">
              for math and ideas
            </span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-300 text-center">
            Powered by AI — no code, just clear visuals in minutes
          </p>
          <div className="mt-10 flex gap-4 justify-center">
            <Button className="text-lg md:text-xl h-10 px-6 py-6">
              Get Started
            </Button>
            <Button
              className="text-lg md:text-xl h-10 px-6 py-6"
              variant="outline"
            >
              Learn More
            </Button>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
