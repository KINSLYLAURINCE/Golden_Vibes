/**
 * Configuration globale des URLs
 * -----------------------------------------
 * Utilise les variables d'environnement Vite.
 * À importer dans tous les fichiers à la place
 * des URLs hardcodées.
 */

export const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

export const STORAGE_URL =
  import.meta.env.VITE_STORAGE_URL ?? "http://localhost:8000/storage";

/**
 * Construit l'URL complète d'une image stockée.
 * Gère les cas null, undefined, objet, et URL absolue.
 */
export const getImageUrl = (image: string | null | undefined): string | null => {
  if (!image) return null;
  if (typeof image !== "string") return null;
  if (image.startsWith("http")) return image;
  return `${STORAGE_URL}/${image}`;
};

