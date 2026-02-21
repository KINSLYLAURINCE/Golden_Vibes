/**
 * Configuration globale d'Axios
 * -----------------------------------------
 * Point d'entrée unique pour toutes les requêtes HTTP.
 * L'intercepteur ajoute automatiquement le jeton JWT
 * stocké dans le localStorage à chaque requête.
 */

import axios from "axios";

/* ---- Instance Axios ---- */
const api = axios.create({
  baseURL: "http://localhost:8000/api", // Changer en production
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/* ---- Intercepteur de requêtes : ajout du token ---- */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
