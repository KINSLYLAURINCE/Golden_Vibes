/**
 * Contexte d'authentification
 * -----------------------------------------
 * Fournit l'état d'authentification à toute l'application.
 * Gère le login, logout et la persistance du token.
 * Connecté au backend Laravel.
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

/* Fournisseur du contexte */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* Vérifier si un token existe au chargement */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      getProfile()
        .then((data) => {
          setUser(data.user || data);
        })
        .catch((error) => {
          console.error("Erreur récupération profil:", error);
          localStorage.removeItem("token");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  /* Connexion */
  const login = async (email, password) => {
    try {
      const data = await loginAPI(email, password);

      if (data.token) {
        localStorage.setItem("token", data.token);
        setUser(data.user);
        return data;
      } else {
        throw new Error("Token manquant dans la réponse");
      }
    } catch (error) {
      console.error("Erreur login:", error);
      throw error;
    }
  };

  /* Déconnexion */
  const logout = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        await logoutAPI();
      } catch (error) {
        console.error("Erreur logout API:", error);
      }
    }

    localStorage.removeItem("token");
    setUser(null);
  };

  /* Rafraîchir le profil utilisateur */
  const refreshProfile = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const data = await getProfile();
        setUser(data.user || data);
      } catch (error) {
        console.error("Erreur refresh profile:", error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      refreshProfile,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;