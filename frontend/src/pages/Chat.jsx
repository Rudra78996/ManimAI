import React, { useState, useRef, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/SideBar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SendIcon from "@/assets/send.svg?react";
import Settings from "@/assets/settings.svg?react";
import { Heart, Download, Share2 } from "lucide-react";
import User from "@/assets/user.svg?react";
import Bot from "@/assets/bot.svg?react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeToggle from "@/components/ThemeToggle";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const messagesEndRef = useRef(null);
  const [currentVideoURL, setCurrentVideoURL] = useState(
    "https://res.cloudinary.com/dxndjgy7k/video/upload/v1750076935/manim_animations/ixgyjflqojzjxahotlev.mp4"
  );
  const [userName, setUserName] = useState("rudra");
  const [message, setMessage] = useState([
    {
      User: "AI",
      Content:
        "Hello! I'm ManimAI. Give me a topic or problem and I'll animate it for you!",
    },
    {
      User: "Human",
      Content: "Create X^2 graph animation",
    },
    {
      User: "AI",
      Content: "I have generated animation ",
    },
    {
      User: "AI",
      Content: "I have generated animation ",
    },
    {
      User: "AI",
      Content: "I have generated animation ",
    },
    {
      User: "AI",
      Content: "I have generated animation ",
    },
    {
      User: "AI",
      Content:
        "Create an animated visualization of Lissajous curves using Manim. Begin with a black background. Place two perpendicular axes: one horizontal sine wave generator on the x-axis and one vertical sine wave generator on the y-axis. Animate a small white dot that moves smoothly along the curve traced by these two oscillating motions. As the dot moves, it should leave a continuous glowing trail that gradually forms a complete Lissajous figure.Use different frequencies for the x and y motions (e.g., x: 3Hz, y: 2Hz) to create elegant loops and crossings. The animation should be smooth, hypnotic, and mesmerizing. You can add a soft color gradient to the trail as the curve evolves (optional).Include simple labels X Oscillation and Y Oscillation near the respective axes to guide viewers. Make sure the motion loops seamlessly and smoothly for visual satisfaction.",
    },
  ]);
  const [videosURLs, setVideoURLs] = useState([
    "https://res.cloudinary.com/dxndjgy7k/video/upload/v1750076935/manim_animations/ixgyjflqojzjxahotlev.mp4",
    "https://res.cloudinary.com/dxndjgy7k/video/upload/v1750076935/manim_animations/ixgyjflqojzjxahotlev.mp4",
    "https://res.cloudinary.com/dxndjgy7k/video/upload/v1750076935/manim_animations/ixgyjflqojzjxahotlev.mp4",
    "https://res.cloudinary.com/dxndjgy7k/video/upload/v1750076935/manim_animations/ixgyjflqojzjxahotlev.mp4",
    "https://res.cloudinary.com/dxndjgy7k/video/upload/v1750076935/manim_animations/ixgyjflqojzjxahotlev.mp4",
    "https://res.cloudinary.com/dxndjgy7k/video/upload/v1750076935/manim_animations/ixgyjflqojzjxahotlev.mp4",
    "https://res.cloudinary.com/dxndjgy7k/video/upload/v1750076935/manim_animations/ixgyjflqojzjxahotlev.mp4",
    "https://res.cloudinary.com/dxndjgy7k/video/upload/v1750076935/manim_animations/ixgyjflqojzjxahotlev.mp4",
    "https://res.cloudinary.com/dxndjgy7k/video/upload/v1750076935/manim_animations/ixgyjflqojzjxahotlev.mp4",
    "https://res.cloudinary.com/dxndjgy7k/video/upload/v1750076935/manim_animations/ixgyjflqojzjxahotlev.mp4",
    "https://res.cloudinary.com/dxndjgy7k/video/upload/v1750076935/manim_animations/ixgyjflqojzjxahotlev.mp4",
    "https://res.cloudinary.com/dxndjgy7k/video/upload/v1750076935/manim_animations/ixgyjflqojzjxahotlev.mp4",
  ]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);
  const scrollRef = useRef(null);
  const scroll = (offset) => {
    scrollRef.current.scrollBy({
      left: offset,
      behavior: "smooth",
    });
  };
  const navigate = useNavigate();
  return (
    <div className="h-screen w-screen flex ">
      <div className="border-r-2 border-foreground/10">
        <SidebarProvider>
          <AppSidebar />
          <main>
            <SidebarTrigger />
          </main>
        </SidebarProvider>
      </div>
      <div className=" h-screen w-[100%]">
        {/* navbar */}
        <div className=" h-[7%] flex w-full items-center justify-between border-b-2 border-foreground/10">
          <div className="ml-1.5">
            <img src="/logo.png" alt="ManimAI" className="h-12 dark:invert cursor-pointer" onClick={()=>navigate("/")} />
          </div>
          <div className=" flex">
            <div className="mr-5 mt-0.5">
              <ThemeToggle />
            </div>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div
                    className="bg-gray-200  text-gray-900 w-10 h-10 rounded-full flex items-center justify-center text-2xl mr-5 border border-gray-600 cursor-pointer  focus:outline-none focus:ring-0 focus-visible:ring-0 active:bg-transparent
              "
                  >
                    {userName.toUpperCase().charAt(0)}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="translate-x-[-20px]">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuItem>Team</DropdownMenuItem>
                  <DropdownMenuItem>Subscription</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <div className="flex w-full h-[93%]">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={50} className="">
              <div className="h-[92%] text-center p-1.5 ">
                <div className="flex h-full w-full flex-col gap-12 overflow-y-auto p-4 scrollbar-hide">
                  {message.map((msg, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 self-start"
                    >
                      <div className="pt-1">
                        {msg.User === "AI" ? (
                          <Bot className="w-6 h-6" />
                        ) : (
                          <User className="w-6 h-6" />
                        )}
                      </div>
                      <div
                        className={
                          "rounded-xl px-4  text-sm max-w-[75%] text-left"
                        }
                      >
                        {msg.Content}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              <div className="flex justify-center">
                <Input
                  type="text"
                  placeholder="Ask anything to animate"
                  className="w-[80%] mr-1.5 ml-0.5"
                />
                <div className="p-1.5">
                  <Settings />
                </div>
                <Button className="mx-1.5">
                  <SendIcon className="w-4 h-4" />
                </Button>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel
              defaultSize={50}
              className="hidden md:block border-l-2 border-foreground/10"
            >
              <div className="flex flex-col h-full max-h-screen overflow-hidden">
                {/* Main Video */}
                <div className="flex justify-center p-4">
                  <video
                    src={currentVideoURL}
                    controls
                    className="w-full max-w-[90%] rounded-lg border shadow border-gray-600"
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-center gap-4 pb-2">
                  <Button variant="outline" size="icon">
                    <Download className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Heart className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
                {/* Scrollable video thumbnails */}
                <div className="overflow-y-auto px-4 pb-4">
                  <h2 className="text-sm font-semibold mb-2">
                    Generated Animations
                  </h2>
                  <div className="relative py-1 border-b-2 border-t-2 border-foreground/10">
                    <button
                      onClick={() => scroll(-300)}
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-200 dark:bg-gray-700 rounded-full p-2 shadow-md dark:hover:bg-gray-500
                      hover:bg-gray-300
                      "
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div
                      className="flex gap-2 overflow-x-auto  scrollbar-hide"
                      ref={scrollRef}
                    >
                      {videosURLs.map((url, index) => (
                        <video
                          key={index}
                          src={url}
                          className="w-40 h-24 rounded-md border shadow-sm object-cover cursor-pointer border-gray-600"
                          onClick={() => setCurrentVideoURL(url)}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => scroll(300)}
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-200 dark:bg-gray-700 rounded-full p-2 shadow-md dark:hover:bg-gray-500 hover:bg-gray-300"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                  <Button className="mt-4">Merge Scene</Button>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  );
};

export default Chat;
