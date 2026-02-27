/**
 * Service des partenaires
 * -----------------------------------------
 * Opérations CRUD sur les partenaires.
 */

import api from "./api";

/* Récupérer les partenaires (public) */
export const getPartenaires = async () => {
  const response = await api.get("/partenaires");
  return response.data;
};

/* ---- Admin ---- */

export const getAdminPartenaires = async () => {
  const response = await api.get("/admin/partenaires");
  return response.data;
};

export const ajouterPartenaire = async (formData) => {
  const response = await api.post("/admin/partenaires", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const modifierPartenaire = async (id, formData) => {
  const response = await api.put(`/admin/partenaires/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const supprimerPartenaire = async (id) => {
  const response = await api.delete(`/admin/partenaires/${id}`);
  return response.data;
};
