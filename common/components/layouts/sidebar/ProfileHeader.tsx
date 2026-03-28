import Link from "next/link";
import { MdVerified as VerifiedIcon } from "react-icons/md";

import { HiOutlineViewBoards } from "react-icons/hi";

import ThemeToggle from "./ThemeToggle";
import IntlToggle from "./IntlToggle";
import Tooltip from "../../elements/Tooltip";
import Image from "../../elements/Image";
import Status from "../../elements/Status";

import cn from "@/common/libs/clsxm";
import { useLayoutStore } from "@/common/stores/layout";

interface ProfileHeaderProps {
  expandMenu: boolean;
  imageSize: number;
}

const ProfileHeader = ({ expandMenu, imageSize }: ProfileHeaderProps) => {
  const { toggleLayoutMode } = useLayoutStore();

  return (
    <div
      className={cn(
        "flex w-full flex-grow items-center gap-4 lg:flex-col lg:gap-0.5",
        expandMenu && "flex-col !items-start",
      )}
    >
      <Image
        src={"/images/kenan.jpeg"}
        width={expandMenu ? 80 : imageSize * 1}
        height={expandMenu ? 80 : imageSize * 1}
        alt="Kenan Tomfie Bukit"
        className="border-2 border-border lg:hover:scale-105"
        rounded="rounded-full"
      />

      <div className="mt-1 flex items-center gap-2 lg:mt-4">
        <Link href="/" passHref>
          <h2 className="flex-grow text-lg font-medium lg:text-xl">
            Kenan Tomfie Bukit
          </h2>
        </Link>

        <Tooltip title="Verified">
          <VerifiedIcon size={18} className="text-blue-400" />
        </Tooltip>
      </div>

      <div className="hidden text-sm text-muted-foreground transition-all duration-300 hover:text-foreground lg:flex">
        @kenan_bukit
      </div>

      <div className="hidden lg:flex">
        <Status />
      </div>

      <div className="hidden justify-between gap-6 lg:mt-4 lg:flex">
        <IntlToggle />
        <ThemeToggle />
        <Tooltip title="Switch to Topbar">
          <button
            onClick={toggleLayoutMode}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card p-2 shadow-sm transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <HiOutlineViewBoards size={20} className="text-muted-foreground" />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default ProfileHeader;
