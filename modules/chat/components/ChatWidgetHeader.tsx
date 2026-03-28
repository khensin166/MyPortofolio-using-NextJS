import { useRouter } from "next/navigation";
import { FiMinimize2 as MinimizeIcon } from "react-icons/fi";
import { HiOutlineLogout as SignOutIcon } from "react-icons/hi";
import { PiChatTeardropDotsBold as ChatRoomIcon } from "react-icons/pi";

import Tooltip from "@/common/components/elements/Tooltip";
import useChatStore from "@/common/stores/chat";
import { useTranslations } from "next-intl";

const ChatWidgetHeader = () => {
  const { toggleChat } = useChatStore();


  const t = useTranslations("ChatRoomPage.widget");

  const router = useRouter();

  const handleClick = () => {
    router.push("/chat");
    toggleChat();
  };

  return (
    <div className="flex items-center justify-between border-b border-border p-4">
      <div className="flex items-center gap-2">
        <Tooltip title={t("tooltip_title")}>
          <ChatRoomIcon
            size={22}
            onClick={handleClick}
            className="cursor-pointer transition duration-300 hover:scale-105 active:scale-95"
          />
        </Tooltip>
        <p className="font-medium">{t("title")}</p>
      </div>
      <div className="flex items-center gap-5">
        <Tooltip title={t("tooltip_minimize")}>
          <MinimizeIcon
            onClick={toggleChat}
            size={27}
            className="cursor-pointer rounded-lg bg-secondary p-1.5 transition duration-300 hover:scale-105 hover:bg-muted active:scale-95 text-foreground"
          />
        </Tooltip>

      </div>
    </div>
  );
};

export default ChatWidgetHeader;
