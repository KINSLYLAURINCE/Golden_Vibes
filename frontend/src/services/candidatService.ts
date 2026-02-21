/**
 * Service des candidats
 * -----------------------------------------
 * Opérations CRUD sur les candidats (Miss / Master).
 */

import api from "./api";

/* Récupérer tous les candidats (public) */
export const getCandidats = async (categorie = "") => {
  const params = categorie ? { categorie } : {};
  const response = await api.get("/candidats", { params });
  return response.data;
};

/* Récupérer un candidat par son ID */
export const getCandidat = async (id) => {
  const response = await api.get(`/candidats/${id}`);
  return response.data;
};

/* ---- Admin ---- */

/* Récupérer la liste admin des candidats */
export const getAdminCandidats = async () => {
  const response = await api.get("/admin/candidats");
  return response.data;
};

/* Ajouter un nouveau candidat (FormData pour les fichiers) */
export const ajouterCandidat = async (formData) => {
  const response = await api.post("/admin/candidats", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

/* Modifier un candidat existant */
export const modifierCandidat = async (id, formData) => {
  const response = await api.post(`/admin/candidats/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

/* Supprimer un candidat */
export const supprimerCandidat = async (id) => {
  const response = await api.delete(`/admin/candidats/${id}`);
  return response.data;
};
