/**
 * Formulaire d'ajout de candidat (Admin)
 * -----------------------------------------
 * Permet d'ajouter un nouveau candidat avec
 * photos, vidéo et informations complètes.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, Save, Loader2 } from "lucide-react";

import { API_URL } from "@/services/api";

const AjouterCandidat = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    numero: "",
    nom: "",
    categorie: "",
    video: "",
    statut: "actif",
  });
  
  const [photos, setPhotos] = useState<{
    photo1: File | null;
    photo2: File | null;
  }>({
    photo1: null,
    photo2: null
  });

  const [photoPreviews, setPhotoPreviews] = useState({
    photo1: "",
    photo2: ""
  });

  /* Mise à jour des champs texte */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  /* Gestion des fichiers photos */
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>, photoNumber: 'photo1' | 'photo2') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setError("Format de fichier non supporté. Utilisez JPG ou PNG.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Le fichier ne doit pas dépasser 5 Mo.");
      return;
    }

    setError("");
    
    setPhotos(prev => ({ ...prev, [photoNumber]: file }));

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreviews(prev => ({ ...prev, [photoNumber]: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  /* Soumission du formulaire */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.categorie) {
      setError("Veuillez sélectionner une catégorie");
      return;
    }

    if (!photos.photo1) {
      setError("La photo principale est obligatoire");
      return;
    }

    if (!form.numero) {
      setError("Le numéro est obligatoire");
      return;
    }

    if (!form.nom) {
      setError("Le nom est obligatoire");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError("Vous n'êtes pas authentifié. Veuillez vous reconnecter.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('numero', form.numero);
      formData.append('nom', form.nom);
      formData.append('categorie', form.categorie);
      formData.append('video', form.video);
      formData.append('statut', form.statut);
      formData.append('votes_count', '0');
      
      if (photos.photo1) formData.append('photo1', photos.photo1);
      if (photos.photo2) formData.append('photo2', photos.photo2);

      const response = await fetch(`${API_URL}/admin/candidats`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("Candidat ajouté avec succès !");
        navigate("/admin/candidats");
      } else {
        setError(data.message || data.error || "Erreur lors de l'ajout du candidat");
      }
    } catch (err) {
      console.error("Erreur complète:", err);
      setError("Une erreur est survenue lors de l'ajout du candidat");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* En-tête */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 text-sm transition-colors"
        disabled={loading}
      >
        <ArrowLeft size={16} /> Retour
      </button>
      
      <h1 className="font-display text-3xl gold-text mb-8">Ajouter un Candidat</h1>

      {/* Message d'erreur */}
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
                disabled={loading}
                className={`flex-1 py-3 rounded-lg text-sm font-semibold uppercase tracking-wider transition-all ${
                  form.categorie === cat 
                    ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg" 
                    : "bg-secondary border border-border text-muted-foreground hover:border-primary/50"
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {cat === "miss" ? "👑 Miss" : "🤴 Master"}
              </button>
            ))}
          </div>
        </div>

        {/* Numéro et Nom complet */}
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
              disabled={loading}
              placeholder="Ex: 1"
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
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
              placeholder="Nom et prénom du candidat"
              disabled={loading}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
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
                    ? 'border-primary border-solid' 
                    : 'border-border hover:border-primary/50 hover:bg-secondary/80'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {photoPreviews[`photo${n}`] ? (
                  <img 
                    src={photoPreviews[`photo${n}`]} 
                    alt={`Aperçu photo ${n}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4">
                    <Upload size={32} className="text-muted-foreground mx-auto mb-2" />
                    <span className="text-xs text-muted-foreground block">
                      Cliquez pour uploader
                    </span>
                    <span className="text-xs text-muted-foreground/70 block mt-1">
                      JPG, PNG (max 5 Mo)
                    </span>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/jpeg,image/jpg,image/png" 
                  className="hidden"
                  onChange={(e) => handlePhotoChange(e, `photo${n}`)}
                  disabled={loading}
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
            placeholder="https://youtube.com/watch?v=... ou https://facebook.com/..."
            disabled={loading}
            className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Lien vers une vidéo YouTube ou Facebook (optionnel)
          </p>
        </div>

        {/* Statut */}
        <div>
          <label className="block text-sm text-muted-foreground mb-2">Statut</label>
          <select
            name="statut"
            value={form.statut}
            onChange={handleChange}
            disabled={loading}
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
            disabled={loading}
            className="flex-1 border border-border text-muted-foreground py-3 rounded-lg font-medium hover:bg-secondary transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-white py-3 rounded-lg font-semibold uppercase tracking-wider flex items-center justify-center gap-2 hover:from-amber-600 hover:to-yellow-600 transition-all disabled:opacity-50 shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                En cours...
              </>
            ) : (
              <>
                <Save size={18} /> Enregistrer
              </>
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

export default AjouterCandidat;