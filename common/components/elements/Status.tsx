"use client";

import React from "react";
import { motion } from "framer-motion";
import RotatingText from "./RotatingText";

const Status = () => {
  return (
    <div className="flex items-center gap-2 rounded-full border border-yellow-400 bg-yellow-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-yellow-600 dark:text-yellow-400 lg:mt-2">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="h-2 w-2 rounded-full bg-yellow-400"
      />
      <RotatingText
        texts={["Hire Me", "Open to Work", "Let's Collaborate"]}
        mainClassName="overflow-hidden"
        staggerDuration={0.025}
        splitBy="characters"
        rotationInterval={3000}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "-120%", opacity: 0 }}
      />
    </div>
  );
};

export default Status;
