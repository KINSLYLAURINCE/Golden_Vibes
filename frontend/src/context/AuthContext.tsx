/**
 * Contexte d'authentification
 * -----------------------------------------
 * Fournit l'état d'authentification à toute l'application.
 * Gère le login, logout et la persistance du token.
 * Supporte le mode démo (sans backend).
 */

import { createContext, useContext, useState, useEffect } from "react";
import { login as loginAPI, logout as logoutAPI, getProfile } from "@/services/authService";

/* Création du contexte */
const AuthContext = createContext(null);

/* Hook personnalisé pour accéder au contexte */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth doit être utilisé dans un AuthProvider");
  return context;
};

/* Utilisateur démo par défaut */
const DEMO_USER = {
  id: 1,
  nom: "Admin",
  email: "admin@goldenvibes.com",
  role: "super_admin",
};

/* Fournisseur du contexte */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* Vérifier si un token existe au chargement */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      /* Mode démo : si le token est "demo-token", on utilise l'utilisateur démo */
      if (token === "demo-token") {
        setUser(DEMO_USER);
        setLoading(false);
        return;
      }
      /* Mode production : récupérer le profil depuis l'API */
      getProfile()
        .then((data) => setUser(data.user))
        .catch(() => localStorage.removeItem("token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  /* Connexion */
  const login = async (email, password) => {
    /* Mode démo */
    if (email === "admin@goldenvibes.com" && password === "admin123") {
      localStorage.setItem("token", "demo-token");
      setUser(DEMO_USER);
      return { token: "demo-token", user: DEMO_USER };
    }
    /* Mode production */
    const data = await loginAPI(email, password);
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data;
  };

  /* Déconnexion */
  const logout = async () => {
    const token = localStorage.getItem("token");
    if (token !== "demo-token") {
      await logoutAPI().catch(() => {});
    }
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
