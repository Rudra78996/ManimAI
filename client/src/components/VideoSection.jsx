import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Download, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import socket from "@/socket";

const backendURL = import.meta.env.VITE_BACKEND_URL;

const VideoSection = ({ chatId }) => {
  const { getToken } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState(null);
  const scrollRef = useRef(null);

  const isVideoUrl = (url) => {
    return (
      typeof url === 'string' &&
      (url.match(/\.(mp4|webm|mov)$/i) || url.includes('cloudinary.com') || url.includes('video'))
    );
  };

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
        setVideos(filtered);
        setCurrentVideo(filtered[0] || null);
      } catch (err) {
        setVideos([]);
        setCurrentVideo(null);
      }
      setLoading(false);
    };
    if (chatId) fetchVideos();
  }, [chatId]);

  useEffect(() => {
    socket.connect();
    const handleNewMessage = (msgs) => {
      msgs.forEach((msg) => {
        if (msg.type === "video" && isVideoUrl(msg.content)) {
          setVideos((prev) => {
            if (prev.some((v) => v.url === msg.content)) return prev;
            const newVid = { url: msg.content, _id: msg.content };
            return [newVid, ...prev];
          });
          setCurrentVideo((prev) => prev || { url: msg.content, _id: msg.content });
        }
      });
    };
    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [chatId]);

  const scroll = (offset) => {
    scrollRef.current?.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col h-full max-h-screen overflow-hidden">
      <div className="flex justify-center p-4 min-h-[220px]">
        {loading ? (
          <div className="w-full max-w-[90%]">
            <Skeleton className="w-full aspect-video h-56 mb-2" />
            <div className="text-center text-muted-foreground mt-2">Loading animation...</div>
          </div>
        ) : currentVideo ? (
          <video
            src={currentVideo.url}
            controls
            className="w-full max-w-[90%] rounded-lg border shadow border-gray-600"
            onError={e => {
              e.target.onerror = null;
              setCurrentVideo(null);
            }}
          />
        ) : (
          <div className="w-full max-w-[90%] flex flex-col items-center justify-center">
            <Skeleton className="w-full aspect-video h-56 mb-2" />
            <div className="text-center text-muted-foreground mt-2">No animations yet. Send a message to generate one!</div>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-4 pb-2">
        <Button variant="outline" size="icon" disabled={!currentVideo}>
          <Download className="w-5 h-5" />
        </Button>
        <Button variant="outline" size="icon" disabled={!currentVideo}>
          <Heart className="w-5 h-5" />
        </Button>
        <Button variant="outline" size="icon" disabled={!currentVideo}>
          <Share2 className="w-5 h-5" />
        </Button>
      </div>
      <div className="overflow-y-auto px-4 pb-4">
        <h2 className="text-sm font-semibold mb-2">Generated Animations</h2>
        <div className="relative py-1 border-b-2 border-t-2 border-foreground/10 min-h-[60px]">
          <button
            onClick={() => scroll(-300)}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-200 dark:bg-gray-700 rounded-full p-2 shadow-md dark:hover:bg-gray-500 hover:bg-gray-300"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div
            className="flex gap-2 overflow-x-auto scrollbar-hide"
            ref={scrollRef}
          >
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="w-40 h-24 rounded-md" />
              ))
            ) : videos.length > 0 ? (
              videos.map((vid, idx) => (
                <video
                  key={vid._id || idx}
                  src={vid.url}
                  className={`w-40 h-24 rounded-md border shadow-sm object-cover cursor-pointer border-gray-600 ${currentVideo && currentVideo.url === vid.url ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setCurrentVideo(vid)}
                  onError={e => { e.target.onerror = null; setVideos(videos.filter((v, i) => i !== idx)); }}
                />
              ))
            ) : (
              <div className="text-muted-foreground flex items-center h-24 px-4">No videos yet.</div>
            )}
          </div>
          <button
            onClick={() => scroll(300)}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-200 dark:bg-gray-700 rounded-full p-2 shadow-md dark:hover:bg-gray-500 hover:bg-gray-300"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <Button className="mt-4" disabled={videos.length === 0 || loading}>Merge Scene</Button>
      </div>
    </div>
  );
};
export default VideoSection;
