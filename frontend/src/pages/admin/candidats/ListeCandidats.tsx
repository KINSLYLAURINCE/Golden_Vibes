/**
 * Liste des candidats (Admin)
 * -----------------------------------------
 * Tableau de gestion des candidats avec actions :
 * voir, modifier, supprimer, activer/désactiver.
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Search, Eye, Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

/* Données simulées */
const mockCandidats = [
  { id: 1, numero: 1, nom: "Nguemo Tatiana", categorie: "miss", votes: 245, actif: true, photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop" },
  { id: 2, numero: 2, nom: "Kamga Brielle", categorie: "miss", votes: 189, actif: true, photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop" },
  { id: 3, numero: 3, nom: "Fotso Mireille", categorie: "miss", votes: 312, actif: true, photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop" },
  { id: 4, numero: 1, nom: "Tchamba Kevin", categorie: "master", votes: 278, actif: true, photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop" },
  { id: 5, numero: 2, nom: "Mbarga Yves", categorie: "master", votes: 156, actif: false, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop" },
  { id: 6, numero: 4, nom: "Nkwenti Divine", categorie: "miss", votes: 198, actif: true, photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=80&h=80&fit=crop" },
  { id: 7, numero: 3, nom: "Djomo Patrick", categorie: "master", votes: 223, actif: true, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop" },
  { id: 8, numero: 5, nom: "Teguia Ornella", categorie: "miss", votes: 167, actif: true, photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop" },
];

const ListeCandidats = () => {
  const [candidats, setCandidats] = useState(mockCandidats);
  const [recherche, setRecherche] = useState("");
  const [filtre, setFiltre] = useState("tous");

  /* Filtrer et rechercher */
  const filtres = candidats
    .filter((c) => filtre === "tous" || c.categorie === filtre)
    .filter((c) => c.nom.toLowerCase().includes(recherche.toLowerCase()) || String(c.numero).includes(recherche));

  /* Activer/Désactiver un candidat */
  const toggleActif = (id) => {
    setCandidats(candidats.map((c) => (c.id === id ? { ...c, actif: !c.actif } : c)));
  };

  /* Supprimer un candidat */
  const supprimer = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce candidat ?")) {
      setCandidats(candidats.filter((c) => c.id !== id));
    }
  };

  return (
    <div>
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl gold-text">Candidats</h1>
          <p className="text-muted-foreground text-sm">{filtres.length} candidat(s)</p>
        </div>
        <Link
          to="/admin/candidats/ajouter"
          className="gold-gradient text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wider flex items-center gap-2"
        >
          <Plus size={18} /> Ajouter
        </Link>
      </div>

      {/* Filtres */}
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
          {["tous", "miss", "master"].map((f) => (
            <button
              key={f}
              onClick={() => setFiltre(f)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium uppercase tracking-wider transition-colors ${
                filtre === f ? "gold-gradient text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "tous" ? "Tous" : f === "miss" ? "👑 Miss" : "🤴 Master"}
            </button>
          ))}
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <td className="px-4 py-3">
                  <img src={c.photo} alt={c.nom} className="w-10 h-10 rounded-lg object-cover" />
                </td>
                <td className="px-4 py-3">
                  <span className="gold-gradient text-primary-foreground px-2 py-0.5 rounded text-xs font-bold">{c.numero}</span>
                </td>
                <td className="px-4 py-3 text-sm font-medium text-foreground">{c.nom}</td>
                <td className="px-4 py-3">
                  <span className="text-xs uppercase tracking-wider text-primary">{c.categorie}</span>
                </td>
                <td className="px-4 py-3 text-sm text-primary font-bold">{c.votes}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded ${c.actif ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}`}>
                    {c.actif ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link to={`/candidats/${c.id}`} className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors" title="Voir">
                      <Eye size={16} />
                    </Link>
                    <Link to={`/admin/candidats/modifier/${c.id}`} className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors" title="Modifier">
                      <Edit size={16} />
                    </Link>
                    <button onClick={() => toggleActif(c.id)} className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors" title="Activer/Désactiver">
                      {c.actif ? <ToggleRight size={16} className="text-green-400" /> : <ToggleLeft size={16} />}
                    </button>
                    <button onClick={() => supprimer(c.id)} className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-destructive transition-colors" title="Supprimer">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListeCandidats;
