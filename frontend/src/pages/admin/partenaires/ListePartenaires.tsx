/**
 * Gestion des partenaires (Admin)
 * -----------------------------------------
 * Liste et formulaire de gestion des partenaires.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, X, Save, Upload } from "lucide-react";

const mockPartenaires = [
  { id: 1, nom: "3iA", categorie: "Platine", site: "#", actif: true },
  { id: 2, nom: "KDM Sono", categorie: "Or", site: "#", actif: true },
  { id: 3, nom: "Noir & Fier", categorie: "Argent", site: "#", actif: true },
  { id: 4, nom: "Le Guide", categorie: "Argent", site: "#", actif: true },
  { id: 5, nom: "Trecy Clean Express", categorie: "Bronze", site: "#", actif: true },
];

const ListePartenaires = () => {
  const [partenaires, setPartenaires] = useState(mockPartenaires);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ nom: "", categorie: "Or", description: "", site: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const ouvrir = (p = null) => {
    if (p) { setEditId(p.id); setForm({ nom: p.nom, categorie: p.categorie, description: "", site: p.site }); }
    else { setEditId(null); setForm({ nom: "", categorie: "Or", description: "", site: "" }); }
    setShowForm(true);
  };

  const sauvegarder = (e) => {
    e.preventDefault();
    if (editId) { setPartenaires(partenaires.map((p) => (p.id === editId ? { ...p, ...form } : p))); }
    else { setPartenaires([...partenaires, { id: Date.now(), ...form, actif: true }]); }
    setShowForm(false);
  };

  const supprimer = (id) => { if (window.confirm("Supprimer ce partenaire ?")) setPartenaires(partenaires.filter((p) => p.id !== id)); };
  const toggleActif = (id) => setPartenaires(partenaires.map((p) => (p.id === id ? { ...p, actif: !p.actif } : p)));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl gold-text">Partenaires</h1>
          <p className="text-muted-foreground text-sm">{partenaires.length} partenaire(s)</p>
        </div>
        <button onClick={() => ouvrir()} className="gold-gradient text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
          <Plus size={18} /> Ajouter
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Nom</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Catégorie</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Site web</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Statut</th>
              <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {partenaires.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-foreground">{p.nom}</td>
                <td className="px-4 py-3"><span className="text-xs text-primary uppercase tracking-wider">{p.categorie}</span></td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{p.site || "-"}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded ${p.actif ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>{p.actif ? "Actif" : "Inactif"}</span></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => ouvrir(p)} className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground"><Edit size={16} /></button>
                    <button onClick={() => toggleActif(p.id)} className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground">
                      {p.actif ? <ToggleRight size={16} className="text-primary" /> : <ToggleLeft size={16} />}
                    </button>
                    <button onClick={() => supprimer(p.id)} className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-background/80 z-50 flex items-center justify-center p-4">
          <motion.form onSubmit={sauvegarder} className="bg-card border border-border rounded-xl p-6 w-full max-w-lg space-y-4" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-display text-xl text-foreground">{editId ? "Modifier" : "Ajouter"} un Partenaire</h2>
              <button type="button" onClick={() => setShowForm(false)} className="text-muted-foreground"><X size={20} /></button>
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Nom *</label>
              <input type="text" name="nom" value={form.nom} onChange={handleChange} required className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Logo</label>
              <label className="flex items-center justify-center h-24 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 bg-secondary">
                <Upload size={20} className="text-muted-foreground mr-2" /><span className="text-xs text-muted-foreground">PNG transparent (max 2 Mo)</span>
                <input type="file" accept="image/*" className="hidden" />
              </label>
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Catégorie *</label>
              <select name="categorie" value={form.categorie} onChange={handleChange} className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                {["Platine", "Or", "Argent", "Bronze"].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Site web</label>
              <input type="url" name="site" value={form.site} onChange={handleChange} placeholder="https://..." className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-border text-muted-foreground py-2.5 rounded-lg">Annuler</button>
              <button type="submit" className="flex-1 gold-gradient text-primary-foreground py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2"><Save size={16} /> Enregistrer</button>
            </div>
          </motion.form>
        </div>
      )}
    </div>
  );
};

export default ListePartenaires;
