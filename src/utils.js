export const getImageUrl = (path) => {
  if (path && (path.startsWith("http://") || path.startsWith("https://"))) {
    return path;
  }
  return `/assets/${path}`;
};
