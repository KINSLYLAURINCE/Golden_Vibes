/**
 * Liste des candidats (Admin)
 * -----------------------------------------
 * Tableau de gestion des candidats avec actions :
 * voir, modifier, supprimer, activer/désactiver.
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Search, Eye, Edit, Trash2, ToggleLeft, ToggleRight, Loader2 } from "lucide-react";
import axios from "axios";

const API_URL = "http://localhost:8000/api";
const STORAGE_URL = "http://localhost:8000/storage";

const ListeCandidats = () => {
  const [candidats, setCandidats] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [filtre, setFiltre] = useState("tous");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };

  const fetchCandidats = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${API_URL}/admin/candidats`, axiosConfig);
      setCandidats(response.data.data || response.data);
    } catch (err) {
      console.error("Erreur chargement candidats:", err);
      setError("Impossible de charger les candidats.");
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

  const toggleActif = async (id, statutActuel) => {
    const nouveauStatut = statutActuel === "actif" ? "inactif" : "actif";
    try {
      await axios.patch(
        `${API_URL}/admin/candidats/${id}/statut`,
        { statut: nouveauStatut },
        axiosConfig
      );
      setCandidats((prev) =>
        prev.map((c) => (c.id === id ? { ...c, statut: nouveauStatut } : c))
      );
    } catch (err) {
      console.error("Erreur toggle statut:", err);
      alert("Erreur lors du changement de statut.");
    }
  };

  const supprimer = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce candidat ?")) return;
    try {
      await axios.delete(`${API_URL}/admin/candidats/${id}`, axiosConfig);
      setCandidats((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Erreur suppression:", err);
      alert("Erreur lors de la suppression.");
    }
  };

  /* ✅ Construction correcte de l'URL photo depuis le storage Laravel */
  const getPhotoUrl = (photo) => {
    if (!photo) return null;
    if (photo.startsWith("http")) return photo;
    return `${STORAGE_URL}/${photo}`;
  };

  return (
    <div>
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
          {["tous", "miss", "master"].map((f) => (
            <button
              key={f}
              onClick={() => setFiltre(f)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium uppercase tracking-wider transition-colors ${
                filtre === f
                  ? "gold-gradient text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "tous" ? "Tous" : f === "miss" ? "👑 Miss" : "🤴 Master"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      ) : filtres.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">Aucun candidat trouvé.</div>
      ) : (
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
                    {getPhotoUrl(c.photo1) ? (
                      <img
                        src={getPhotoUrl(c.photo1)}
                        alt={c.nom}
                        className="w-10 h-10 rounded-lg object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className="w-10 h-10 rounded-lg bg-secondary border border-border items-center justify-center text-xs text-muted-foreground"
                      style={{ display: "none" }}
                    >
                      ?
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="gold-gradient text-primary-foreground px-2 py-0.5 rounded text-xs font-bold">
                      {c.numero}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{c.nom}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs uppercase tracking-wider text-primary">{c.categorie}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-primary font-bold">{c.votes_count ?? 0}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded ${
                      c.statut === "actif" ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"
                    }`}>
                      {c.statut === "actif" ? "Actif" : "Inactif"}
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
                      <button onClick={() => toggleActif(c.id, c.statut)} className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors" title="Activer/Désactiver">
                        {c.statut === "actif" ? <ToggleRight size={16} className="text-green-400" /> : <ToggleLeft size={16} />}
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
      )}
    </div>
  );
};

export default ListeCandidats;