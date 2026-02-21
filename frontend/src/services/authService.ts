/**
 * Service d'authentification
 * -----------------------------------------
 * Gère la connexion, la déconnexion et
 * la vérification du statut d'authentification.
 */

import api from "./api";

/* Connexion administrateur */
export const login = async (email, password) => {
  const response = await api.post("/login", { email, password });
  return response.data; // { token, user }
};

/* Déconnexion */
export const logout = async () => {
  const response = await api.post("/logout");
  localStorage.removeItem("token");
  return response.data;
};

/* Récupérer l'utilisateur connecté */
export const getProfile = async () => {
  const response = await api.get("/profile");
  return response.data;
};
