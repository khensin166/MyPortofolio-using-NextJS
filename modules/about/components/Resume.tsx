import Link from "next/link";
import { useTranslations } from "next-intl";
import { LuDownload as DownloadIcon } from "react-icons/lu";

const Resume = () => {
  const t = useTranslations("AboutPage");

  const RESUME_URL = "https://drive.google.com/file/d/14iK4NXEGICwPoMtOLzr8hOSM_c7iWAUg/view";

  return (
    <Link
      href={RESUME_URL}
      target="_blank"
      passHref
      className="group flex w-fit items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 text-sm transition duration-300 text-foreground hover:bg-foreground hover:text-background"
      data-posthog-event="click_resume_download_button"
    >
      <DownloadIcon />
      <span>{t("resume_download_button")}</span>
    </Link>
  );
};

export default Resume;
