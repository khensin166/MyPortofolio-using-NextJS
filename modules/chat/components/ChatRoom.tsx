"use client";

import useSWR from "swr";
import axios from "axios";
import { useEffect, useState } from "react";

import ChatInput from "./ChatInput";
import ChatList from "./ChatList";
import ChatItemSkeleton from "./ChatItemSkeleton";

import { MessageProps } from "@/common/types/chat";
import { fetcher } from "@/services/fetcher";
import useNotif from "@/hooks/useNotif";

const BACKEND_CHAT_API = process.env.NEXT_PUBLIC_API_URL + "/messages";

export const ChatRoom = ({ isWidget = false }: { isWidget?: boolean }) => {
  // Fetch messages from Hono backend with Bearer token
  const { data, isLoading, error, mutate } = useSWR(BACKEND_CHAT_API, (url: string) =>
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer supersecretkey`,
        },
      })
      .then((res) => res.data),
  );

  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [isReply, setIsReply] = useState({
    is_reply: false,
    name: "",
    email: "",
  });

  const notif = useNotif();

  const handleClickReply = (name: string, email: string) => {
    setIsReply({ is_reply: true, name, email });
  };

  const handleCancelReply = () => {
    setIsReply({ is_reply: false, name: "", email: "" });
  };

  const handleSendMessage = async (message: string, senderName: string, senderEmail: string) => {
    const newMessageData = {
      senderName,
      senderEmail,
      message,
    };

    try {
      await axios.post(BACKEND_CHAT_API, newMessageData, {
        headers: {
          Authorization: `Bearer supersecretkey`,
        },
      });
      notif("Successfully to send message");
      mutate(); // Refresh messages
      handleCancelReply();
    } catch (err) {
      console.error("Error:", err);
      notif("Failed to send message");
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      await axios.delete(`${BACKEND_CHAT_API}/${id}`, {
        headers: {
          Authorization: `Bearer supersecretkey`,
        },
      });
      notif("Successfully to delete message");
      mutate();
    } catch (err) {
      notif("Failed to delete message");
    }
  };

  useEffect(() => {
    if (error) console.error("ChatRoom SWR Error:", error);
    if (data) {
      const rawMessages = Array.isArray(data) ? data : data.data || [];
      setMessages(rawMessages);
    }
  }, [data, error]);

  const filteredMessages = Array.isArray(messages)
    ? messages.map((msg: any) => ({
        ...msg,
        id: msg.id || msg._id || Math.random().toString(),
        name: msg.name || msg.senderName || "Anonymous",
        email: msg.email || msg.senderEmail || "",
        message: msg.message || "",
        created_at: msg.created_at || msg.createdAt || msg.timestamp || new Date().toISOString(),
      }))
    : [];

  return (
    <>
      {isLoading ? (
        <ChatItemSkeleton />
      ) : (
        <ChatList
          messages={filteredMessages}
          onDeleteMessage={handleDeleteMessage}
          onClickReply={handleClickReply}
          isWidget={isWidget}
        />
      )}
      <ChatInput
        onSendMessage={handleSendMessage}
        onCancelReply={handleCancelReply}
        replyName={isReply.name}
        replyEmail={isReply.email}
        isWidget={isWidget}
      />
    </>
  );
};
