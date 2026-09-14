import { useEffect, useState } from "react";
import { useWindowSize } from "usehooks-ts";

const useIsMobile = () => {
  const { width } = useWindowSize();
  const [isMobile, setIsMobile] = useState(false); // Default false for SSR stability

  useEffect(() => {
    setIsMobile(width < 821);
  }, [width]);

  return isMobile;
};

export default useIsMobile;
