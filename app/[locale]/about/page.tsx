import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Container from "@/common/components/elements/Container";
import PageHeading from "@/common/components/elements/PageHeading";
import About from "@/modules/about";
import { METADATA } from "@/common/constants/metadata";
import { getExperiences, getEducation, getProfile } from "@/services/portfolio";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AboutPage" });
  return {
    title: `${t("title")} ${METADATA.exTitle}`,
    description: t("description"),
    alternates: { canonical: `${process.env.DOMAIN}/${locale}/about` },
  };
}

const AboutPage = async ({ params }: Props) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AboutPage" });

  // Fetch data dari Hono API secara paralel (Blazing Fast!)
  const [experiences, education, profile] = await Promise.all([
    getExperiences(locale),
    getEducation(locale),
    getProfile(locale),
  ]);

  return (
    <Container data-aos="fade-up">
      <PageHeading title={t("title")} description={t("description")} />
      <About 
        experiences={experiences} 
        education={education} 
        aboutMe={profile?.aboutMe || ""} 
      />
    </Container>
  );
};

export default AboutPage;
