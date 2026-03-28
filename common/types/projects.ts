export type ProjectItem = {
  id: number;
  title: string;
  overview?: string;
  description: string;
  imageSrc: string;
  tags: string[];
  demoUrl?: string | null;
  sourceUrl?: string | null;
  isFeatured: boolean;
  type?: string;
  category?: string;
  reactions?: Record<string, number>;
  createdAt?: string;
};

export type ProjectItemProps = {
  projects: ProjectItem[];
}
