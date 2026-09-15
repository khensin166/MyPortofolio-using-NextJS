import { motion } from "framer-motion";
import Image from "next/image";

interface Highlight {
  id: string;
  title: string;
  coverUrl: string;
  mediaCount: number;
}

interface InstagramHighlightsProps {
  highlights: Highlight[];
}

const InstagramHighlights = ({ highlights }: InstagramHighlightsProps) => {
  if (!highlights || highlights.length === 0) return null;

  return (
    <div className="w-full mt-6 mb-8">
      <div 
        className="flex w-full gap-4 overflow-x-auto pb-4 scrollbar-hide"
        style={{ WebkitOverflowScrolling: "touch", overscrollBehaviorX: "contain" }}
      >
        {highlights.map((highlight, index) => (
          <motion.div
            key={highlight.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex flex-col items-center gap-2 min-w-[72px] cursor-pointer group"
          >
            <div className="relative h-[72px] w-[72px] sm:h-[80px] sm:w-[80px] rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 to-fuchsia-600">
              <div className="h-full w-full rounded-full border-2 border-background bg-background overflow-hidden relative">
                <Image
                  src={highlight.coverUrl}
                  alt={highlight.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="80px"
                  unoptimized // We use unoptimized for external URLs or proxies
                />
              </div>
            </div>
            <span className="text-[11px] sm:text-xs font-medium text-foreground/80 truncate w-full text-center">
              {highlight.title}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default InstagramHighlights;
