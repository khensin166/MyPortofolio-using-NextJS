import { useTranslations } from "next-intl";

const Copyright = () => {
  const t = useTranslations("Footer");

  return (
    <div className="flex flex-wrap items-center justify-center gap-1 text-center text-sm text-muted-foreground">
      <p>{t("copyright_1")}</p>
      <span>{new Date().getFullYear()}</span>
      <p>{t("copyright_2")}</p>
    </div>
  );
};

export default Copyright;
