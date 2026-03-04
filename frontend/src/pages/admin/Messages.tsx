/**
 * Gestion des messages de contact (Admin)
 * -----------------------------------------
 * Affiche tous les types de messages :
 *  - Contact classique (candidature, info, reclamation, autre)
 *  - Demandes de partenariat (objet = "partenariat")
 * Compatible avec la table `messages` Laravel.
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, MailOpen, Trash2, Search, Reply,
  Loader2, RefreshCw, Inbox, X,
  ChevronDown, CheckCheck, Handshake,
  User, Building2
} from "lucide-react";
import axios from "axios";

const API_URL = "http://localhost:1002/api";

// ── Labels & couleurs par objet ───────────────────────────────────────────────
const OBJETS_LABELS = {
  candidature: "Candidature",
  partenariat: "Partenariat",
  info:        "Information",
  reclamation: "Réclamation",
  autre:       "Autre",
};

const OBJETS_COLORS = {
  candidature: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  partenariat: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  info:        "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  reclamation: "text-red-400 bg-red-400/10 border-red-400/20",
  autre:       "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmtDate = (d) => {
  if (!d) return "";
  try {
    const dt = new Date(d);
    return (
      dt.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }) +
      " · " +
      dt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    );
  } catch {
    return d.slice(0, 16).replace("T", " ");
  }
};

const fmtDay = (d) => {
  if (!d) return "";
  try {
    const dt  = new Date(d);
    const now = new Date();
    const diff = Math.floor((now - dt) / 86400000);
    if (diff === 0) return "Aujourd'hui";
    if (diff === 1) return "Hier";
    return dt.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
  } catch {
    return d.slice(0, 10);
  }
};

/**
 * Pour les demandes de partenariat, le champ `nom` = nom de l'entreprise.
 * Le nom du contact est stocké dans le message sous "Contact : Prénom Nom\n\n<message>".
 * Cette fonction sépare les deux parties.
 */
const parsePartenaireMessage = (message = "") => {
  const lines   = message.split("\n");
  const contact = lines.find((l) => l.startsWith("Contact :"));
  const corps   = lines.filter((l) => !l.startsWith("Contact :")).join("\n").trim();
  return {
    contact: contact ? contact.replace("Contact :", "").trim() : null,
    corps,
  };
};

// ── Badge objet ───────────────────────────────────────────────────────────────
const ObjetBadge = ({ objet, size = "sm" }) => {
  const cls = OBJETS_COLORS[objet] ?? "text-muted-foreground bg-secondary border-border";
  const isPartenariat = objet === "partenariat";
  return (
    <span
      className={`inline-flex items-center gap-1 border rounded-full font-medium ${
        size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-3 py-1"
      } ${cls}`}
    >
      {isPartenariat && <Handshake size={size === "sm" ? 10 : 12} />}
      {OBJETS_LABELS[objet] ?? objet}
    </span>
  );
};

