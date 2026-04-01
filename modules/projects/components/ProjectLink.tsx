"use client";

import { useState } from "react";
import Link from "next/link";
import { IoClose as CloseIcon } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import Portal from "@/common/components/elements/Portal";
import { useTranslations } from "next-intl";
import { BsGithub as GithubIcon } from "react-icons/bs";
import { FiExternalLink as LinkIcon } from "react-icons/fi";

interface ProjectLinkProps {
  title?: string;
  link_github?: string;
  link_demo?: string;
}

interface LinkComponentProps {
  url?: string;
  text: string;
  icon: JSX.Element;
  onClick?: () => void;
}

const LinkComponent = ({ url, text, icon, onClick }: LinkComponentProps) => {
  const content = (
    <div className="flex items-center gap-2 font-medium text-foreground cursor-pointer">
      <i>{icon}</i>
      <p className="text-sm transition-all duration-300 text-primary hover:text-primary/80">
        {text}
      </p>
    </div>
  );

  if (onClick) {
    return <button onClick={onClick}>{content}</button>;
  }

  return (
    <Link href={url || "#"} target="_blank">
      {content}
    </Link>
  );
};

const ProjectLink = ({ title, link_github, link_demo }: ProjectLinkProps) => {
  const t = useTranslations("ProjectsPage");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isYouTube = link_demo && (link_demo.includes("youtu.be") || link_demo.includes("youtube.com"));
  const youtubeId = isYouTube ? link_demo.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)?.[1] : null;

  return (
    <div className="flex gap-4">
      {link_github ? (
        <LinkComponent
          url={link_github}
          text={t("source_code_text")}
          icon={<GithubIcon size={22} />}
        />
      ) : null}
      
      {link_github && link_demo && (
        <span className="text-muted-foreground">|</span>
      )}
      
      {link_demo && isYouTube ? (
        <LinkComponent
          text="Watch Demo"
          icon={<LinkIcon size={22} />}
          onClick={() => setIsModalOpen(true)}
        />
      ) : link_demo ? (
        <LinkComponent
          url={link_demo}
          text={t("live_demo_text")}
          icon={<LinkIcon size={22} />}
        />
      ) : null}

      <Portal>
        <AnimatePresence>
          {isModalOpen && youtubeId && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative z-10 w-full max-w-4xl aspect-video rounded-xl overflow-hidden bg-black shadow-2xl"
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute right-4 top-4 z-50 rounded-full bg-black/50 p-2 text-white hover:scale-110"
                >
                  <CloseIcon size={24} />
                </button>
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </Portal>
    </div>
  );
};

export default ProjectLink;
