import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CopyIcon,
  ExternalLinkIcon,
  Loader2Icon,
  CheckIcon,
} from "lucide-react";
import SendIcon from "@/assets/send.svg?react";
import UserIcon from "@/assets/user.svg?react";
import BotIcon from "@/assets/bot.svg?react";
import socket from "@/socket";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Skeleton } from "@/components/ui/skeleton";

const MessageSection = ({ chatId }) => {
  const [isFetching, setIsFetching] = useState(true);

  const { getToken, userId } = useAuth();
  const endRef = useRef();
  const [messages, setMessages] = useState([]);
  const [current, setCurrent] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);

  useEffect(() => {
    socket.connect();
    socket.on("newMessage", (msgs) => {
      setMessages((prev) => {
        const prevWithoutLoading = prev.filter((msg) => msg.type !== "loading");
        return [...prevWithoutLoading, ...msgs];
      });
      if (msgs.some((msg) => msg.role === "AI" && msg.type !== "loading")) {
        setLoading(false);
      }
    });
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      setIsFetching(true);
      const token = await getToken();
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat/all-messages`,
        { chatId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(data);
      setIsFetching(false);
    };
    fetchMessages();
  }, [chatId]);
  const send = async (e) => {
    e.preventDefault();
    if (!current.trim() || loading) return;
    setLoading(true);
    socket.emit("userMessage", { currentMessage: current, userId, chatId });
    setCurrent("");
  };

  return (
    <>
      <div className="h-[92%] text-center p-1.5">
        <div className="flex h-full w-full flex-col gap-12 overflow-y-auto p-4 scrollbar-hide">
          {isFetching ? (
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-${
                  msg.role === "AI" ? "start" : "end"
                } w-full`}
              >
                <div
                  className={`flex items-start gap-3 ${
                    msg.role === "AI" ? "self-start" : "self-end"
                  }`}
                >
                  <div className="pt-1">
                    {msg.role === "AI" ? (
                      <BotIcon className="w-6 h-6" />
                    ) : (
                      <UserIcon className="w-6 h-6" />
                    )}
                  </div>
                  <div className="bg-gray-100 dark:bg-zinc-800 dark:text-gray-100 rounded-xl px-4 py-2 text-sm max-w-[75%] text-left relative group break-words whitespace-pre-line">
                    {msg.type === "loading" ? (
                      <div className="flex items-center gap-2 animate-pulse">
                        <Loader2Icon className="animate-spin" />
                        <span>
                          ⏳ Generating your animation... Please wait for the
                          magic!
                        </span>
                      </div>
                    ) : (
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={endRef} />
        </div>
      </div>
      <form
        className="flex justify-center items-center gap-2 px-4 pb-2"
        onSubmit={send}
      >
        <Input
          type="text"
          placeholder="Ask anything to animate"
          className="flex-1"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          disabled={loading}
        />
        <Button disabled={loading} type="submit">
          {loading ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <SendIcon className="w-4 h-4" />
          )}
        </Button>
      </form>
    </>
  );
};

export default MessageSection;
