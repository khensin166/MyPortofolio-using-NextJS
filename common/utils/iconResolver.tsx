import * as SiIcons from "react-icons/si";
import * as BiIcons from "react-icons/bi";
import * as BsIcons from "react-icons/bs";
import * as TbIcons from "react-icons/tb";
import * as Fa6Icons from "react-icons/fa6";
import * as RiIcons from "react-icons/ri";
import * as DiIcons from "react-icons/di";
import * as AiIcons from "react-icons/ai";
import * as HiIcons from "react-icons/hi2";
import * as MdIcons from "react-icons/md";
import Image from "next/image";

// Map prefixes to their respective dynamic modules
const libraryMap: Record<string, Record<string, any>> = {
  Si: SiIcons,
  Bi: BiIcons,
  Bs: BsIcons,
  Tb: TbIcons,
  Fa: Fa6Icons,
  Ri: RiIcons,
  Di: DiIcons,
  Ai: AiIcons,
  Hi: HiIcons,
  Md: MdIcons,
};

export const IconResolver = ({ 
  iconNameOrUrl, 
  size = 24, 
  className 
}: { 
  iconNameOrUrl: string, 
  size?: number | string,
  className?: string 
}) => {
  // Check if it's a URL
  if (iconNameOrUrl.startsWith("http://") || iconNameOrUrl.startsWith("https://") || iconNameOrUrl.startsWith("/")) {
    return (
      <Image 
        src={iconNameOrUrl} 
        alt="Skill Icon" 
        width={typeof size === "number" ? size : 24} 
        height={typeof size === "number" ? size : 24} 
        className={className} 
      />
    );
  }

  // Otherwise, it's a react-icon name. Extract the prefix (first two characters)
  const prefix = iconNameOrUrl.substring(0, 2);
  const IconLibrary = libraryMap[prefix];

  if (!IconLibrary || !IconLibrary[iconNameOrUrl]) {
    // Fallback if library prefix is not found
    return <span className={className}></span>;
  }

  const IconComponent = IconLibrary[iconNameOrUrl];
  return <IconComponent size={size} className={className} />;
};

