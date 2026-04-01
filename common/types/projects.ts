export type ProjectItem = {
  id: number;
  title: string;
  overview?: string;
  description?: string | string[];
  features?: string[];
  imageSrc: string;
  tags: string[];
  demoUrl?: string | null;
  sourceUrl?: string | null;
  isFeatured: boolean;
  type?: string | string[];
  category?: string | string[];
  reactions?: Record<string, number>;
  createdAt?: string;
};

export type ProjectItemProps = {
  projects: ProjectItem[];
}
