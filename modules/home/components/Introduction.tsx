import { useTranslations } from "next-intl";
import Link from "next/link";
import { FiDownload as DownloadIcon } from "react-icons/fi";

interface IntroductionProps {
  resumeUrl?: string;
  heroDescription?: string;
  location?: string;
}

const Introduction = ({
  resumeUrl,
  heroDescription,
  location,
}: IntroductionProps) => {
  const t = useTranslations("HomePage");

  return (
    <section className="space-y-2 bg-cover bg-no-repeat">
      <div className="flex items-center justify-between text-3xl font-medium text-foreground">
        <h1>Hi, I'm Kenan</h1>
        {resumeUrl && (
          <Link href={resumeUrl} target="_blank" rel="noopener noreferrer">
            <button className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-all hover:bg-accent hover:text-accent-foreground">
              <DownloadIcon />
              <span>Resume</span>
            </button>
          </Link>
        )}
      </div>

      <div className="space-y-4">
        <ul className="ml-5 flex list-disc flex-col gap-x-10 gap-y-2 text-muted-foreground md:flex-row">
          <li>📍{location || t("location")}</li>
          <li>{t("location_type")}</li>
        </ul>
        <div className="mt-6 space-y-4 leading-7 text-foreground">
          {heroDescription || (
            <>
              <div>{t("resume.paragraph_1")}</div>
              <div>{t("resume.paragraph_2")}</div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Introduction;
