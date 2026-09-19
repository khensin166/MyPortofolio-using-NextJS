import { getCertifications } from "@/services/portfolio";
import { AchievementItem } from "@/common/types/achievements";

/**
 * Standarisasi format tanggal dari berbagai sumber (Admin Panel, data lama, null).
 * Output: string ISO "YYYY-MM-DD" atau string kosong "" jika tidak valid.
 */
const formatAchievementDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "";
  const str = dateStr.toString().trim();

  // Tolak kata-kata tidak valid dari data lama di database
  const invalidWords = ["nothing", "present", "invalid", "null", "n/a"];
  if (invalidWords.some((word) => str.toLowerCase().includes(word))) return "";

  // Jika sudah berformat YYYY-MM-DD atau lebih panjang, ambil 10 karakter pertama
  if (str.length >= 10) return str.substring(0, 10);

  // Jika berformat YYYY-MM (7 karakter), tambahkan -01
  if (str.length === 7) return `${str}-01`;

  return "";
};

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
    issue_date: formatAchievementDate(item.issueDate),
    expiration_date: formatAchievementDate(item.expirationDate),
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
