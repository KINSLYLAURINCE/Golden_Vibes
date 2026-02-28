/**
 * Gestion des messages de contact (Admin)
 * -----------------------------------------
 * Boîte de réception avec statut lu/non lu,
 * détail des messages et actions.
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, MailOpen, Trash2, Star, Search, Reply, Loader2 } from "lucide-react";
import axios from "axios";

const API_URL = "http://localhost:1002/api";

const OBJETS_LABELS = {
  candidature: "Candidature",
  partenariat: "Partenariat",
  info: "Information",
  reclamation: "Réclamation",
  autre: "Autre",
};

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [recherche, setRecherche] = useState("");
  const [filtreObjet, setFiltreObjet] = useState("tous");

  const token = localStorage.getItem("token");
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };

  /* Charger les messages */
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/admin/messages`, axiosConfig);
      setMessages(response.data.data || response.data);
    } catch (err) {
      console.error("Erreur chargement messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const nonLus = messages.filter((m) => m.statut === "non_lu").length;

  /* Filtrer les messages */
  const filtres = messages
    .filter((m) => filtreObjet === "tous" || m.objet === filtreObjet)
    .filter(
      (m) =>
        m.nom.toLowerCase().includes(recherche.toLowerCase()) ||
        m.email.toLowerCase().includes(recherche.toLowerCase())
    );

  /* Marquer comme lu */
  const marquerLu = async (id) => {
    const msg = messages.find((m) => m.id === id);
    if (!msg || msg.statut === "lu") return;

    try {
      await axios.put(`${API_URL}/admin/messages/${id}/lire`, {}, axiosConfig);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, statut: "lu" } : m))
      );
    } catch (err) {
      console.error("Erreur marquer lu:", err);
    }
  };

  /* Supprimer */
  const supprimer = async (id) => {
    if (!window.confirm("Supprimer ce message ?")) return;
    try {
      await axios.delete(`${API_URL}/admin/messages/${id}`, axiosConfig);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (err) {
      console.error("Erreur suppression:", err);
      alert("Erreur lors de la suppression.");
    }
  };

  /* Ouvrir un message */
  const ouvrir = (msg) => {
    marquerLu(msg.id);
    setSelected({ ...msg, statut: "lu" });
  };

  /* Format date */
  const fmtDate = (d) => {
    if (!d) return "";
    return d.slice(0, 16).replace("T", " ");
  };

  /* Répondre par email */
  const repondre = (email, objet) => {
    window.open(`mailto:${email}?subject=Re: ${OBJETS_LABELS[objet] || objet}`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl gold-text">Messages</h1>
          <p className="text-muted-foreground text-sm">{nonLus} message(s) non lu(s)</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <select
          value={filtreObjet}
          onChange={(e) => setFiltreObjet(e.target.value)}
          className="px-4 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="tous">Tous les objets</option>
          {Object.entries(OBJETS_LABELS).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Liste des messages */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {filtres.length === 0 ? (
              <p className="p-6 text-center text-muted-foreground text-sm">Aucun message trouvé</p>
            ) : (
              filtres.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => ouvrir(msg)}
                  className={`p-4 border-b border-border last:border-0 cursor-pointer transition-colors hover:bg-secondary/30 ${
                    selected?.id === msg.id ? "bg-secondary/50" : ""
                  } ${msg.statut === "non_lu" ? "border-l-2 border-l-primary" : ""}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {msg.statut === "lu"
                        ? <MailOpen size={16} className="text-muted-foreground" />
                        : <Mail size={16} className="text-primary" />
                      }
                      <span className={`text-sm ${msg.statut === "lu" ? "text-muted-foreground" : "text-foreground font-semibold"}`}>
                        {msg.nom}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {fmtDate(msg.created_at).slice(0, 10)}
                    </span>
                  </div>
                  <p className="text-xs text-primary mt-1">
                    {OBJETS_LABELS[msg.objet] || msg.objet}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{msg.message}</p>
                </div>
              ))
            )}
          </div>

          {/* Détail du message */}
          {selected ? (
            <motion.div
              className="bg-card border border-border rounded-xl p-6"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-primary uppercase tracking-wider">
                  {OBJETS_LABELS[selected.objet] || selected.objet}
                </span>
                <button
                  onClick={() => supprimer(selected.id)}
                  className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-destructive"
                  title="Supprimer"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <h2 className="font-display text-xl text-foreground mb-1">{selected.nom}</h2>
              <p className="text-sm text-muted-foreground">{selected.email} · {selected.telephone}</p>
              <p className="text-xs text-muted-foreground mt-1">{fmtDate(selected.created_at)}</p>

              <div className="border-t border-border mt-4 pt-4">
                <p className="text-sm text-foreground leading-relaxed">{selected.message}</p>
              </div>

              <button
                onClick={() => repondre(selected.email, selected.objet)}
                className="mt-6 gold-gradient text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2"
              >
                <Reply size={16} /> Répondre
              </button>
            </motion.div>
          ) : (
            <div className="bg-card border border-border rounded-xl flex items-center justify-center p-12">
              <p className="text-muted-foreground text-sm">Sélectionnez un message pour le lire</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Messages;