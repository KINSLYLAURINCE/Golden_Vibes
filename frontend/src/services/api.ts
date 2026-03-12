

export const API_URL =
  import.meta.env.VITE_API_URL ?? "https://api.goldenvibes-event.com/api";

export const STORAGE_URL =
  import.meta.env.VITE_STORAGE_URL ?? "https://api.goldenvibes-event.com/storage";


export const getImageUrl = (image: string | null | undefined): string | null => {
  if (!image) return null;
  if (typeof image !== "string") return null;
  if (image.startsWith("http")) return image;
  return `${STORAGE_URL}/${image}`;
};

