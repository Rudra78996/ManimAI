import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Download, Share2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import NavBar from "../components/NavBar";

const backendURL = import.meta.env.VITE_BACKEND_URL;

const generateThumbnail = (url) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.src = url;
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.playsInline = true;
    video.addEventListener("loadeddata", () => {
      video.currentTime = 1;
    });
    video.addEventListener("seeked", () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageUrl = canvas.toDataURL("image/jpeg");
      resolve(imageUrl);
    });
    video.addEventListener("error", (err) => reject(err));
  });
};

const Media = () => {
  const { getToken } = useAuth();
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [thumbnails, setThumbnails] = useState([]);
  const videoRefs = useRef([]);

  useEffect(() => {
    const fetchMedia = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        const { data } = await axios.post(
          `${backendURL}/api/chat/all-user-media`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMedia(data);
        const thumbs = await Promise.all(
          data.map(async (item) => {
            try {
              return await generateThumbnail(item.url);
            } catch {
              return "/placeholder.png";
            }
          })
        );
        setThumbnails(thumbs);
      } catch {
        setMedia([]);
        setThumbnails([]);
      }
      setLoading(false);
    };
    fetchMedia();
  }, [getToken]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-background  px-4">
      <NavBar />
      <h1 className="text-2xl font-bold mb-8 text-center">Your Generated Media</h1>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="w-full aspect-video rounded-lg h-72" />
          ))}
        </div>
      ) : media.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          {media.map((item, idx) => (
            <div key={item._id || idx} className="bg-card rounded-xl shadow-lg p-4 flex flex-col items-center">
              <div
                className="w-full h-[340px] rounded-xl overflow-hidden border border-gray-300 mb-3 bg-black cursor-pointer relative group"
                onMouseEnter={() => videoRefs.current[idx] && videoRefs.current[idx].play()}
                onMouseLeave={() => videoRefs.current[idx] && videoRefs.current[idx].pause()}
              >
                <img
                  src={thumbnails[idx] || "/placeholder.png"}
                  alt="Video thumbnail"
                  className="w-full h-full object-cover rounded-xl absolute inset-0 z-0 transition-opacity duration-200 group-hover:opacity-0"
                  draggable={false}
                />
                <video
                  ref={el => (videoRefs.current[idx] = el)}
                  src={item.url}
                  className="w-full h-full object-cover rounded-xl relative z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  preload="metadata"
                  muted
                  loop
                  playsInline
                  style={{ background: '#000' }}
                  tabIndex={-1}
                />
              </div>
              <div className="flex gap-2 w-full justify-center mt-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={async () => {
                    try {
                      const response = await fetch(item.url, { mode: "cors" });
                      const blob = await response.blob();
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "manim-video.mp4";
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                      toast.success("Download started!");
                    } catch {
                      toast.error("Failed to download video.");
                    }
                  }}
                >
                  <Download className="w-5 h-5" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => window.open(item.url, "_blank")}
                >
                  <ExternalLink className="w-5 h-5" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(item.url);
                      toast.success("Link copied to clipboard!");
                    } catch {
                      toast.error("Failed to copy link.");
                    }
                  }}
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground text-lg mt-12">No media found. Generate some animations to see them here!</div>
      )}
    </div>
  );
};

export default Media;