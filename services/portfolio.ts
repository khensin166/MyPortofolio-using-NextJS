const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://my-portofolio-backend.vercel.app/api';

export const fetchAPI = async (endpoint: string, tags: string[], revalidate = 3600) => {
  const url = `${API_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      next: { tags, revalidate }
    });
    if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return null;
  }
};

export const getLocalizedData = (data: any, locale: string): any => {
  if (!data) return data;
  if (Array.isArray(data)) {
    return data.map((item) => getLocalizedData(item, locale));
  }
  if (typeof data === "object") {
    // Check if it's a translation object using expected keys
    if ("en" in data && "id" in data) {
      return data[locale] || data.en;
    }
    // Deeply map nested objects
    const mapped: any = {};
    for (const key in data) {
      mapped[key] = getLocalizedData(data[key], locale);
    }
    return mapped;
  }
  return data;
};

export const getProfile = async (locale: string = "en") => {
  const data = await fetchAPI('/profile', ['profile'], 86400); 
  return getLocalizedData(data, locale);
};
export const getProjects = async (locale: string = "en") => {
  const url = `${API_URL}/projects`;
  try {
    // Use no-store so reactions counts are always fresh
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch /projects");
    const json = await res.json();
    return getLocalizedData(json.data, locale);
  } catch (error) {
    console.error("Error fetching /projects:", error);
    return null;
  }
};
export const getSkills = async (locale: string = "en") => {
  const data = await fetchAPI('/skills', ['skills']);
  return getLocalizedData(data, locale);
};
export const getExperiences = async (locale: string = "en") => {
  const data = await fetchAPI('/experiences', ['experiences']);
  return getLocalizedData(data, locale);
};
export const getEducation = async (locale: string = "en") => {
  const data = await fetchAPI('/education', ['education']);
  return getLocalizedData(data, locale);
};
export const getCertifications = async (locale: string = "en") => {
  const data = await fetchAPI('/certifications', ['certifications']);
  return getLocalizedData(data, locale);
};
export const getArticles = async (locale: string = "en") => {
  const data = await fetchAPI('/articles', ['articles']);
  return getLocalizedData(data, locale);
};
export const getArticleBySlug = async (slug: string, locale: string = "en") => {
  const data = await fetchAPI(`/articles/${slug}`, [`article-${slug}`]);
  return getLocalizedData(data, locale);
};

export const reactToProject = async (id: number, emoji: string) => {
  const url = `${API_URL}/projects/${id}/react`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: emoji })
  });
  return res.json();
};

export const submitContactMessage = async (body: { senderName: string, senderEmail: string, message: string }) => {
  const url = `${API_URL}/messages`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return res.json();
};
export const getInstagramData = async () => {
  const url = `${API_URL}/creations/instagram`;
  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer supersecretkey`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch /creations/instagram");
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("Error fetching /creations/instagram:", error);
    return null;
  }
};
