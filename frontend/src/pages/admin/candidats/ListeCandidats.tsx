/**
 * Liste des candidats (Admin)
 * -----------------------------------------
 * Tableau de gestion des candidats avec actions :
 * voir (modal), modifier, supprimer, activer/désactiver.
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Eye, Edit, Trash2, ToggleLeft, ToggleRight, Loader2,
  AlertCircle, CheckCircle, Info, X, ChevronLeft, ChevronRight,
  Heart, MapPin, Star, Trophy, User, Video, Crown
} from "lucide-react";

import { API_URL, getImageUrl } from "@/services/api";

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
  age?: number;
  ville?: string;
  talent?: string;
  description?: string;
}

interface AlertState {
  show: boolean;
  type: 'success' | 'error' | 'info';
  message: string;
}

// ─── Candidate Detail Modal ───────────────────────────────────────────────────
const CandidatModal = ({
  candidat,
  onClose,
}: {
  candidat: Candidat;
  onClose: () => void;
}) => {
  const [photoIdx, setPhotoIdx] = useState(0);
  const photos = [candidat.photo1, candidat.photo2]
    .filter(Boolean)
    .map((p) => getImageUrl(p)!)
    .filter(Boolean);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card border border-border rounded-2xl shadow-2xl"
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
        >
          {/* Header banner with photo */}
          <div className="relative h-56 sm:h-64 overflow-hidden rounded-t-2xl bg-secondary">
            {/* Blurred background fill */}
            {photos.length > 0 && (
              <img
                src={photos[photoIdx]}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover scale-110"
                style={{ filter: "blur(16px) brightness(0.5)", transform: "scale(1.2)" }}
              />
            )}
            {/* Main photo */}
            {photos.length > 0 ? (
              <img
                src={photos[photoIdx]}
                alt={candidat.nom}
                className="relative z-10 w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User size={64} className="text-muted-foreground/30" />
              </div>
            )}

            {/* Photo switcher dots */}
            {photos.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {photos.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPhotoIdx(i)}
                    className={`transition-all rounded-full ${
                      i === photoIdx
                        ? "w-6 h-2 bg-yellow-400"
                        : "w-2 h-2 bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Photo nav arrows */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={() => setPhotoIdx((p) => (p - 1 + photos.length) % photos.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft size={16} className="text-white" />
                </button>
                <button
                  onClick={() => setPhotoIdx((p) => (p + 1) % photos.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <ChevronRight size={16} className="text-white" />
                </button>
              </>
            )}

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              <X size={18} className="text-white" />
            </button>

            {/* Category badge */}
            <div className="absolute top-3 left-3 z-20">
              <span className="gold-gradient text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                {candidat.categorie === "miss" ? <Crown size={12} /> : <Trophy size={12} />}
                {candidat.categorie === "miss" ? "MISS" : "MASTER"}
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            {/* Name + number row */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="font-display text-2xl text-foreground leading-tight">{candidat.nom}</h2>
                {(candidat.age || candidat.ville) && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                    {candidat.ville && <><MapPin size={13} className="text-primary" /> {candidat.ville}</>}
                    {candidat.age && candidat.ville && <span className="mx-1">·</span>}
                    {candidat.age && <span>{candidat.age} ans</span>}
                  </p>
                )}
              </div>
              <span className="gold-gradient text-primary-foreground text-lg font-bold px-3 py-1 rounded-xl shadow shrink-0">
                #{candidat.numero}
              </span>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-secondary rounded-xl p-3 text-center">
                <Heart size={18} className="text-primary mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">{Number(candidat.votes_count ?? 0).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Votes</p>
              </div>
              <div className="bg-secondary rounded-xl p-3 text-center">
                <div className={`w-2.5 h-2.5 rounded-full mx-auto mb-1 mt-0.5 ${candidat.statut === "actif" ? "bg-amber-400" : "bg-red-400"}`} />
                <p className={`text-sm font-bold ${candidat.statut === "actif" ? "text-amber-400" : "text-red-400"}`}>
                  {candidat.statut === "actif" ? "Actif" : "Inactif"}
                </p>
                <p className="text-xs text-muted-foreground">Statut</p>
              </div>
              <div className="bg-secondary rounded-xl p-3 text-center">
                <Star size={18} className="text-primary mx-auto mb-1" />
                <p className="text-sm font-bold text-foreground capitalize">{candidat.categorie}</p>
                <p className="text-xs text-muted-foreground">Catégorie</p>
              </div>
            </div>

            {/* Talent */}
            {candidat.talent && (
              <div className="mb-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5">Talent</p>
                <span className="inline-flex items-center gap-1.5 text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-full">
                  <Star size={13} /> {candidat.talent}
                </span>
              </div>
            )}

            {/* Description */}
            {candidat.description && (
              <div className="mb-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5">À propos</p>
                <p className="text-sm text-muted-foreground leading-relaxed bg-secondary rounded-xl p-4">
                  {candidat.description}
                </p>
              </div>
            )}

            {/* Video */}
            {candidat.video && (
              <div className="mb-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1">
                  <Video size={13} /> Vidéo de présentation
                </p>
                <video
                  src={getImageUrl(candidat.video) || candidat.video}
                  controls
                  className="w-full rounded-xl border border-border"
                  style={{ maxHeight: "220px" }}
                />
              </div>
            )}

            {/* Footer actions */}
            <div className="flex gap-3 mt-6 pt-4 border-t border-border">
              <Link
                to={`/admin/candidats/modifier/${candidat.id}`}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 gold-gradient text-primary-foreground text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                <Edit size={16} /> Modifier
              </Link>
              <button
                onClick={onClose}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-secondary text-foreground text-sm font-medium rounded-xl hover:bg-secondary/80 transition-colors"
              >
                <X size={16} /> Fermer
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const ListeCandidats = () => {
  const [candidats, setCandidats] = useState<Candidat[]>([]);
  const [recherche, setRecherche] = useState("");
  const [filtre, setFiltre] = useState<"tous" | "miss" | "master">("tous");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [alert, setAlert] = useState<AlertState>({ show: false, type: "success", message: "" });
  const [selectedCandidat, setSelectedCandidat] = useState<Candidat | null>(null);

  const token = localStorage.getItem("token");

  const showAlert = (type: 'success' | 'error' | 'info', message: string) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: "success", message: "" }), 5000);
  };

  const fetchCandidats = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/admin/candidats`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
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

  useEffect(() => { fetchCandidats(); }, []);

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
        body: JSON.stringify({ statut: nouveauStatut }),
      });
      if (!response.ok) throw new Error('Erreur réseau');
      setCandidats((prev) =>
        prev.map((c) => (c.id === id ? { ...c, statut: nouveauStatut as 'actif' | 'inactif' } : c))
      );
      // Update modal if open
      setSelectedCandidat((prev) =>
        prev && prev.id === id ? { ...prev, statut: nouveauStatut as 'actif' | 'inactif' } : prev
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
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      if (!response.ok) throw new Error('Erreur réseau');
      setCandidats((prev) => prev.filter((c) => c.id !== id));
      if (selectedCandidat?.id === id) setSelectedCandidat(null);
      showAlert("success", "Candidat supprimé avec succès");
    } catch (err) {
      console.error("Erreur suppression:", err);
      showAlert("error", "Erreur lors de la suppression");
    }
  };

  const alertConfig = {
    success: {
      bgColor: "from-amber-500/20 via-yellow-500/20 to-amber-500/20",
      borderColor: "border-amber-500/30",
      textColor: "text-amber-400",
      glowColor: "shadow-amber-500/30",
      progressColor: "bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400",
    },
    error: {
      bgColor: "from-amber-600/20 via-yellow-600/20 to-amber-600/20",
      borderColor: "border-amber-600/30",
      textColor: "text-amber-500",
      glowColor: "shadow-amber-600/30",
      progressColor: "bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500",
    },
    info: {
      bgColor: "from-amber-400/20 via-yellow-400/20 to-amber-400/20",
      borderColor: "border-amber-400/30",
      textColor: "text-amber-300",
      glowColor: "shadow-amber-400/30",
      progressColor: "bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-300",
    },
  };

  return (
    <div className="relative">
      {/* ── Alert System ── */}
      <AnimatePresence>
        {alert.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4"
          >
            <motion.div
              className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${alertConfig[alert.type]?.bgColor} backdrop-blur-xl border ${alertConfig[alert.type]?.borderColor} shadow-2xl ${alertConfig[alert.type]?.glowColor}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="relative p-4">
                <div className="flex items-start gap-3">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"] }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    className="p-2 rounded-xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm"
                  >
                    {alert.type === "success" && <CheckCircle size={28} className="text-amber-400" />}
                    {alert.type === "error"   && <AlertCircle  size={28} className="text-amber-500" />}
                    {alert.type === "info"    && <Info         size={28} className="text-amber-300" />}
                  </motion.div>
                  <div className="flex-1">
                    <motion.h3
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                      className={`font-bold text-lg ${alertConfig[alert.type]?.textColor}`}
                    >
                      {alert.type === "success" && "Succès"}
                      {alert.type === "error"   && "Erreur"}
                      {alert.type === "info"    && "Information"}
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                      className="text-white/90 text-sm mt-0.5"
                    >
                      {alert.message}
                    </motion.p>
                    <motion.div
                      className="flex gap-1 mt-2"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                    >
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="h-1 w-8 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400"
                          animate={{ scaleY: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
                        />
                      ))}
                    </motion.div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
                    onClick={() => setAlert({ show: false, type: "success", message: "" })}
                    className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <X size={16} className="text-white/70" />
                  </motion.button>
                </div>
                <motion.div
                  initial={{ width: "100%" }} animate={{ width: "0%" }}
                  transition={{ duration: 5, ease: "linear" }}
                  className={`absolute bottom-0 left-0 h-1 ${alertConfig[alert.type]?.progressColor}`}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Candidate Detail Modal ── */}
      {selectedCandidat && (
        <CandidatModal
          candidat={selectedCandidat}
          onClose={() => setSelectedCandidat(null)}
        />
      )}

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl gold-text">Candidats</h1>
          <p className="text-muted-foreground text-sm">{filtres.length} candidat(s)</p>
        </div>
        <Link
          to="/admin/candidats/ajouter"
          className="gold-gradient text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wider flex items-center gap-2 hover:scale-105 transition-transform w-full sm:w-auto justify-center"
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

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
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
              className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-sm font-medium uppercase tracking-wider transition-all ${
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

      {/* ── Content ── */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
            <Loader2 size={32} className="text-primary" />
          </motion.div>
        </div>
      ) : filtres.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 text-muted-foreground"
        >
          Aucun candidat trouvé.
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl overflow-hidden"
        >
          {/* ── Mobile card layout ── */}
          <div className="block md:hidden">
            {filtres.map((c) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="border-b border-border last:border-0 p-4 hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-start gap-4 mb-3">
                  {/* Photo */}
                  <div className="shrink-0">
                    {getImageUrl(c.photo1) ? (
                      <motion.img
                        whileHover={{ scale: 1.1 }}
                        src={getImageUrl(c.photo1) || ""}
                        alt={c.nom}
                        className="w-16 h-16 rounded-lg object-cover cursor-pointer"
                        onClick={() => setSelectedCandidat(c)}
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-secondary border border-border flex items-center justify-center text-xs text-muted-foreground">
                        ?
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-medium text-foreground truncate">{c.nom}</h3>
                      <span className="gold-gradient text-primary-foreground px-2 py-0.5 rounded text-xs font-bold shrink-0">
                        #{c.numero}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="text-xs uppercase tracking-wider text-primary px-2 py-0.5 bg-primary/10 rounded-full">
                        {c.categorie}
                      </span>
                      <span className="text-xs text-primary font-bold px-2 py-0.5 bg-primary/10 rounded-full">
                        {c.votes_count ?? 0} votes
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        c.statut === "actif" ? "bg-amber-900/30 text-amber-400" : "bg-red-900/30 text-red-400"
                      }`}>
                        {c.statut === "actif" ? "Actif" : "Inactif"}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                  <motion.button
                    whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedCandidat(c)}
                    className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                    title="Voir"
                  >
                    <Eye size={18} />
                  </motion.button>
                  <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                    <Link
                      to={`/admin/candidats/modifier/${c.id}`}
                      className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors block"
                      title="Modifier"
                    >
                      <Edit size={18} />
                    </Link>
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                    onClick={() => toggleActif(c.id, c.statut)}
                    className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                    title="Activer/Désactiver"
                  >
                    {c.statut === "actif"
                      ? <ToggleRight size={18} className="text-amber-400" />
                      : <ToggleLeft  size={18} />
                    }
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                    onClick={() => supprimer(c.id)}
                    className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-destructive transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={18} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── Desktop table ── */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[800px]">
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
                          whileHover={{ scale: 1.15 }}
                          src={getImageUrl(c.photo1) || ""}
                          alt={c.nom}
                          className="w-10 h-10 rounded-lg object-cover cursor-pointer"
                          onClick={() => setSelectedCandidat(c)}
                          onError={(e) => { e.currentTarget.style.display = "none"; }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-secondary border border-border flex items-center justify-center text-xs text-muted-foreground">
                          ?
                        </div>
                      )}
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
                        {/* Eye → opens modal instead of navigating */}
                        <motion.button
                          whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                          onClick={() => setSelectedCandidat(c)}
                          className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                          title="Voir le profil"
                        >
                          <Eye size={16} />
                        </motion.button>
                        <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                          <Link
                            to={`/admin/candidats/modifier/${c.id}`}
                            className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors block"
                            title="Modifier"
                          >
                            <Edit size={16} />
                          </Link>
                        </motion.div>
                        <motion.button
                          whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                          onClick={() => toggleActif(c.id, c.statut)}
                          className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                          title="Activer/Désactiver"
                        >
                          {c.statut === "actif"
                            ? <ToggleRight size={16} className="text-amber-400" />
                            : <ToggleLeft  size={16} />
                          }
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
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
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ListeCandidats;