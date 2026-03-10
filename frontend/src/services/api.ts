

export const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:1002/api";

export const STORAGE_URL =
  import.meta.env.VITE_STORAGE_URL ?? "http://localhost:1002/storage";


export const getImageUrl = (image: string | null | undefined): string | null => {
  if (!image) return null;
  if (typeof image !== "string") return null;
  if (image.startsWith("http")) return image;
  return `${STORAGE_URL}/${image}`;
};

