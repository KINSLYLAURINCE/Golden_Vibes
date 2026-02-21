/**
 * Service de contact
 * -----------------------------------------
 * Envoi de messages et gestion admin.
 */

import api from "./api";

/* Envoyer un message de contact (public) */
export const envoyerMessage = async (data) => {
  // data : { nom, prenom, email, telephone, objet, message }
  const response = await api.post("/contact", data);
  return response.data;
};

/* ---- Admin ---- */

/* Récupérer tous les messages */
export const getMessages = async () => {
  const response = await api.get("/admin/messages");
  return response.data;
};

/* Marquer un message comme lu */
export const marquerLu = async (id) => {
  const response = await api.put(`/admin/messages/${id}/lire`);
  return response.data;
};

/* Supprimer un message */
export const supprimerMessage = async (id) => {
  const response = await api.delete(`/admin/messages/${id}`);
  return response.data;
};
