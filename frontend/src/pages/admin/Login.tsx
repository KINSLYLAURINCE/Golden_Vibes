/**
 * Page de connexion administration
 * -----------------------------------------
 * Formulaire de login sécurisé pour les administrateurs.
 * Redirige vers le tableau de bord après connexion.
 */

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Mail, Eye, EyeOff, ArrowLeft, Home } from "lucide-react";
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
  const handleSubmit = async (e: React.FormEvent) => {
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Éléments décoratifs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Bouton retour au site stylisé */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link
            to="/"
            className="group relative inline-flex items-center gap-3 px-5 py-2.5 bg-secondary/80 backdrop-blur-sm border border-border rounded-xl text-muted-foreground hover:text-foreground transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 overflow-hidden"
          >
            {/* Effet de brillance */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: 1,
              }}
            />
            
            {/* Icônes avec animation */}
            <motion.div
              className="relative flex items-center gap-2"
              whileHover={{ x: -2 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-300" />
              <Home size={18} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute left-6" />
            </motion.div>
            
            <span className="relative font-medium text-sm">
              Retour au site
            </span>

            {/* Tooltip moderne */}
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-card border border-border rounded-lg text-xs text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg">
              Accéder à la page d'accueil
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-card border-r border-b border-border rotate-45" />
            </span>
          </Link>
        </motion.div>

        {/* Carte de connexion avec effet de verre */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Bande décorative dorée */}
          <div className="h-1.5 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400" />

          {/* Logo et titre */}
          <div className="text-center pt-8 px-8">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="relative inline-block"
            >
              <img src={logo} alt="Golden Vibes" className="h-20 w-auto mx-auto mb-4 relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-yellow-500/20 blur-xl rounded-full" />
            </motion.div>

            <motion.h1 
              className="font-display text-2xl gold-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Administration
            </motion.h1>
            <motion.p 
              className="text-sm text-muted-foreground mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Connectez-vous pour accéder au panneau d'administration
            </motion.p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {erreur && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-destructive/10 border border-destructive/30 text-destructive text-sm p-3 rounded-lg flex items-center gap-2"
              >
                <Lock size={14} />
                {erreur}
              </motion.div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-2">
                Adresse email
              </label>
              <div className="relative group">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@goldenvibes.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-muted-foreground mb-2">
                Mot de passe
              </label>
              <div className="relative group">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-12 py-3 bg-secondary/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-secondary"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="rounded border-border bg-secondary/50 text-primary focus:ring-primary transition-all"
                />
                <span className="group-hover:text-foreground transition-colors">Se souvenir de moi</span>
              </label>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="relative w-full gold-gradient text-primary-foreground py-3.5 rounded-lg font-semibold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Effet de brillance */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{
                  x: ["-100%", "200%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatDelay: 1,
                }}
              />
              
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Connexion en cours...
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    Se connecter
                  </>
                )}
              </span>
            </motion.button>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-xs text-center text-muted-foreground mt-6"
        >
          &copy; {new Date().getFullYear()} Golden Vibes Events. Tous droits réservés.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;