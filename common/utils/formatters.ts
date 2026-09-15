/**
 * Converts a Google Drive share link to a direct image link.
 * Example: https://drive.google.com/file/d/1vN3pXQXzZ4NFX5iSBRvu5cb8VhJkbv3X/view
 * To: https://drive.google.com/thumbnail?id=1vN3pXQXzZ4NFX5iSBRvu5cb8VhJkbv3X&sz=w1000
 */
export const getDirectImageUrl = (url: string | undefined): string => {
  if (!url) return "";
  
  if (url.includes("drive.google.com")) {
    // Extract ID using regex
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
    }
  }
  
  return url;
};

/**
 * Compares two objects using JSON.stringify.
 * Useful for checking if form data has changed.
 */
export const isFormDirty = (currentData: any, originalData: any): boolean => {
  return JSON.stringify(currentData) !== JSON.stringify(originalData);
};
