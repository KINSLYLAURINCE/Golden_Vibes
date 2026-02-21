/**
 * Service des événements annexes
 * -----------------------------------------
 * Opérations CRUD sur les événements.
 */

import api from "./api";

/* Récupérer les événements (public) */
export const getEvenements = async () => {
  const response = await api.get("/evenements");
  return response.data;
};

/* ---- Admin ---- */

export const getAdminEvenements = async () => {
  const response = await api.get("/admin/evenements");
  return response.data;
};

export const ajouterEvenement = async (formData) => {
  const response = await api.post("/admin/evenements", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const modifierEvenement = async (id, formData) => {
  const response = await api.put(`/admin/evenements/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const supprimerEvenement = async (id) => {
  const response = await api.delete(`/admin/evenements/${id}`);
  return response.data;
};
