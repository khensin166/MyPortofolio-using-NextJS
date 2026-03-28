"use client";

import Link from "next/link";
import { MdVerified as VerifiedIcon } from "react-icons/md";
import { HiOutlineViewList } from "react-icons/hi";

import { useLayoutStore } from "@/common/stores/layout";
import Image from "../../elements/Image";
import Tooltip from "../../elements/Tooltip";
import ThemeToggle from "../sidebar/ThemeToggle";
import IntlToggle from "../sidebar/IntlToggle";
import Status from "../../elements/Status";

const TopbarProfile = () => {
  const { toggleLayoutMode } = useLayoutStore();

  return (
    <div className="flex items-center justify-between w-full px-4 py-3 bg-card border-b border-border">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/images/kenan.jpeg"
            width={40}
            height={40}
            alt="Kenan"
            className="border-2 border-border transition-transform group-hover:scale-110"
            rounded="rounded-full"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <h2 className="text-sm font-bold">Kenan Tomfie Bukit</h2>
              <VerifiedIcon size={14} className="text-blue-400" />
            </div>
            <span className="text-[10px] text-muted-foreground">@kenan_bukit</span>
          </div>
        </Link>
        <div className="hidden sm:block ml-4">
          <Status />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-4 border-r border-neutral-200 dark:border-neutral-800 pr-4 mr-1">
            <IntlToggle />
            <ThemeToggle />
        </div>
        
        <Tooltip title="Switch to Sidebar">
          <button
            onClick={toggleLayoutMode}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card p-2 shadow-sm transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <HiOutlineViewList size={20} className="text-muted-foreground" />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default TopbarProfile;
