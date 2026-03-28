import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import Container from "@/common/components/elements/Container";
import Home from "@/modules/home";
import { METADATA } from "@/common/constants/metadata";
import { getSkills, getProfile } from "@/services/portfolio";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "HomePage" });

  return {
    title: `${METADATA.creator} | Portfolio`,
    description: t("resume.paragraph_1"),
    alternates: {
      canonical: `${process.env.DOMAIN}/${locale}`,
    },
    openGraph: {
      title: `${METADATA.creator} | Personal Website`,
      description: t("resume.paragraph_1"),
      url: `${process.env.DOMAIN}/${locale}`,
      siteName: METADATA.openGraph.siteName,
      locale: locale === "id" ? "id_ID" : "en_US",
      type: "website",
    },
  };
}

const HomePage = async ({ params }: HomePageProps) => {
  const { locale } = await params;
  
  // Fetch data in parallel
  const [skills, profile] = await Promise.all([
    getSkills(locale),
    getProfile(locale)
  ]);

  return (
    <Container data-aos="fade-up">
      <Home
        skills={skills || []}
        resumeUrl={profile?.resumeUrl}
        heroDescription={profile?.heroDescription}
        location={profile?.location}
      />
    </Container>
  );
};

export default HomePage;
