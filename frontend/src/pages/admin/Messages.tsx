/**
 * Gestion des messages de contact (Admin)
 * -----------------------------------------
 * Boîte de réception avec statut lu/non lu,
 * détail des messages et actions.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MailOpen, Trash2, Star, X, Reply, Search } from "lucide-react";

/* Messages simulés */
const mockMessages = [
  { id: 1, nom: "Jean Dupont", email: "jean@email.com", telephone: "691234567", objet: "Candidature", message: "Bonjour, je souhaite me porter candidat pour Miss Golden Vibes. Comment procéder ?", date: "2026-03-15 10:30", lu: false, important: false },
  { id: 2, nom: "Marie Ngo", email: "marie@email.com", telephone: "677889900", objet: "Partenariat", message: "Notre entreprise souhaite devenir partenaire de votre événement. Pouvez-vous nous envoyer les offres ?", date: "2026-03-14 16:00", lu: true, important: true },
  { id: 3, nom: "Paul Teka", email: "paul@email.com", telephone: "655112233", objet: "Information", message: "Quels sont les horaires exacts de l'événement du 11 avril ? Y a-t-il un parking sur place ?", date: "2026-03-14 09:15", lu: true, important: false },
  { id: 4, nom: "Alice Fon", email: "alice@email.com", telephone: "699887766", objet: "Réclamation", message: "J'ai payé pour un billet VIP mais je n'ai pas reçu la confirmation par email. Pouvez-vous vérifier ?", date: "2026-03-13 20:00", lu: false, important: true },
  { id: 5, nom: "Bruno Mbarga", email: "bruno@email.com", telephone: "670001122", objet: "Information", message: "Est-ce que l'événement est ouvert aux moins de 18 ans accompagnés de leurs parents ?", date: "2026-03-13 14:30", lu: true, important: false },
];

const Messages = () => {
  const [messages, setMessages] = useState(mockMessages);
  const [selected, setSelected] = useState(null);
  const [recherche, setRecherche] = useState("");
  const [filtreObjet, setFiltreObjet] = useState("tous");

  const nonLus = messages.filter((m) => !m.lu).length;

  /* Filtrer les messages */
  const filtres = messages
    .filter((m) => filtreObjet === "tous" || m.objet === filtreObjet)
    .filter((m) => m.nom.toLowerCase().includes(recherche.toLowerCase()) || m.email.toLowerCase().includes(recherche.toLowerCase()));

  /* Marquer comme lu */
  const marquerLu = (id) => setMessages(messages.map((m) => (m.id === id ? { ...m, lu: true } : m)));

  /* Basculer importance */
  const toggleImportant = (id) => setMessages(messages.map((m) => (m.id === id ? { ...m, important: !m.important } : m)));

  /* Supprimer */
  const supprimer = (id) => {
    if (window.confirm("Supprimer ce message ?")) {
      setMessages(messages.filter((m) => m.id !== id));
      if (selected?.id === id) setSelected(null);
    }
  };

  /* Ouvrir un message */
  const ouvrir = (msg) => {
    marquerLu(msg.id);
    setSelected(msg);
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
          <input type="text" placeholder="Rechercher par nom ou email..." value={recherche} onChange={(e) => setRecherche(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        <select value={filtreObjet} onChange={(e) => setFiltreObjet(e.target.value)}
          className="px-4 py-2.5 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
          <option value="tous">Tous les objets</option>
          {["Candidature", "Partenariat", "Information", "Réclamation", "Autre"].map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Liste des messages */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {filtres.map((msg) => (
            <div
              key={msg.id}
              onClick={() => ouvrir(msg)}
              className={`p-4 border-b border-border last:border-0 cursor-pointer transition-colors hover:bg-secondary/30 ${
                selected?.id === msg.id ? "bg-secondary/50" : ""
              } ${!msg.lu ? "border-l-2 border-l-primary" : ""}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {msg.lu ? <MailOpen size={16} className="text-muted-foreground" /> : <Mail size={16} className="text-primary" />}
                  <span className={`text-sm ${msg.lu ? "text-muted-foreground" : "text-foreground font-semibold"}`}>{msg.nom}</span>
                </div>
                <div className="flex items-center gap-1">
                  {msg.important && <Star size={14} className="text-primary fill-primary" />}
                  <span className="text-xs text-muted-foreground">{msg.date.split(" ")[0]}</span>
                </div>
              </div>
              <p className="text-xs text-primary mt-1">{msg.objet}</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{msg.message}</p>
            </div>
          ))}
          {filtres.length === 0 && (
            <p className="p-6 text-center text-muted-foreground text-sm">Aucun message trouvé</p>
          )}
        </div>

        {/* Détail du message */}
        {selected ? (
          <motion.div className="bg-card border border-border rounded-xl p-6" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-primary uppercase tracking-wider">{selected.objet}</span>
              <div className="flex gap-1">
                <button onClick={() => toggleImportant(selected.id)} className="p-2 hover:bg-secondary rounded-lg" title="Important">
                  <Star size={16} className={selected.important ? "text-primary fill-primary" : "text-muted-foreground"} />
                </button>
                <button onClick={() => supprimer(selected.id)} className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-destructive" title="Supprimer">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <h2 className="font-display text-xl text-foreground mb-1">{selected.nom}</h2>
            <p className="text-sm text-muted-foreground">{selected.email} · {selected.telephone}</p>
            <p className="text-xs text-muted-foreground mt-1">{selected.date}</p>
            <div className="border-t border-border mt-4 pt-4">
              <p className="text-sm text-foreground leading-relaxed">{selected.message}</p>
            </div>
            <button className="mt-6 gold-gradient text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2">
              <Reply size={16} /> Répondre
            </button>
          </motion.div>
        ) : (
          <div className="bg-card border border-border rounded-xl flex items-center justify-center p-12">
            <p className="text-muted-foreground text-sm">Sélectionnez un message pour le lire</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
