"use client";

import dynamic from "next/dynamic";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

import ChatButton from "../../../modules/chat/components/ChatButton";

import Sidebar from "./sidebar";
import Topbar from "./topbar";
import { useLayoutStore } from "../../stores/layout";

const Notif = dynamic(() => import("../elements/Notif"), { ssr: false });

interface LayoutsProps {
  children: React.ReactNode;
}

const Layouts = ({ children }: LayoutsProps) => {
  const pathname = usePathname();
  const { layoutMode } = useLayoutStore();

  const isShowChatButton = pathname !== "/chat";

  useEffect(() => {
    AOS.init({
      duration: 800,
      delay: 50,
    });
  }, []);

  const isSidebar = layoutMode === "sidebar";

  return (
    <div className="mx-auto max-w-7xl lg:px-12">
      <div
        className={cn(
          "mx-auto flex flex-col transition-all duration-300 lg:py-4",
          isSidebar ? "lg:flex-row lg:gap-5" : "flex-col gap-5",
        )}
      >
        {isSidebar ? <Sidebar /> : <Topbar />}
        <main
          className={cn(
            "transition-all duration-300",
            isSidebar ? "max-w-[854px] lg:w-4/5 pt-8 lg:pt-0 px-4 lg:px-0" : "w-full",
          )}
        >
          {children}
        </main>
      </div>
      <Notif />
      {isShowChatButton && <ChatButton />}
    </div>
  );
};

const cn = (...classes: (string | undefined | null | boolean)[]) =>
  classes.filter(Boolean).join(" ");

export default Layouts;
