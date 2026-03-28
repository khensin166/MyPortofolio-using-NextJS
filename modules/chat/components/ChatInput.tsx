import clsx from "clsx";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { FiSend as SendIcon } from "react-icons/fi";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { IoCloseCircle as CloseIcon } from "react-icons/io5";

import { ChatInputProps } from "@/common/types/chat";

interface ChatInputPropsNew extends ChatInputProps {
  replyName?: string;
  replyEmail?: string;
  isWidget?: boolean;
  onCancelReply: () => void;
}

const ChatInput = ({
  replyName,
  replyEmail,
  isWidget,
  onSendMessage,
  onCancelReply,
}: ChatInputPropsNew) => {
  const [message, setMessage] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const t = useTranslations("ChatRoomPage");
  const tContact = useTranslations("ContactPage.form");

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();

    if (isSending || !message.trim() || !senderName.trim() || !senderEmail.trim()) return;

    setIsSending(true);

    try {
      await onSendMessage(message, senderName, senderEmail);
      setMessage("");
      onCancelReply();
    } catch (error) {
      console.log(error);
    } finally {
      setIsSending(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  return (
    <>
      <form 
        onSubmit={handleSendMessage}
        className="flex flex-col gap-3 border-t border-border px-4 py-4"
      >
        {replyName && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex w-fit items-center gap-2 rounded-md bg-muted px-2 py-1 text-xs"
          >
            <span>Replying to {replyName}</span>
            <CloseIcon
              size={14}
              onClick={() => onCancelReply()}
              className="cursor-pointer"
            />
          </motion.div>
        )}
        
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            type="text"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            placeholder={tContact("input_name")}
            disabled={isSending}
            required
            className="w-full rounded-md border border-border bg-secondary p-2 text-sm focus:outline-none focus:border-primary transition-all duration-300 placeholder:text-muted-foreground"
          />
          <input
            type="email"
            value={senderEmail}
            onChange={(e) => setSenderEmail(e.target.value)}
            placeholder={tContact("input_email")}
            disabled={isSending}
            required
            className="w-full rounded-md border border-border bg-secondary p-2 text-sm focus:outline-none focus:border-primary transition-all duration-300 placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex">
          <input
            type="text"
            value={message}
            onChange={handleChange}
            placeholder={t("placeholder")}
            disabled={isSending}
            ref={inputRef}
            required
            className="flex-grow rounded-md border border-border bg-secondary p-2 text-sm focus:outline-none focus:border-primary transition-all duration-300"
          />
          <button
            type="submit"
            className={clsx(
              "ml-2 rounded-md bg-primary p-3 text-primary-foreground transition duration-300 hover:brightness-110 active:scale-90",
              (!message.trim() || !senderName.trim() || !senderEmail.trim() || isSending) &&
                "cursor-not-allowed !bg-muted opacity-50 active:scale-100",
            )}
            disabled={isSending || !message.trim() || !senderName.trim() || !senderEmail.trim()}
            data-umami-event="click_send_message"
          >
            <SendIcon size={18} />
          </button>
        </div>
      </form>
    </>
  );
};

export default ChatInput;
