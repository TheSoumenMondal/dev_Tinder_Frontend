"use client";

import ChatApi from "@/apis/chat-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/utils/axios-instance";
import { createSocketConnection } from "@/utils/socket";
import { useUserStore } from "@/utils/store";
import { IconSend2 } from "@tabler/icons-react";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type Message = {
  id: string;
  sender?: string;
  firstName?: string;
  text: string;
  createdAt?: string;
};

const Page: React.FC = () => {
  const { id: targetUserId } = useParams();
  const { user } = useUserStore();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const socketRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const initialLoadRef = useRef(true);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const createdAt = new Date().toISOString();
    const optimistic: Message = {
      id: `${createdAt}-${Math.random().toString(36).slice(2, 7)}`,
      sender: user?._id,
      firstName: user?.firstName,
      text: input,
      createdAt,
    };

    setMessages((prev) => [...prev, optimistic]);
    setInput("");
    scrollToBottom("smooth");

    if (!socketRef.current) {
      toast.error("Not connected");
      return;
    }

    socketRef.current.emit("sendMessage", {
      targetUserId,
      currentUserId: user?._id,
      firstName: user?.firstName,
      text: optimistic.text,
      createdAt: optimistic.createdAt,
    });
  };

  const fetchChats = async () => {
    try {
      const res = await axiosInstance.get(
        `${ChatApi.fetchChats}/${targetUserId}`
      );
      const chatData = res.data?.data;
      if (chatData?.messages && Array.isArray(chatData.messages)) {
        const mapped: Message[] = chatData.messages.map(
          (m: any, i: number) => ({
            id: m._id || `${m.createdAt || i}-${i}`,
            sender: m.sender,
            firstName: m.firstName,
            text: m.text,
            createdAt: m.createdAt,
          })
        );

        mapped.sort((a, b) =>
          (a.createdAt || "").localeCompare(b.createdAt || "")
        );
        setMessages(mapped);
      }
    } catch (err: any) {
      toast.error("Failed to load chats: " + (err?.message || err));
    }
  };

  useEffect(() => {
    if (!targetUserId) return;
    fetchChats();
  }, [targetUserId]);

  useEffect(() => {
    if (!targetUserId || !user?._id) return;

    const socket = createSocketConnection();
    socketRef.current = socket;

    socket.emit("joinChat", { targetUserId, currentUserId: user._id });

    socket.on("receiveMessage", (payload: any) => {
      const { senderId, firstName, text, createdAt, _id } = payload || {};

      if (senderId === user._id) return;

      const incoming: Message = {
        id: _id || `${createdAt}-${Math.random().toString(36).slice(2, 7)}`,
        sender: senderId,
        firstName,
        text,
        createdAt,
      };

      setMessages((prev) => {
        const exists = prev.some(
          (m) =>
            m.id === incoming.id ||
            (m.createdAt === incoming.createdAt && m.text === incoming.text)
        );
        if (exists) return prev;
        return [...prev, incoming];
      });

      initialLoadRef.current = false;
      setTimeout(() => scrollToBottom("smooth"), 50);
    });

    socket.on("connect_error", (err: any) => {
      toast.error("Socket connection failed: " + err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [targetUserId, user?._id]);

  useEffect(() => {
    const behavior = initialLoadRef.current ? "auto" : "smooth";
    scrollToBottom(behavior as ScrollBehavior);
    initialLoadRef.current = false;
  }, [messages]);

  return (
    <div className="max-w-4xl mx-auto px-4 relative h-screen flex flex-col pt-20 min-h-0">
      <div
        className="flex-1 overflow-y-auto p-4 rounded-lg space-y-3 min-h-0"
        role="log"
        aria-live="polite"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded-lg max-w-[70%] break-words ${
              msg.sender === user?._id
                ? "border bg-green-700 ml-auto px-4 text-right"
                : "bg-stone-900 px-3"
            }`}
            title={msg.createdAt}
          >
            {msg.firstName && (
              <div className="text-xs font-semibold">{msg.firstName}</div>
            )}
            <p className="text-sm">{msg.text}</p>
            {msg.createdAt && (
              <div className="text-xs opacity-70 mt-1">
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2 mt-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type your message..."
          className="placeholder:text-xs"
        />
        <Button
          className="rounded-md flex items-center gap-2"
          size="sm"
          onClick={handleSend}
        >
          Send <IconSend2 size={16} />
        </Button>
      </div>
    </div>
  );
};

export default Page;
