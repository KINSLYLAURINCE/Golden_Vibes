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
import axios from "axios";

const AjouterCandidat = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    numero: "",
    nom: "",
    prenom: "",
    categorie: "",
    video_url: "",
    statut: "actif",
  });
  
  const [photos, setPhotos] = useState({
    photo1: null,
    photo2: null
  });

  const [photoPreviews, setPhotoPreviews] = useState({
    photo1: "",
    photo2: ""
  });

  /* Mise à jour des champs texte */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* Gestion des fichiers photos */
  const handlePhotoChange = (e, photoNumber) => {
    const file = e.target.files[0];
    if (file) {
      // Validation du type de fichier
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setError("Format de fichier non supporté. Utilisez JPG ou PNG.");
        return;
      }

      // Validation de la taille (5 Mo max)
      if (file.size > 5 * 1024 * 1024) {
        setError("Le fichier ne doit pas dépasser 5 Mo.");
        return;
      }

      setError("");
      
      // Mise à jour des photos
      setPhotos({
        ...photos,
        [photoNumber]: file
      });

      // Création de l'URL de prévisualisation
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreviews({
          ...photoPreviews,
          [photoNumber]: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  /* Soumission du formulaire */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!form.categorie) {
      setError("Veuillez sélectionner une catégorie");
      return;
    }

    if (!photos.photo1) {
      setError("La photo principale est obligatoire");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Création du FormData pour l'envoi des fichiers
      const formData = new FormData();
      
      // Ajout des champs texte
      formData.append('numero', form.numero);
      formData.append('nom', form.nom);
      formData.append('prenom', form.prenom);
      formData.append('categorie', form.categorie);
      formData.append('video_url', form.video_url);
      formData.append('statut', form.statut);
      
      // Ajout des photos
      if (photos.photo1) {
        formData.append('photo1', photos.photo1);
      }
      if (photos.photo2) {
        formData.append('photo2', photos.photo2);
      }

      // Appel API
      const token = localStorage.getItem('adminToken');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/candidats`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        alert("Candidat ajouté avec succès !");
        navigate("/admin/candidats");
      } else {
        setError(response.data.message || "Erreur lors de l'ajout du candidat");
      }
    } catch (err) {
      console.error("Erreur lors de l'ajout:", err);
      setError(
        err.response?.data?.message || 
        "Une erreur est survenue lors de l'ajout du candidat"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* En-tête */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 text-sm"
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Catégorie */}
        <div>
          <label className="block text-sm text-muted-foreground mb-2">
            Catégorie <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            {["miss", "master"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setForm({ ...form, categorie: cat })}
                disabled={loading}
                className={`flex-1 py-3 rounded-lg text-sm font-semibold uppercase tracking-wider transition-all ${
                  form.categorie === cat 
                    ? "gold-gradient text-primary-foreground" 
                    : "bg-secondary border border-border text-muted-foreground hover:border-primary/50"
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {cat === "miss" ? "👑 Miss" : "🤴 Master"}
              </button>
            ))}
          </div>
        </div>

        {/* Numéro et Nom */}
        <div className="grid grid-cols-3 gap-4">
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
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              Nom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              required
              placeholder="Nom du candidat"
              disabled={loading}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
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
              disabled={loading}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
            />
          </div>
        </div>

        {/* Photos */}
        <div className="grid grid-cols-2 gap-4">
          {[1, 2].map((n) => (
            <div key={n}>
              <label className="block text-sm text-muted-foreground mb-2">
                Photo {n} {n === 1 ? <span className="text-red-500">*</span> : ""}
              </label>
              <label 
                className={`flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors bg-secondary ${
                  photoPreviews[`photo${n}`] 
                    ? 'border-primary' 
                    : 'border-border hover:border-primary/50'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {photoPreviews[`photo${n}`] ? (
                  <img 
                    src={photoPreviews[`photo${n}`]} 
                    alt={`Aperçu photo ${n}`}
                    className="h-full w-full object-cover rounded-lg"
                  />
                ) : (
                  <>
                    <Upload size={24} className="text-muted-foreground mb-2" />
                    <span className="text-xs text-muted-foreground">JPG, PNG (max 5 Mo)</span>
                  </>
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
            name="video_url"
            value={form.video_url}
            onChange={handleChange}
            placeholder="https://youtube.com/watch?v=..."
            disabled={loading}
            className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          />
        </div>

        {/* Statut */}
        <div>
          <label className="block text-sm text-muted-foreground mb-2">Statut</label>
          <select
            name="statut"
            value={form.statut}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          >
            <option value="actif">Actif (visible sur le site)</option>
            <option value="inactif">Inactif (caché)</option>
          </select>
        </div>

        {/* Boutons */}
        <div className="flex gap-3 pt-4">
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
            className="flex-1 gold-gradient text-primary-foreground py-3 rounded-lg font-semibold uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50"
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
      </motion.form>
    </div>
  );
};

export default AjouterCandidat;