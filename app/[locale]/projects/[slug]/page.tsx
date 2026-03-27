import { Metadata } from "next";

import BackButton from "@/common/components/elements/BackButton";
import Container from "@/common/components/elements/Container";
import PageHeading from "@/common/components/elements/PageHeading";
import ProjectDetail from "@/modules/projects/components/ProjectDetail";
import { ProjectItem } from "@/common/types/projects";
import { METADATA } from "@/common/constants/metadata";
import { loadMdxFiles } from "@/common/libs/mdx";
import { getProjects } from "@/services/portfolio";

interface ProjectDetailPageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

const getProjectDetail = async (slug: string, locale: string): Promise<ProjectItem | null> => {
  const projects = await getProjects(locale);
  if (!projects || projects.length === 0) return null;
  
  const project = projects.find((p: ProjectItem) => 
    p.title.toLowerCase().replace(/\s+/g, '-') === slug
  );

  if (!project) return null;

  const contents = loadMdxFiles();
  const content = contents.find((item) => item.slug === slug);
  const response = { ...project, content: content?.content };
  return JSON.parse(JSON.stringify(response));
};

export const generateMetadata = async ({
  params,
}: ProjectDetailPageProps): Promise<Metadata> => {
  const { slug, locale } = await params;
  const project = await getProjectDetail(slug, locale);

  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.title} ${METADATA.exTitle}`,
    description: project.description,
    openGraph: {
      images: project.imageSrc, // Use imageSrc for the API
      url: `${METADATA.openGraph.url}/${slug}`,
      siteName: METADATA.openGraph.siteName,
      locale: locale === "id" ? "id_ID" : "en_US",
      type: "article",
      authors: [METADATA.creator],
    },
    keywords: project.title,
    alternates: {
      canonical: `${process.env.DOMAIN}/${locale}/projects/${slug}`,
    },
  };
};

const ProjectDetailPage = async ({ params }: ProjectDetailPageProps) => {
  const { slug, locale } = await params;
  const data = await getProjectDetail(slug, locale);

  if (!data) return <Container>Project not found.</Container>;

  return (
    <Container data-aos="fade-up">
      <BackButton url="/projects" />
      <PageHeading title={data.title} description={data.description} />
      <ProjectDetail {...data} />
    </Container>
  );
};

export default ProjectDetailPage;
