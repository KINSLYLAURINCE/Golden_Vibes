/**
 * Page de connexion administration
 * -----------------------------------------
 * Formulaire de login sécurisé pour les administrateurs.
 * Redirige vers le tableau de bord après connexion.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import logo from "@/assets/logo-golden-vibes.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [erreur, setErreur] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  /* Soumission du formulaire */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      setErreur("Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <img src={logo} alt="Golden Vibes" className="h-20 w-auto mx-auto mb-4" />
          <h1 className="font-display text-2xl gold-text">Administration</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Connectez-vous pour accéder au panneau d'administration
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-8 space-y-5">
          {erreur && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm p-3 rounded-lg">
              {erreur}
            </div>
          )}

          <div>
            <label className="block text-sm text-muted-foreground mb-2">Adresse email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin2@goldenvibes.com"
                required
                className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">Mot de passe</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-12 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" className="rounded border-border" />
              Se souvenir de moi
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full gold-gradient text-primary-foreground py-3 rounded-lg font-semibold uppercase tracking-wider disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>

          <p className="text-xs text-center text-muted-foreground">
            Démo : admin2@goldenvibes.com / password
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;