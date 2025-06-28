import {
  Plus,
  Search,
  BookOpen,
  Bot,
  Blocks,
  MessageSquare,
  Zap,
  ChevronRight,
  X as LucideX,
  SquarePlay,
} from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
const backendURL = import.meta.env.VITE_BACKEND_URL;
import axios from "axios";

const AppSidebar = ({ isOpen, toggleSidebar, chats }) => {
  const navigate = useNavigate();
  const { getToken, isSignedIn } = useAuth();
  const { theme } = useTheme();
  const [query, setQuery] = useState("");
  const createGroup = async () => {
    if (!isSignedIn) {
      navigate("/sign-in");
      return;
    }
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
      navigate(`/chat/${res.data.chatId}`);
      return;
    } catch (e) {
      console.log(e);
    }
  };
  if (!isOpen) {
    return (
      <div className="flex flex-col h-screen w-0 min-w-0 relative border-r-2 border-foreground/10">
        <Button
          variant="outline"
          size="icon"
          className="fixed left-2 top-2 z-20 bg-muted text-foreground  shadow rotate-180 p-1"
          onClick={toggleSidebar}
          aria-label="Open sidebar"
          style={{
            outline: "none",
            width: 32,
            height: 32,
            minWidth: 32,
            minHeight: 32,
          }}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col h-screen w-64 border-r transition-colors duration-300 bg-sidebar text-sidebar-foreground border-sidebar ml-0 relative `}
      style={{ minWidth: "16rem", width: "16rem", overflow: "auto" }}
    >
      {/* Sidebar Header with close button inline */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-sidebar">
        <div className="p-2 rounded-lg bg-sidebar-accent">
          <Bot className="w-5 h-5 text-sidebar-accent-foreground" />
        </div>
        <h1 className="text-xl font-semibold text-sidebar-foreground flex-1">
          ManimAI
        </h1>
        <Button
          variant="outline"
          size="icon"
          className="bg-muted text-foreground border-muted-foreground shadow p-1 ml-2"
          onClick={toggleSidebar}
          aria-label="Close sidebar"
          style={{
            outline: "none",
            width: 32,
            height: 32,
            minWidth: 32,
            minHeight: 32,
          }}
        >
          <LucideX className="w-4 h-4" />
        </Button>
      </div>
      {/* Action Buttons */}
      <div className="px-3 py-4 space-y-2">
        <Button
          className="w-full flex items-center gap-3"
          size="default"
          onClick={createGroup}
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search chats"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-sidebar bg-background text-sidebar-foreground focus:ring-2 focus:ring-sidebar-ring outline-none transition-all placeholder:text-muted-foreground"
            onChange={(e) => setQuery(e.target.value.toLowerCase())}
          />
        </div>
      </div>
      {/* Navigation */}
      <nav className="px-2 py-2">
        {[{ icon: <SquarePlay className="w-4 h-4" />, label: "Media" }].map(
          (item, index) => (
            <motion.a
              key={index}
              whileHover={{ x: 2 }}
              href="/media"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
>
              {item.icon}
              {item.label}
            </motion.a>
          )
        )}
      </nav>
      {/* Recent Chats Header */}
      <div className="px-4 pt-4 pb-2 sticky top-0 z-10 bg-sidebar">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Recent Chats
        </h2>
      </div>
      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
        {chats
          .filter((e) => {
            return e.topic.toLowerCase().includes(query);
          })
          .map((chat, index) => (
            <motion.a
              key={index}
              onClick={() => navigate(`/chat/${chat.chatId}`)}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="block px-3 py-2.5 rounded-lg text-sm transition-colors text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="flex-shrink-0 w-4 h-4 text-muted-foreground" />
                <span className="truncate">{chat.topic}</span>
              </div>
            </motion.a>
          ))}
      </div>
      {/* Status Bar */}
      <div className="px-4 py-3 border-t border-sidebar backdrop-blur-sm bg-sidebar">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Zap className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
          </motion.div>
          <span>Generating... 1/2</span>
        </div>
      </div>
    </div>
  );
};

export default AppSidebar;
