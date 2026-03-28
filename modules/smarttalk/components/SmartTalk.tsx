import Container from "@/common/components/elements/Container";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";

const SmartTalk = () => {
  const t = useTranslations("NotFoundPage");

  return (
    <Container
      data-aos="fade-up"
      className="flex h-full flex-col items-center justify-center gap-y-4  transition-all duration-300"
    >
      <h1 className="text-center text-6xl font-semibold text-foreground">
        Coming Soon
      </h1>
      <p className="text-sm text-muted-foreground">
        {t("title")}
      </p>
      <Link
        href="/"
        className="rounded-full border border-border px-4 py-2 text-sm hover:bg-foreground hover:text-background transition-colors duration-300"
      >
        {t("button")}
      </Link>
    </Container>
  );
};

export default SmartTalk;
