"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SiTiktok as TiktokIcon, SiInstagram as InstagramIcon } from "react-icons/si";

import Container from "@/common/components/elements/Container";
import PageHeading from "@/common/components/elements/PageHeading";
import Tiktok from "@/modules/contents/Tiktok";
import Instagram from "@/modules/contents/Instagram";

const ContentsPage = () => {
  const t = useTranslations("ContentsPage");
  const [activeTab, setActiveTab] = useState<"tiktok" | "instagram">("instagram");

  return (
    <Container data-aos="fade-up">
      <PageHeading title={t("title")} description={t("description")} />

      <div className="mb-8 flex gap-4 p-1 rounded-xl bg-secondary overflow-hidden transition-colors duration-300">
        <button
          onClick={() => setActiveTab("tiktok")}
          className={`flex items-center justify-center gap-2 flex-1 py-3 rounded-lg transition-all duration-300 ${
            activeTab === "tiktok"
              ? "bg-primary text-primary-foreground shadow-lg scale-[1.02]"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <TiktokIcon size={18} />
          <span className="font-medium">TikTok</span>
        </button>
        <button
          onClick={() => setActiveTab("instagram")}
          className={`flex items-center justify-center gap-2 flex-1 py-3 rounded-lg transition-all duration-300 ${
            activeTab === "instagram"
              ? "bg-primary text-primary-foreground shadow-lg scale-[1.02]"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          }`}
        >
          <InstagramIcon size={18} />
          <span className="font-medium">Instagram</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "tiktok" ? <Tiktok /> : <Instagram />}
        </motion.div>
      </AnimatePresence>
    </Container>
  );
};

export default ContentsPage;
