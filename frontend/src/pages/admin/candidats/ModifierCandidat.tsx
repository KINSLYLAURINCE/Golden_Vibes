/**
 * Formulaire de modification de candidat (Admin)
 * -----------------------------------------
 * Charge les données depuis l'API et permet
 * de modifier photos, vidéo et informations.
 */

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, Save, Loader2 } from "lucide-react";

import { API_URL, STORAGE_URL, getImageUrl } from "@/services/api";

interface CandidatData {
  numero: string;
  nom: string;
  categorie: string;
  video: string;
  statut: string;
  photo1?: string;
  photo2?: string;
}

const ModifierCandidat = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<CandidatData>({
    numero: "",
    nom: "",
    categorie: "",
    video: "",
    statut: "actif",
  });
  const [photos, setPhotos] = useState<{
    photo1: File | null;
    photo2: File | null;
  }>({ photo1: null, photo2: null });
  const [photoPreviews, setPhotoPreviews] = useState({
    photo1: "",
    photo2: ""
  });

  const token = localStorage.getItem("token");

  /* Charger le candidat */
  useEffect(() => {
    const fetchCandidat = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/admin/candidats/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) throw new Error('Erreur réseau');

        const data = await response.json();
        const c = data.data || data;
        
        setForm({
          numero: c.numero,
          nom: c.nom,
          categorie: c.categorie,
          video: c.video || "",
          statut: c.statut,
        });
        
        // Pré-remplir les previews avec les photos existantes
        setPhotoPreviews({
          photo1: getImageUrl(c.photo1) || "",
          photo2: getImageUrl(c.photo2) || "",
        });
      } catch (err) {
        console.error("Erreur chargement candidat:", err);
        setError("Impossible de charger le candidat.");
      } finally {
        setLoading(false);
      }
    };
    fetchCandidat();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>, photoNumber: 'photo1' | 'photo2') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      setError("Format non supporté. Utilisez JPG ou PNG.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Le fichier ne doit pas dépasser 5 Mo.");
      return;
    }

    setError("");
    setPhotos((prev) => ({ ...prev, [photoNumber]: file }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreviews((prev) => ({ ...prev, [photoNumber]: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.categorie) { setError("Veuillez sélectionner une catégorie"); return; }
    if (!form.numero) { setError("Le numéro est obligatoire"); return; }
    if (!form.nom) { setError("Le nom est obligatoire"); return; }

    setSaving(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("_method", "POST"); // Laravel method spoofing
      formData.append("numero", form.numero);
      formData.append("nom", form.nom);
      formData.append("categorie", form.categorie);
      formData.append("video", form.video);
      formData.append("statut", form.statut);

      if (photos.photo1) formData.append("photo1", photos.photo1);
      if (photos.photo2) formData.append("photo2", photos.photo2);

      const response = await fetch(`${API_URL}/admin/candidats/${id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("Candidat modifié avec succès !");
        navigate("/admin/candidats");
      } else {
        setError(data.message || data.error || "Erreur lors de la modification");
      }
    } catch (err) {
      console.error("Erreur modification:", err);
      setError("Une erreur est survenue lors de la modification");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 size={32} className="text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 text-sm transition-colors"
        disabled={saving}
      >
        <ArrowLeft size={16} /> Retour
      </button>
      <h1 className="font-display text-3xl gold-text mb-8">Modifier le Candidat #{id}</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
          {error}
        </div>
      )}

      <motion.form
        onSubmit={handleSubmit}
        className="max-w-2xl space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Catégorie */}
        <div>
          <label className="block text-sm text-muted-foreground mb-2">
            Catégorie <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            {(["miss", "master"] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setForm({ ...form, categorie: cat })}
                disabled={saving}
                className={`flex-1 py-3 rounded-lg text-sm font-semibold uppercase tracking-wider transition-all ${
                  form.categorie === cat
                    ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg"
                    : "bg-secondary border border-border text-muted-foreground hover:border-primary/50"
                } ${saving ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {cat === "miss" ? "👑 Miss" : "🤴 Master"}
              </button>
            ))}
          </div>
        </div>

        {/* Numéro et Nom */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              Numéro <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="numero"
              value={form.numero}
              onChange={handleChange}
              required
              min="1"
              disabled={saving}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              Nom complet <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              required
              disabled={saving}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
            />
          </div>
        </div>

        {/* Photos */}
        <div className="grid grid-cols-2 gap-4">
          {([1, 2] as const).map((n) => (
            <div key={n}>
              <label className="block text-sm text-muted-foreground mb-2">
                Photo {n} {n === 1 ? <span className="text-red-500">*</span> : <span className="text-muted-foreground/50">(optionnelle)</span>}
              </label>
              <label
                className={`flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-lg cursor-pointer transition-all bg-secondary overflow-hidden ${
                  photoPreviews[`photo${n}`]
                    ? "border-primary border-solid"
                    : "border-border hover:border-primary/50"
                } ${saving ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {photoPreviews[`photo${n}`] ? (
                  <div className="relative w-full h-full group">
                    <img
                      src={photoPreviews[`photo${n}`]}
                      alt={`Photo ${n}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-xs font-medium bg-black/60 px-3 py-1 rounded">
                        Remplacer
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <Upload size={32} className="text-muted-foreground mx-auto mb-2" />
                    <span className="text-xs text-muted-foreground block">Cliquez pour uploader</span>
                    <span className="text-xs text-muted-foreground/70 block mt-1">JPG, PNG (max 5 Mo)</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  className="hidden"
                  onChange={(e) => handlePhotoChange(e, `photo${n}`)}
                  disabled={saving}
                />
              </label>
            </div>
          ))}
        </div>

        {/* Vidéo */}
        <div>
          <label className="block text-sm text-muted-foreground mb-2">
            Vidéo de présentation (lien YouTube/Facebook)
          </label>
          <input
            type="url"
            name="video"
            value={form.video}
            onChange={handleChange}
            placeholder="https://youtube.com/watch?v=..."
            disabled={saving}
            className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
          />
        </div>

        {/* Statut */}
        <div>
          <label className="block text-sm text-muted-foreground mb-2">Statut</label>
          <select
            name="statut"
            value={form.statut}
            onChange={handleChange}
            disabled={saving}
            className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
          >
            <option value="actif">Actif (visible sur le site)</option>
            <option value="inactif">Inactif (caché)</option>
          </select>
        </div>

        {/* Boutons */}
        <div className="flex gap-3 pt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={saving}
            className="flex-1 border border-border text-muted-foreground py-3 rounded-lg font-medium hover:bg-secondary transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-white py-3 rounded-lg font-semibold uppercase tracking-wider flex items-center justify-center gap-2 hover:from-amber-600 hover:to-yellow-600 transition-all disabled:opacity-50 shadow-lg"
          >
            {saving ? (
              <><Loader2 size={18} className="animate-spin" /> En cours...</>
            ) : (
              <><Save size={18} /> Sauvegarder</>
            )}
          </button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          <span className="text-red-500">*</span> Champs obligatoires
        </p>
      </motion.form>
    </div>
  );
};

export default ModifierCandidat;