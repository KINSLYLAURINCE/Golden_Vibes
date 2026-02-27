/**
 * Service des votes
 * -----------------------------------------
 * Gère l'envoi de votes et la récupération
 * des statistiques de votes.
 */

import api from "./api";

/* Envoyer un vote (public) */
export const voter = async (data) => {
  // data : { candidat_id, nombre_votes, telephone, mode_paiement }
  const response = await api.post("/votes", data);
  return response.data;
};

/* Statistiques de votes (admin) */
export const getStatsVotes = async () => {
  const response = await api.get("/admin/stats/votes");
  return response.data;
};
