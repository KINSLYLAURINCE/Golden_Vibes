/**
 * Formulaire d'ajout de candidat (Admin)
 * -----------------------------------------
 * Permet d'ajouter un nouveau candidat avec
 * photos, vidéo et informations complètes.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, Save } from "lucide-react";

const AjouterCandidat = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    numero: "",
    nom: "",
    prenom: "",
    categorie: "",
    video_url: "",
    statut: "actif",
  });

  /* Mise à jour des champs */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* Soumission du formulaire */
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO : Appel API ajouterCandidat()
    alert("Candidat ajouté avec succès ! (démo)");
    navigate("/admin/candidats");
  };

  return (
    <div>
      {/* En-tête */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 text-sm">
        <ArrowLeft size={16} /> Retour
      </button>
      <h1 className="font-display text-3xl gold-text mb-8">Ajouter un Candidat</h1>

      <motion.form
        onSubmit={handleSubmit}
        className="max-w-2xl space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Catégorie */}
        <div>
          <label className="block text-sm text-muted-foreground mb-2">Catégorie *</label>
          <div className="flex gap-3">
            {["miss", "master"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setForm({ ...form, categorie: cat })}
                className={`flex-1 py-3 rounded-lg text-sm font-semibold uppercase tracking-wider transition-all ${
                  form.categorie === cat ? "gold-gradient text-primary-foreground" : "bg-secondary border border-border text-muted-foreground"
                }`}
              >
                {cat === "miss" ? "👑 Miss" : "🤴 Master"}
              </button>
            ))}
          </div>
        </div>

        {/* Numéro et Nom */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-2">Numéro *</label>
            <input
              type="number"
              name="numero"
              value={form.numero}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-2">Nom *</label>
            <input
              type="text"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              required
              placeholder="Nom du candidat"
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-2">Prénom</label>
            <input
              type="text"
              name="prenom"
              value={form.prenom}
              onChange={handleChange}
              placeholder="Prénom"
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Photos */}
        <div className="grid grid-cols-2 gap-4">
          {[1, 2].map((n) => (
            <div key={n}>
              <label className="block text-sm text-muted-foreground mb-2">Photo {n} {n === 1 ? "*" : ""}</label>
              <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors bg-secondary">
                <Upload size={24} className="text-muted-foreground mb-2" />
                <span className="text-xs text-muted-foreground">JPG, PNG (max 5 Mo)</span>
                <input type="file" accept="image/*" className="hidden" />
              </label>
            </div>
          ))}
        </div>

        {/* Vidéo */}
        <div>
          <label className="block text-sm text-muted-foreground mb-2">Vidéo de présentation (lien YouTube/Facebook)</label>
          <input
            type="url"
            name="video_url"
            value={form.video_url}
            onChange={handleChange}
            placeholder="https://youtube.com/watch?v=..."
            className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Statut */}
        <div>
          <label className="block text-sm text-muted-foreground mb-2">Statut</label>
          <select
            name="statut"
            value={form.statut}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="actif">Actif (visible sur le site)</option>
            <option value="inactif">Inactif (caché)</option>
          </select>
        </div>

        {/* Boutons */}
        <div className="flex gap-3 pt-4">
          <button type="button" onClick={() => navigate(-1)} className="flex-1 border border-border text-muted-foreground py-3 rounded-lg font-medium">
            Annuler
          </button>
          <button type="submit" className="flex-1 gold-gradient text-primary-foreground py-3 rounded-lg font-semibold uppercase tracking-wider flex items-center justify-center gap-2">
            <Save size={18} /> Enregistrer
          </button>
        </div>
      </motion.form>
    </div>
  );
};

export default AjouterCandidat;
