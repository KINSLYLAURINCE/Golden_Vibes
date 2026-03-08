/**
 * Liste des candidats (Admin)
 * -----------------------------------------
 * Tableau de gestion des candidats avec actions :
 * voir, modifier, supprimer, activer/désactiver.
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Search, Eye, Edit, Trash2, ToggleLeft, ToggleRight, Loader2,
  AlertCircle, CheckCircle, Info, X
} from "lucide-react";

import { API_URL, STORAGE_URL, getImageUrl } from "@/services/api";

interface Candidat {
  id: number;
  numero: number;
  nom: string;
  categorie: 'miss' | 'master';
  photo1?: string;
  photo2?: string;
  video?: string;
  votes_count: number;
  statut: 'actif' | 'inactif';
}

interface AlertState {
  show: boolean;
  type: 'success' | 'error' | 'info';
  message: string;
}

const ListeCandidats = () => {
  const [candidats, setCandidats] = useState<Candidat[]>([]);
  const [recherche, setRecherche] = useState("");
  const [filtre, setFiltre] = useState<"tous" | "miss" | "master">("tous");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [alert, setAlert] = useState<AlertState>({ show: false, type: "success", message: "" });

  const token = localStorage.getItem("token");

  const showAlert = (type: 'success' | 'error' | 'info', message: string) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: "success", message: "" });
    }, 5000);
  };

  const fetchCandidats = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/admin/candidats`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      
      if (!response.ok) throw new Error('Erreur réseau');
      
      const data = await response.json();
      setCandidats(data.data || data);
    } catch (err) {
      console.error("Erreur chargement candidats:", err);
      setError("Impossible de charger les candidats.");
      showAlert("error", "Échec du chargement des candidats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidats();
  }, []);

  const filtres = candidats
    .filter((c) => filtre === "tous" || c.categorie === filtre)
    .filter(
      (c) =>
        c.nom.toLowerCase().includes(recherche.toLowerCase()) ||
        String(c.numero).includes(recherche)
    );

  const toggleActif = async (id: number, statutActuel: string) => {
    const nouveauStatut = statutActuel === "actif" ? "inactif" : "actif";
    try {
      const response = await fetch(`${API_URL}/admin/candidats/${id}/statut`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: "application/json",
        },
        body: JSON.stringify({ statut: nouveauStatut })
      });

      if (!response.ok) throw new Error('Erreur réseau');

      setCandidats((prev) =>
        prev.map((c) => (c.id === id ? { ...c, statut: nouveauStatut as 'actif' | 'inactif' } : c))
      );
      showAlert("success", `Candidat ${nouveauStatut === "actif" ? "activé" : "désactivé"} avec succès`);
    } catch (err) {
      console.error("Erreur toggle statut:", err);
      showAlert("error", "Erreur lors du changement de statut");
    }
  };

  const supprimer = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce candidat ?")) return;
    try {
      const response = await fetch(`${API_URL}/admin/candidats/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error('Erreur réseau');

      setCandidats((prev) => prev.filter((c) => c.id !== id));
      showAlert("success", "Candidat supprimé avec succès");
    } catch (err) {
      console.error("Erreur suppression:", err);
      showAlert("error", "Erreur lors de la suppression");
    }
  };

  // Configuration des types d'alertes
  const alertConfig = {
    success: {
      icon: CheckCircle,
      bgColor: "from-amber-500/20 via-yellow-500/20 to-amber-500/20",
      borderColor: "border-amber-500/30",
      textColor: "text-amber-400",
      glowColor: "shadow-amber-500/30",
      progressColor: "bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400"
    },
    error: {
      icon: AlertCircle,
      bgColor: "from-amber-600/20 via-yellow-600/20 to-amber-600/20",
      borderColor: "border-amber-600/30",
      textColor: "text-amber-500",
      glowColor: "shadow-amber-600/30",
      progressColor: "bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500"
    },
    info: {
      icon: Info,
      bgColor: "from-amber-400/20 via-yellow-400/20 to-amber-400/20",
      borderColor: "border-amber-400/30",
      textColor: "text-amber-300",
      glowColor: "shadow-amber-400/30",
      progressColor: "bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-300"
    }
  };

  return (
    <div className="relative">
      {/* Alert System Or */}
      <AnimatePresence>
        {alert.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ 
              type: "spring",
              stiffness: 400,
              damping: 25
            }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4"
          >
            <motion.div
              className={`
                relative overflow-hidden rounded-xl
                bg-gradient-to-r ${alertConfig[alert.type]?.bgColor}
                backdrop-blur-xl border ${alertConfig[alert.type]?.borderColor}
                shadow-2xl ${alertConfig[alert.type]?.glowColor}
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Effet de brillance dorée */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{
                  x: ["-100%", "200%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <div className="relative p-4">
                <div className="flex items-start gap-3">
                  {/* Icône avec animation dorée */}
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    className={`p-2 rounded-xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm`}
                  >
                    {alert.type === "success" && <CheckCircle size={28} className="text-amber-400" />}
                    {alert.type === "error" && <AlertCircle size={28} className="text-amber-500" />}
                    {alert.type === "info" && <Info size={28} className="text-amber-300" />}
                  </motion.div>

                  {/* Contenu */}
                  <div className="flex-1">
                    <motion.h3 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`font-bold text-lg ${alertConfig[alert.type]?.textColor}`}
                    >
                      {alert.type === "success" && "Succès"}
                      {alert.type === "error" && "Erreur"}
                      {alert.type === "info" && "Information"}
                    </motion.h3>
                    
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="text-white/90 text-sm mt-0.5"
                    >
                      {alert.message}
                    </motion.p>

                    {/* Indicateur doré */}
                    <motion.div 
                      className="flex gap-1 mt-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="h-1 w-8 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400"
                          animate={{
                            scaleY: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: "easeInOut"
                          }}
                        />
                      ))}
                    </motion.div>
                  </div>

                  {/* Bouton fermer */}
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setAlert({ show: false, type: "success", message: "" })}
                    className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <X size={16} className="text-white/70" />
                  </motion.button>
                </div>

                {/* Barre de progression dorée */}
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 5, ease: "linear" }}
                  className={`absolute bottom-0 left-0 h-1 ${alertConfig[alert.type]?.progressColor}`}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl gold-text">Candidats</h1>
          <p className="text-muted-foreground text-sm">{filtres.length} candidat(s)</p>
        </div>
        <Link
          to="/admin/candidats/ajouter"
          className="gold-gradient text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wider flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <Plus size={18} /> Ajouter
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
          {error}
          <button onClick={fetchCandidats} className="ml-3 underline text-sm">Réessayer</button>
        </div>
      )}

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher par nom ou numéro..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex gap-2">
          {(["tous", "miss", "master"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFiltre(f)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium uppercase tracking-wider transition-all ${
                filtre === f
                  ? "gold-gradient text-primary-foreground scale-105 shadow-lg"
                  : "bg-secondary text-muted-foreground hover:text-foreground hover:scale-105"
              }`}
            >
              {f === "tous" ? "Tous" : f === "miss" ? "Miss" : "Master"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 size={32} className="text-primary" />
          </motion.div>
        </div>
      ) : filtres.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 text-muted-foreground"
        >
          Aucun candidat trouvé.
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl overflow-hidden"
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Photo</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">N°</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Nom</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Catégorie</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Votes</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Statut</th>
                <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtres.map((c) => (
                <motion.tr
                  key={c.id}
                  className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.002, backgroundColor: "rgba(255,215,0,0.02)" }}
                >
                  <td className="px-4 py-3">
                    {getImageUrl(c.photo1) ? (
                      <motion.img
                        whileHover={{ scale: 1.2 }}
                        src={getImageUrl(c.photo1) || ''}
                        alt={c.nom}
                        className="w-10 h-10 rounded-lg object-cover cursor-pointer"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            const placeholder = parent.querySelector('.photo-placeholder');
                            if (placeholder) {
                              (placeholder as HTMLElement).style.display = 'flex';
                            }
                          }
                        }}
                      />
                    ) : null}
                    <div
                      className="photo-placeholder w-10 h-10 rounded-lg bg-secondary border border-border items-center justify-center text-xs text-muted-foreground"
                      style={{ display: !getImageUrl(c.photo1) ? 'flex' : 'none' }}
                    >
                      ?
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <motion.span 
                      whileHover={{ scale: 1.2 }}
                      className="gold-gradient text-primary-foreground px-2 py-0.5 rounded text-xs font-bold inline-block"
                    >
                      {c.numero}
                    </motion.span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{c.nom}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs uppercase tracking-wider text-primary">{c.categorie}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-primary font-bold">{c.votes_count ?? 0}</td>
                  <td className="px-4 py-3">
                    <motion.span 
                      animate={c.statut === "actif" ? { 
                        boxShadow: ["0 0 0 0 rgba(245,158,11,0.4)", "0 0 0 10px rgba(245,158,11,0)"]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`text-xs px-2 py-1 rounded inline-block ${
                        c.statut === "actif" ? "bg-amber-900/30 text-amber-400" : "bg-red-900/30 text-red-400"
                      }`}
                    >
                      {c.statut === "actif" ? "Actif" : "Inactif"}
                    </motion.span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                        <Link to={`/candidats/${c.id}`} className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors block" title="Voir">
                          <Eye size={16} />
                        </Link>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                        <Link to={`/admin/candidats/modifier/${c.id}`} className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors block" title="Modifier">
                          <Edit size={16} />
                        </Link>
                      </motion.div>
                      <motion.button 
                        whileHover={{ scale: 1.2 }} 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleActif(c.id, c.statut)} 
                        className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors" 
                        title="Activer/Désactiver"
                      >
                        {c.statut === "actif" ? <ToggleRight size={16} className="text-amber-400" /> : <ToggleLeft size={16} />}
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.2 }} 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => supprimer(c.id)} 
                        className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-destructive transition-colors" 
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
};

export default ListeCandidats;