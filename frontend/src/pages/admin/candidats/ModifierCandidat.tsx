/**
 * Formulaire de modification de candidat (Admin)
 * -----------------------------------------
 * Pré-remplit les données existantes et permet
 * de modifier photos, vidéo et informations.
 */

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, Save } from "lucide-react";

/* Données simulées */
const mockCandidat = {
  id: 1, numero: 1, nom: "Nguemo", prenom: "Tatiana", categorie: "miss",
  video_url: "", statut: "actif",
  photo1: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop",
  photo2: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop",
};

const ModifierCandidat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(mockCandidat);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Candidat modifié avec succès ! (démo)");
    navigate("/admin/candidats");
  };

  return (
    <div>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 text-sm">
        <ArrowLeft size={16} /> Retour
      </button>
      <h1 className="font-display text-3xl gold-text mb-8">Modifier le Candidat #{id}</h1>

      <motion.form onSubmit={handleSubmit} className="max-w-2xl space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* Catégorie */}
        <div>
          <label className="block text-sm text-muted-foreground mb-2">Catégorie *</label>
          <div className="flex gap-3">
            {["miss", "master"].map((cat) => (
              <button key={cat} type="button" onClick={() => setForm({ ...form, categorie: cat })}
                className={`flex-1 py-3 rounded-lg text-sm font-semibold uppercase tracking-wider transition-all ${form.categorie === cat ? "gold-gradient text-primary-foreground" : "bg-secondary border border-border text-muted-foreground"}`}>
                {cat === "miss" ? "👑 Miss" : "🤴 Master"}
              </button>
            ))}
          </div>
        </div>

        {/* Numéro, Nom, Prénom */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-2">Numéro *</label>
            <input type="number" name="numero" value={form.numero} onChange={handleChange} required min="1"
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-2">Nom *</label>
            <input type="text" name="nom" value={form.nom} onChange={handleChange} required
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-2">Prénom</label>
            <input type="text" name="prenom" value={form.prenom} onChange={handleChange}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
        </div>

        {/* Photos avec prévisualisation */}
        <div className="grid grid-cols-2 gap-4">
          {[form.photo1, form.photo2].map((photo, i) => (
            <div key={i}>
              <label className="block text-sm text-muted-foreground mb-2">Photo {i + 1}</label>
              {photo ? (
                <div className="relative h-40 rounded-lg overflow-hidden border border-border">
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                  <label className="absolute inset-0 bg-background/60 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-xs text-foreground bg-secondary px-3 py-1 rounded">Remplacer</span>
                    <input type="file" accept="image/*" className="hidden" />
                  </label>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 bg-secondary">
                  <Upload size={24} className="text-muted-foreground mb-2" />
                  <span className="text-xs text-muted-foreground">Ajouter</span>
                  <input type="file" accept="image/*" className="hidden" />
                </label>
              )}
            </div>
          ))}
        </div>

        {/* Vidéo */}
        <div>
          <label className="block text-sm text-muted-foreground mb-2">Vidéo (lien YouTube/Facebook)</label>
          <input type="url" name="video_url" value={form.video_url} onChange={handleChange} placeholder="https://..."
            className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>

        {/* Statut */}
        <div>
          <label className="block text-sm text-muted-foreground mb-2">Statut</label>
          <select name="statut" value={form.statut} onChange={handleChange}
            className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
            <option value="actif">Actif</option>
            <option value="inactif">Inactif</option>
          </select>
        </div>

        {/* Boutons */}
        <div className="flex gap-3 pt-4">
          <button type="button" onClick={() => navigate(-1)} className="flex-1 border border-border text-muted-foreground py-3 rounded-lg font-medium">Annuler</button>
          <button type="submit" className="flex-1 gold-gradient text-primary-foreground py-3 rounded-lg font-semibold uppercase tracking-wider flex items-center justify-center gap-2">
            <Save size={18} /> Sauvegarder
          </button>
        </div>
      </motion.form>
    </div>
  );
};

export default ModifierCandidat;
