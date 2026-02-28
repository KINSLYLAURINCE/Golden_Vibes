/**
 * Gestion des partenaires (Admin)
 * -----------------------------------------
 * Liste et formulaire de gestion des partenaires.
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, X, Save, Upload, Loader2 } from "lucide-react";
import axios from "axios";

const API_URL = "http://localhost:1002/api";
const STORAGE_URL = "http://localhost:1002/storage";

const CATEGORIES = ["platine", "or", "argent", "bronze"];

const emptyForm = {
  nom: "",
  categorie: "or",
  description: "",
  site_web: "",
  ordre: 0,
  statut: "actif",
};

const ListePartenaires = () => {
  const [partenaires, setPartenaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [existingLogo, setExistingLogo] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };

  /* Charger les partenaires */
  const fetchPartenaires = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/admin/partenaires`, axiosConfig);
      setPartenaires(response.data.data || response.data);
    } catch (err) {
      console.error("Erreur chargement partenaires:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartenaires();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  /* Gestion logo */
  const handleLogo = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)) {
      setError("Format non supporté. Utilisez JPG, PNG ou WebP.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Le logo ne doit pas dépasser 2 Mo.");
      return;
    }

    setError("");
    setLogo(file);
    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  /* URL logo */
  const getLogoUrl = (logoPath) => {
    if (!logoPath) return null;
    if (logoPath.startsWith("http")) return logoPath;
    return `${STORAGE_URL}/${logoPath}`;
  };

  /* Ouvrir formulaire */
  const ouvrir = (p = null) => {
    setError("");
    setLogo(null);
    setLogoPreview("");

    if (p) {
      setEditId(p.id);
      setForm({
        nom: p.nom,
        categorie: p.categorie,
        description: p.description || "",
        site_web: p.site_web || "",
        ordre: p.ordre || 0,
        statut: p.statut,
      });
      setExistingLogo(p.logo || "");
    } else {
      setEditId(null);
      setForm(emptyForm);
      setExistingLogo("");
    }
    setShowForm(true);
  };

  /* Sauvegarder */
  const sauvegarder = async (e) => {
    e.preventDefault();

    if (!logo && !existingLogo) {
      setError("Le logo est obligatoire.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("nom", form.nom);
      formData.append("categorie", form.categorie);
      formData.append("description", form.description);
      formData.append("site_web", form.site_web);
      formData.append("ordre", form.ordre);
      formData.append("statut", form.statut);
      if (logo) formData.append("logo", logo);

      if (editId) {
        formData.append("_method", "PUT");
        const response = await axios.post(
          `${API_URL}/admin/partenaires/${editId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const updated = response.data.data || response.data;
        setPartenaires((prev) => prev.map((p) => (p.id === editId ? updated : p)));
      } else {
        const response = await axios.post(
          `${API_URL}/admin/partenaires`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setPartenaires((prev) => [...prev, response.data.data || response.data]);
      }

      setShowForm(false);
    } catch (err) {
      console.error("Erreur sauvegarde:", err);
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Une erreur est survenue."
      );
    } finally {
      setSaving(false);
    }
  };

  /* Supprimer */
  const supprimer = async (id) => {
    if (!window.confirm("Supprimer ce partenaire ?")) return;
    try {
      await axios.delete(`${API_URL}/admin/partenaires/${id}`, axiosConfig);
      setPartenaires((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Erreur suppression:", err);
      alert("Erreur lors de la suppression.");
    }
  };

  /* Toggle statut */
  const toggleActif = async (id, statutActuel) => {
    const nouveauStatut = statutActuel === "actif" ? "inactif" : "actif";
    try {
      await axios.patch(
        `${API_URL}/admin/partenaires/${id}/statut`,
        { statut: nouveauStatut },
        axiosConfig
      );
      setPartenaires((prev) =>
        prev.map((p) => (p.id === id ? { ...p, statut: nouveauStatut } : p))
      );
    } catch (err) {
      console.error("Erreur toggle statut:", err);
      alert("Erreur lors du changement de statut.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl gold-text">Partenaires</h1>
          <p className="text-muted-foreground text-sm">{partenaires.length} partenaire(s)</p>
        </div>
        <button
          onClick={() => ouvrir()}
          className="gold-gradient text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wider flex items-center gap-2"
        >
          <Plus size={18} /> Ajouter
        </button>
      </div>

      {/* Tableau */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Logo</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Nom</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Catégorie</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Site web</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Ordre</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Statut</th>
                <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {partenaires.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-muted-foreground">
                    Aucun partenaire trouvé.
                  </td>
                </tr>
              ) : (
                partenaires.map((p) => (
                  <tr key={p.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3">
                      {getLogoUrl(p.logo) ? (
                        <img
                          src={getLogoUrl(p.logo)}
                          alt={p.nom}
                          className="w-12 h-10 object-contain rounded border border-border bg-white/5 p-1"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      ) : (
                        <div className="w-12 h-10 rounded border border-border bg-secondary flex items-center justify-center text-xs text-muted-foreground">
                          ?
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{p.nom}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-primary uppercase tracking-wider">{p.categorie}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {p.site_web ? (
                        <a href={p.site_web} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors underline underline-offset-2">
                          {p.site_web.replace("https://", "").replace("http://", "")}
                        </a>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{p.ordre}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded ${p.statut === "actif" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                        {p.statut === "actif" ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => ouvrir(p)} className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => toggleActif(p.id, p.statut)} className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground">
                          {p.statut === "actif" ? <ToggleRight size={16} className="text-primary" /> : <ToggleLeft size={16} />}
                        </button>
                        <button onClick={() => supprimer(p.id)} className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-destructive">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Formulaire */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 bg-background/80 z-50 flex items-center justify-center p-4">
            <motion.form
              onSubmit={sauvegarder}
              className="bg-card border border-border rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-4"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-display text-xl text-foreground">
                  {editId ? "Modifier" : "Ajouter"} un Partenaire
                </h2>
                <button type="button" onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={20} />
                </button>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                  {error}
                </div>
              )}

              {/* Nom */}
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Nom *</label>
                <input
                  type="text" name="nom" value={form.nom} onChange={handleChange} required
                  className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Logo */}
              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Logo {!editId && <span className="text-red-500">*</span>}
                </label>
                <label className={`flex flex-col items-center justify-center h-28 border-2 border-dashed rounded-lg cursor-pointer transition-all bg-secondary overflow-hidden ${
                  logoPreview || existingLogo ? "border-primary border-solid" : "border-border hover:border-primary/50"
                }`}>
                  {logoPreview ? (
                    <img src={logoPreview} alt="Preview" className="h-full object-contain p-2" />
                  ) : existingLogo ? (
                    <div className="flex flex-col items-center gap-1">
                      <img src={getLogoUrl(existingLogo)} alt="Logo actuel" className="h-16 object-contain p-2"
                        onError={(e) => { e.target.style.display = "none"; }} />
                      <span className="text-xs text-muted-foreground">Cliquer pour remplacer</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Upload size={24} />
                      <span className="text-xs">PNG, JPG, WebP (max 2 Mo)</span>
                    </div>
                  )}
                  <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden" onChange={handleLogo} />
                </label>
              </div>

              {/* Catégorie */}
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Catégorie *</label>
                <select name="categorie" value={form.categorie} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </div>

              {/* Site web */}
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Site web</label>
                <input
                  type="url" name="site_web" value={form.site_web} onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Description</label>
                <textarea
                  name="description" value={form.description} onChange={handleChange} rows={3}
                  className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Ordre + Statut */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Ordre d'affichage</label>
                  <input
                    type="number" name="ordre" value={form.ordre} onChange={handleChange} min="0"
                    className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Statut</label>
                  <select name="statut" value={form.statut} onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                    <option value="actif">Actif</option>
                    <option value="inactif">Inactif</option>
                  </select>
                </div>
              </div>

              {/* Boutons */}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} disabled={saving}
                  className="flex-1 border border-border text-muted-foreground py-2.5 rounded-lg hover:bg-secondary transition-colors disabled:opacity-50">
                  Annuler
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 gold-gradient text-primary-foreground py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
                  {saving ? (
                    <><Loader2 size={16} className="animate-spin" /> En cours...</>
                  ) : (
                    <><Save size={16} /> Enregistrer</>
                  )}
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ListePartenaires;