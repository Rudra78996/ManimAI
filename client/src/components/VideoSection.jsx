import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart as HeartIcon, Heart as HeartFilledIcon, Download, Share2, Bot } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import socket from "@/socket";
import { toast } from "sonner";

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

const isVideoUrl = (url) => {
  return typeof url === "string" && url.length > 0;
};

const VideoSection = ({ chatId }) => {
  const { getToken } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        const { data } = await axios.post(
          `${backendURL}/api/chat/all-media`,
          { chatId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const filtered = data.filter((vid) => isVideoUrl(vid.url));
        const withThumbnails = await Promise.all(
          filtered.map(async (vid) => {
            try {
              const thumb = await generateThumbnail(vid.url);
              return { ...vid, thumbnail: thumb };
            } catch {
              return { ...vid, thumbnail: null };
            }
          })
        );
        setVideos(withThumbnails);
        setCurrentVideo(withThumbnails[0] || null);
      } catch {
        setVideos([]);
        setCurrentVideo(null);
      }
      setLoading(false);
    };
    if (chatId) fetchVideos();
  }, [chatId]);

  useEffect(() => {
    socket.connect();
    const handleNewMessage = async (msgs) => {
      if (msgs.some((msg) => msg.type === "video")) {
        setLoading(true);
        try {
          const token = await getToken();
          const { data } = await axios.post(
            `${backendURL}/api/chat/all-media`,
            { chatId },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const filtered = data.filter((vid) => isVideoUrl(vid.url));
          const withThumbnails = await Promise.all(
            filtered.map(async (vid) => {
              try {
                const thumb = await generateThumbnail(vid.url);
                return { ...vid, thumbnail: thumb };
              } catch {
                return { ...vid, thumbnail: null };
              }
            })
          );
          setVideos(withThumbnails);
          setCurrentVideo(withThumbnails[0] || null);
        } catch {
          setVideos([]);
          setCurrentVideo(null);
        }
        setLoading(false);
      }
    };
    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [chatId]);

  return (
    <div className="flex flex-col h-full max-h-screen overflow-hidden">
      {/* Video Preview */}
      <div className="flex justify-center p-4">
        {loading ? (
          <div className="w-full max-w-[90%]">
            <Skeleton className="w-full aspect-video h-56 mb-2" />
            <div className="text-center text-muted-foreground mt-2">
              Loading animation...
            </div>
          </div>
        ) : currentVideo ? (
          <div className="w-full max-w-screen-md px-4">
            <video
              src={currentVideo.url}
              controls
              className="aspect-video w-full rounded-xl border shadow border-gray-600 bg-black"
              onError={(e) => {
                e.target.onerror = null;
                setCurrentVideo(null);
              }}
            />
          </div>
        ) : (
          <div className="w-full max-w-screen-md h-[28rem] flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Bot className="w-10 h-10 mb-3 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-1">Send Chat</h3>
            <p className="text-sm text-muted-foreground">
              To see the video preview, render a video by sending a chat.
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 pb-4">
        {/* Download Button */}
        <Button
          variant="outline"
          size="icon"
          className="cursor-pointer"
          disabled={!currentVideo}
          onClick={async () => {
            try {
              const response = await fetch(currentVideo.url, {
                mode: "cors",
              });
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
            } catch (err) {
              console.error("Download error:", err);
              toast.error("Failed to download video.");
            }
          }}
        >
          <Download className="w-5 h-5" />
        </Button>

        {/* Heart / Like Button - stub */}
        <Button
        className="cursor-pointer"
          variant={currentVideo?.isLiked ? "outline" : "outline"}
          size="icon"
          disabled={!currentVideo}
          onClick={async () => {
            if (!currentVideo) return;
            try {
              const token = await getToken();
              const { data } = await axios.post(
                `${backendURL}/api/chat/like-media`,
                { mediaId: currentVideo._id },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              setCurrentVideo((prev) => prev && { ...prev, isLiked: data.isLiked });
              setVideos((prev) =>
                prev.map((vid) =>
                  vid._id === currentVideo._id ? { ...vid, isLiked: data.isLiked } : vid
                )
              );
              toast.success(data.isLiked ? "Liked!" : "Unliked!");
            } catch (err) {
              toast.error("Failed to update like status.");
            }
          }}
        >
          {currentVideo?.isLiked ? (
            <HeartFilledIcon className="w-5 h-5 fill-red-500 text-red-500" />
          ) : (
            <HeartIcon className="w-5 h-5" />
          )}
        </Button>

        {/* Share Button */}
        <Button
          variant="outline"
          size="icon"
          disabled={!currentVideo}
          className="cursor-pointer"
          onClick={async () => {
            try {
              if (navigator.share) {
                await navigator.share({
                  title: "Manim Animation",
                  text: "Check out this animation I created!",
                  url: currentVideo.url,
                });
                toast.success("Video shared successfully!");
              } else {
                await navigator.clipboard.writeText(currentVideo.url);
                toast.success("Link copied to clipboard!");
              }
            } catch (err) {
              console.error("Share failed:", err);
              toast.error("Failed to share video.");
            }
          }}
        >
          <Share2 className="w-5 h-5" />
        </Button>
      </div>

      {/* Thumbnails */}
      <div className="px-6 pt-2 pb-6">
        <h2 className="text-sm font-semibold mb-3">Generated Animations</h2>
        {loading ? (
          <div className="flex gap-4 overflow-x-auto">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <Skeleton className="w-48 h-32 rounded-md" />
                <Skeleton className="w-24 h-4 rounded-sm" />
              </div>
            ))}
          </div>
        ) : videos.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto">
            {videos.map((vid, idx) => (
              <div
                key={vid._id || idx}
                className="flex flex-col items-center gap-2 cursor-pointer"
                onClick={() => setCurrentVideo(vid)}
              >
                <div
                  className={`w-48 h-32 rounded-lg overflow-hidden border border-black dark:border-gray-500 shadow-sm ${
                    currentVideo?.url === vid.url ? "" : ""
                  }`}
                >
                  <img
                    src={vid.thumbnail || "/placeholder.png"}
                    alt={`Video ${idx}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      setVideos(videos.filter((_, i) => i !== idx));
                    }}
                  />
                </div>
                <span className="text-xs text-muted-foreground truncate max-w-[10rem]">
                  {vid.title || `Scene ${idx + 1}`}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground text-sm px-2 py-4">
            No videos yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoSection;
