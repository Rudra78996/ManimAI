import React from "react";
import NavBar from "../components/NavBar";
import { Button } from "@/components/ui/button";
import HoverButton from "@/components/ui/hoverButton";
import demoVideo from "../assets/demo-1.mp4";
import FeatureCards from "@/components/FeatureSection";
import FQASection from "@/components/FQASection";
import Footer from "@/components/Footer";
import { useUser } from "@clerk/clerk-react";
import Loader from "@/components/Loader";
import { useNavigate } from "react-router-dom";
const backendURL = import.meta.env.VITE_BACKEND_URL;
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { useState } from "react";

const Home = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { isSignedIn, user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const createGroup = async () => {
    if (!isSignedIn) {
      navigate("/sign-in");
      return;
    }
    // setIsLoading(true)
    try {
      const token = await getToken();
      const res = await axios.post(
        backendURL + "/api/chat/create-chat",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsLoading(false);
      navigate(`/chat/${res.data.chatId}`);
      return;
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };
  if (!isLoaded)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  return (
    <div className="relative min-h-screen ">
      <div className="absolute inset-0 -z-10 h-full w-full overflow-hidden">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]"></div>
        </div>
        <div className="relative h-full w-full hidden dark:block bg-slate-950">
          <div className="absolute bottom-0 top-[-10%] left-[-250px] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]" />
          <div className="absolute bottom-0 top-[-10%] right-[-250px] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]" />
        </div>
      </div>

      <NavBar />
      <main className="mt-16 flex justify-center w-full flex-col relative items-center gap-8 px-4 pt-16">
        <div className="relative max-w-3xl flex-col justify-center items-center mx-auto">
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
          <Button
            className="text-lg md:text-xl h-10 px-6 py-6 cursor-pointer"
            onClick={createGroup}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                Creating...
              </span>
            ) : (
              "Get Started"
            )}
          </Button>
            <Button 
              className="text-lg md:text-xl h-10 px-6 py-6 cursor-pointer"
              variant="outline"
              onClick={() => {
                const section = document.getElementById("demo-video");
                if (section) {
                  section.scrollIntoView({ behavior: "smooth", block: "center" });
                }
              }}
            >
              Learn More
            </Button>
          </div>
        </div>
        <div className="relative mt-16 aspect-video max-w-[1200px] rounded-md md:mt-32 flex items-center justify-center " id="demo-video">
          <div
            className="absolute -z-10 h-[140%] w-[140%] rounded-[40px] opacity-40 blur-[250px] animate-pulse"
            style={{
              background:
                "radial-gradient(ellipse at center, #06b6d4, #d946ef)",
            }}
          />

          {/* Video */}
          <div className="" >
            <video
              src={demoVideo}
              autoPlay
              loop
              muted
              playsInline
              className="aspect-video rounded-md border border-white/10 object-cover shadow-2xl"
            />
          </div>
        </div>
        <div>
          <FeatureCards />
        </div>
        <div id="faq">
          <FQASection />
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Home;
