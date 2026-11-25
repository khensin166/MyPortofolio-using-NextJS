"use client";

import axios from "axios";
import { useState } from "react";

import ChatInput from "./ChatInput";
import ChatList from "./ChatList";
import ChatItemSkeleton from "./ChatItemSkeleton";

import { MessageProps } from "@/common/types/chat";
import useNotif from "@/hooks/useNotif";

const PUBLIC_MESSAGES_API = "/api/public/messages";

export const ChatRoom = ({ isWidget = false }: { isWidget?: boolean }) => {
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const isLoading = false;
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
      await axios.post(PUBLIC_MESSAGES_API, newMessageData);
      notif("Successfully to send message");
      handleCancelReply();
    } catch (err) {
      console.error("Error:", err);
      notif("Failed to send message");
    }
  };

  const handleDeleteMessage = async (_id: string) => {
    notif("Deleting messages is only available from the Admin Dashboard");
  };

  const filteredMessages = Array.isArray(messages)
    ? messages.map((msg: any) => ({
        ...msg,
        id: msg.id || msg._id || Math.random().toString(),
        name: msg.name || msg.senderName || "Anonymous",
        email: msg.email || msg.senderEmail || "",
        message: msg.message || "",
        created_at: msg.created_at || msg.createdAt || msg.receivedAt || msg.timestamp || new Date().toISOString(),
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
