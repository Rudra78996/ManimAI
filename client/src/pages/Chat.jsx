import React, { useState, useRef, useEffect } from "react";
import AppSidebar from "@/components/SideBar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { PageNotFound } from "./PageNotFound";
const backendURL = import.meta.env.VITE_BACKEND_URL;
import ChatNavbar from "@/components/ChatNavbar";
import MessageSection from "@/components/MessageSection";
import VideoSection from "@/components/VideoSection";
import socket from "@/socket";

const SIDEBAR_WIDTH = 256; // 16rem
const SIDEBAR_MIN_WIDTH = 48; // 3rem (for button)

const Chat = () => {
  const { chatId } = useParams();
  const [isValid, setIsValid] = useState(true);
  const { getToken } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const isValidChat = async () => {
      try {
        const token = await getToken();
        await axios.post(
          backendURL + "/api/chat/is",
          { chatId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsValid(true);
      } catch (err) {
        setIsValid(false);
      }
    };
    const fetchChatsHistory = async () => {
      try {
        const token = await getToken();
        const { data } = await axios.get(backendURL + "/api/chat/all-chats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChats(data);
      } catch (err) {
        console.log(err);
      }
    };
    
    isValidChat();
    fetchChatsHistory();
    socket.connect();
    return () => socket.disconnect();
  }, []);

  if (!isValid) return <PageNotFound />;

  return (
    <div className="h-screen w-screen flex">
      {/* Sidebar always rendered, width depends on open state */}
      <div
        style={{
          width: sidebarOpen ? SIDEBAR_WIDTH : SIDEBAR_MIN_WIDTH,
          minWidth: sidebarOpen ? SIDEBAR_WIDTH : SIDEBAR_MIN_WIDTH,
          transition:
            "width 0.35s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          position: "relative",
          overflow: "hidden",
        }}
        className="h-full border-r-2 border-foreground/10"
      >
        <AppSidebar
          isOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen((v) => !v)}
          chats = {chats}
        />
      </div>
      <div className="h-screen flex-1">
        {/* navbar */}
        <ChatNavbar />
        <div className="flex w-full h-[93%]">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={50} className="">
              <MessageSection chatId={chatId} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel
              defaultSize={50}
              className="hidden md:block border-l-2 border-foreground/10"
            >
              <VideoSection chatId={chatId} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  );
};

export default Chat;
