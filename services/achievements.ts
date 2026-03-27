import { getCertifications } from "@/services/portfolio";
import { AchievementItem } from "@/common/types/achievements";

export const getAchievementsData = async ({
  category,
  search,
}: {
  category?: string;
  search?: string;
} = {}) => {
  const certifications = await getCertifications();
  if (!certifications) return [];

  // Map certifications to AchievementItem
  const mappedData: AchievementItem[] = certifications.map((item: any) => ({
    id: item.id,
    credential_id: item.credentialId,
    name: item.title,
    issuing_organization: item.issuer,
    type: item.tags?.[0] || "Professional",
    category: item.categories?.[0] || "General",
    tags: item.tags || [],
    categories: item.categories || [],
    url_credential: item.credentialUrl,
    issue_date: item.issueDate ? `${item.issueDate}-01` : "",
    expiration_date: item.expirationDate ? `${item.expirationDate}-01` : "",
    image: item.imageLogo,
    is_show: true,
  }));

  // Apply filters
  let filtered = mappedData;
  if (category) {
    filtered = filtered.filter((item) => 
      item.categories?.includes(category) || item.category === category
    );
  }
  if (search) {
    filtered = filtered.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  return filtered;
};

export const getAchivementTypes = async () => {
  const certifications = await getCertifications();
  if (!certifications) return [];

  const types = new Set<string>();
  certifications.forEach((item: any) => {
    if (item.tags && item.tags.length > 0) {
      item.tags.forEach((tag: string) => types.add(tag));
    }
  });

  return Array.from(types);
};

export const getAchivementCategories = async () => {
  const certifications = await getCertifications();
  if (!certifications) return [];

  const categories = new Set<string>();
  certifications.forEach((item: any) => {
    if (item.categories && item.categories.length > 0) {
      item.categories.forEach((cat: string) => categories.add(cat));
    }
  });

  return Array.from(categories);
};