// ── Composant principal ───────────────────────────────────────────────────────
const Messages = () => {
  const [messages,     setMessages]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [refreshing,   setRefreshing]   = useState(false);
  const [selected,     setSelected]     = useState(null);
  const [recherche,    setRecherche]    = useState("");
  const [filtreObjet,  setFiltreObjet]  = useState("tous");
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [deleting,     setDeleting]     = useState(false);

  const token = localStorage.getItem("token");
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept:        "application/json",
    },
  };

  // ── Chargement ──────────────────────────────────────────────────────────────
  const fetchMessages = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else         setRefreshing(true);
    try {
      const response = await axios.get(`${API_URL}/admin/messages`, axiosConfig);
      const data = response.data?.data ?? response.data;
      const sorted = [...(Array.isArray(data) ? data : [])].sort((a, b) => {
        if (a.statut !== b.statut) return a.statut === "non_lu" ? -1 : 1;
        return new Date(b.created_at) - new Date(a.created_at);
      });
      setMessages(sorted);
    } catch (err) {
      console.error("Erreur chargement messages:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  // ── Stats ───────────────────────────────────────────────────────────────────
  const nonLus         = messages.filter((m) => m.statut === "non_lu").length;
  const total          = messages.length;
  const nbPartenariats = messages.filter((m) => m.objet === "partenariat").length;

  // ── Filtres ─────────────────────────────────────────────────────────────────
  const filtres = messages
    .filter((m) => filtreObjet  === "tous" || m.objet  === filtreObjet)
    .filter((m) => filtreStatut === "tous" || m.statut === filtreStatut)
    .filter((m) => {
      if (!recherche) return true;
      const q = recherche.toLowerCase();
      return (
        (m.nom       ?? "").toLowerCase().includes(q) ||
        (m.email     ?? "").toLowerCase().includes(q) ||
        (m.message   ?? "").toLowerCase().includes(q) ||
        (m.telephone ?? "").toLowerCase().includes(q)
      );
    });

  const hasFilters = filtreObjet !== "tous" || filtreStatut !== "tous" || recherche;

  const resetFilters = () => {
    setFiltreObjet("tous");
    setFiltreStatut("tous");
    setRecherche("");
  };

  // ── Actions ──────────────────────────────────────────────────────────────────

  const marquerLu = async (id) => {
    const msg = messages.find((m) => m.id === id);
    if (!msg || msg.statut === "lu") return;
    try {
      await axios.put(`${API_URL}/admin/messages/${id}/lire`, {}, axiosConfig);
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, statut: "lu" } : m)));
    } catch (err) {
      console.error("Erreur marquer lu:", err);
    }
  };

  const marquerTousLus = async () => {
    const ids = messages.filter((m) => m.statut === "non_lu").map((m) => m.id);
    if (!ids.length) return;
    try {
      await Promise.all(ids.map((id) =>
        axios.put(`${API_URL}/admin/messages/${id}/lire`, {}, axiosConfig)
      ));
      setMessages((prev) => prev.map((m) => ({ ...m, statut: "lu" })));
      if (selected) setSelected((s) => ({ ...s, statut: "lu" }));
    } catch (err) {
      console.error("Erreur marquer tous lus:", err);
    }
  };

  const supprimer = async (id) => {
    if (!window.confirm("Supprimer ce message définitivement ?")) return;
    setDeleting(true);
    try {
      await axios.delete(`${API_URL}/admin/messages/${id}`, axiosConfig);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (err) {
      console.error("Erreur suppression:", err);
      alert("Erreur lors de la suppression.");
    } finally {
      setDeleting(false);
    }
  };

  const ouvrir = (msg) => {
    marquerLu(msg.id);
    setSelected({ ...msg, statut: "lu" });
  };

  const repondre = (email, objet, nom) => {
    const sujet = objet === "partenariat"
      ? `Re: Demande de partenariat – ${nom}`
      : `Re: ${OBJETS_LABELS[objet] ?? objet}`;
    window.open(`mailto:${email}?subject=${encodeURIComponent(sujet)}`, "_blank");
  };

  // ── Panneau détail ───────────────────────────────────────────────────────────
  const renderDetail = () => {
    if (!selected) return null;
    const isPartenariat = selected.objet === "partenariat";
    const { contact, corps } = isPartenariat
      ? parsePartenaireMessage(selected.message)
      : { contact: null, corps: selected.message };

    return (
      <motion.div
        key={selected.id}
        className="bg-card border border-border rounded-xl p-6 flex flex-col"
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 12 }}
        transition={{ duration: 0.2 }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <ObjetBadge objet={selected.objet} size="md" />
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSelected(null)}
              className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors"
              title="Fermer"
            >
              <X size={15} />
            </button>
            <button
              onClick={() => supprimer(selected.id)}
              disabled={deleting}
              className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-destructive transition-colors"
              title="Supprimer"
            >
              {deleting
                ? <Loader2 size={15} className="animate-spin" />
                : <Trash2  size={15} />
              }
            </button>
          </div>
        </div>

        {/* Infos expéditeur */}
        <div className="mb-5 space-y-1.5">
          {/* Nom principal */}
          <div className="flex items-center gap-2">
            {isPartenariat
              ? <Building2 size={16} className="text-amber-400 shrink-0" />
              : <User      size={16} className="text-primary shrink-0" />
            }
            <h2 className="font-display text-xl text-foreground leading-tight">{selected.nom}</h2>
          </div>

          {/* Nom du contact (partenariat uniquement) */}
          {isPartenariat && contact && (
            <div className="flex items-center gap-2 pl-6">
              <User size={13} className="text-muted-foreground shrink-0" />
              <span className="text-sm text-muted-foreground">{contact}</span>
            </div>
          )}

          {/* Email + téléphone */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 pl-6">
            <a
              href={`mailto:${selected.email}`}
              className="text-sm text-primary hover:underline underline-offset-2"
            >
              {selected.email}
            </a>
            {selected.telephone && (
              <span className="text-sm text-muted-foreground">{selected.telephone}</span>
            )}
          </div>

          <p className="text-xs text-muted-foreground pl-6">{fmtDate(selected.created_at)}</p>
        </div>

        {/* Séparateur */}
        <div className="border-t border-border mb-5" />

        {/* Corps du message */}
        <div className="flex-1 min-h-0">
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
            {corps}
          </p>
        </div>

        {/* Bouton répondre */}
        <div className="mt-6 pt-4 border-t border-border">
          <button
            onClick={() => repondre(selected.email, selected.objet, selected.nom)}
            className="gold-gradient text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Reply size={15} />
            {isPartenariat ? "Répondre à la demande" : "Répondre par email"}
          </button>
        </div>
      </motion.div>
    );
  };

  // ── Rendu principal ──────────────────────────────────────────────────────────
  return (
    <div>
      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl gold-text">Messages</h1>
          <div className="flex flex-wrap items-center gap-3 mt-0.5">
            <p className="text-muted-foreground text-sm">
              {nonLus > 0 ? (
                <>
                  <span className="text-primary font-semibold">{nonLus}</span> non lu{nonLus > 1 ? "s" : ""} · {total} au total
                </>
              ) : (
                <>{total} message{total > 1 ? "s" : ""} au total</>
              )}
            </p>
            {nbPartenariats > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-full px-2 py-0.5">
                <Handshake size={10} />
                {nbPartenariats} partenariat{nbPartenariats > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {nonLus > 0 && (
            <button
              onClick={marquerTousLus}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border hover:border-primary/50 rounded-lg px-3 py-2 transition-colors"
            >
              <CheckCheck size={14} /> Tout marquer lu
            </button>
          )}
          <button
            onClick={() => fetchMessages(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border hover:border-primary/50 rounded-lg px-3 py-2 transition-colors"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            Actualiser
          </button>
        </div>
      </div>

      {/* ── Filtres ── */}
      <div className="flex flex-wrap gap-3 mb-4">
        {/* Recherche */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Nom, entreprise, email, message…"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {recherche && (
            <button
              onClick={() => setRecherche("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Filtre statut */}
        <div className="relative">
          <select
            value={filtreStatut}
            onChange={(e) => setFiltreStatut(e.target.value)}
            className="appearance-none pl-4 pr-8 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="tous">Tous les statuts</option>
            <option value="non_lu">Non lus</option>
            <option value="lu">Lus</option>
          </select>
          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>

        {/* Filtre objet */}
        <div className="relative">
          <select
            value={filtreObjet}
            onChange={(e) => setFiltreObjet(e.target.value)}
            className="appearance-none pl-4 pr-8 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="tous">Tous les objets</option>
            {Object.entries(OBJETS_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>

        {/* Reset */}
        <AnimatePresence>
          {hasFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={resetFilters}
              className="flex items-center gap-1.5 text-xs text-primary border border-primary/30 hover:border-primary rounded-lg px-3 py-2 transition-colors"
            >
              <X size={12} /> Réinitialiser
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {hasFilters && !loading && (
        <p className="text-xs text-muted-foreground mb-3">
          {filtres.length} résultat{filtres.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* ── Contenu ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 size={30} className="animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Chargement des messages…</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-5">

          {/* ── Liste ── */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {filtres.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Inbox size={36} className="text-muted-foreground/40" />
                <p className="text-muted-foreground text-sm">Aucun message trouvé</p>
                {hasFilters && (
                  <button onClick={resetFilters} className="text-xs text-primary underline underline-offset-2">
                    Réinitialiser les filtres
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-border max-h-[calc(100vh-280px)] overflow-y-auto">
                {filtres.map((msg) => {
                  const isPartenariat = msg.objet === "partenariat";
                  return (
                    <motion.div
                      key={msg.id}
                      layout
                      onClick={() => ouvrir(msg)}
                      className={`group relative p-4 cursor-pointer transition-all hover:bg-secondary/30 ${
                        selected?.id === msg.id ? "bg-secondary/50" : ""
                      }`}
                    >
                      {/* Indicateur non-lu — amber pour partenariat */}
                      {msg.statut === "non_lu" && (
                        <span className={`absolute left-0 top-0 bottom-0 w-0.5 rounded-r-full ${
                          isPartenariat ? "bg-amber-400" : "bg-primary"
                        }`} />
                      )}

                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 min-w-0">
                          {isPartenariat ? (
                            <Handshake size={14} className={msg.statut === "non_lu" ? "text-amber-400 shrink-0" : "text-muted-foreground shrink-0"} />
                          ) : msg.statut === "lu" ? (
                            <MailOpen size={14} className="text-muted-foreground shrink-0" />
                          ) : (
                            <Mail size={14} className="text-primary shrink-0" />
                          )}
                          <span className={`text-sm truncate ${
                            msg.statut === "non_lu" ? "text-foreground font-semibold" : "text-muted-foreground"
                          }`}>
                            {msg.nom}
                          </span>
                        </div>
                        <span className="text-[11px] text-muted-foreground shrink-0">{fmtDay(msg.created_at)}</span>
                      </div>

                      <div className="flex items-center gap-2 mb-1.5">
                        <ObjetBadge objet={msg.objet} size="sm" />
                        <span className="text-[11px] text-muted-foreground truncate">{msg.email}</span>
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-1 pl-5">
                        {isPartenariat
                          ? parsePartenaireMessage(msg.message).corps
                          : msg.message
                        }
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Détail ── */}
          <AnimatePresence mode="wait">
            {selected ? (
              renderDetail()
            ) : (
              <motion.div
                key="empty"
                className="bg-card border border-border border-dashed rounded-xl flex flex-col items-center justify-center p-12 gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <MailOpen size={36} className="text-muted-foreground/30" />
                <p className="text-muted-foreground text-sm">Sélectionnez un message pour le lire</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Messages;