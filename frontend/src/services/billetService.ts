/**
 * Service de billetterie
 * -----------------------------------------
 * Gère les packs de billets, les achats
 * et les statistiques de ventes.
 */

import api from "./api";

/* Récupérer les packs disponibles (public) */
export const getPacks = async () => {
  const response = await api.get("/packs");
  return response.data;
};

/* Acheter un billet (public) */
export const acheterBillet = async (data) => {
  // data : { pack_id, quantite, nom, email, telephone, mode_paiement }
  const response = await api.post("/billets", data);
  return response.data;
};

/* ---- Admin ---- */

/* Récupérer tous les packs (admin) */
export const getAdminPacks = async () => {
  const response = await api.get("/admin/packs");
  return response.data;
};

/* Créer un nouveau pack */
export const creerPack = async (data) => {
  const response = await api.post("/admin/packs", data);
  return response.data;
};

/* Modifier un pack */
export const modifierPack = async (id, data) => {
  const response = await api.put(`/admin/packs/${id}`, data);
  return response.data;
};

/* Récupérer les ventes de billets */
export const getVentes = async () => {
  const response = await api.get("/admin/billets");
  return response.data;
};
