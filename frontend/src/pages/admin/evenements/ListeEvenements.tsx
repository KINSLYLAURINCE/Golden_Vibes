/**
 * Gestion des événements annexes (Admin)
 * -----------------------------------------
 * Liste complète, création, modification, duplication,
 * activation/désactivation et suppression des événements.
 * Photos gérées via table evenement_photos séparée.
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Edit, Trash2, Eye, Calendar, MapPin, Clock,
  X, Save, Copy, Filter, Loader2, Upload
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API_URL = "http://localhost:1002/api";
const STORAGE_URL = "http://localhost:1002/storage";

interface EvenementPhoto {
  id: number;
  evenement_id: number;
  photo: string;
}

interface Evenement {
  id: number;
  nom: string;
  date: string;
  heure: string;
  lieu: string;
  ville: string;
  theme: string;
  description: string;
  statut: "a_venir" | "en_cours" | "termine";
  photos?: EvenementPhoto[];
  created_at?: string;
  updated_at?: string;
}

const villesCameroun = [
  "Dschang", "Douala", "Yaoundé", "Bafoussam", "Bamenda",
  "Buea", "Limbé", "Kribi", "Garoua", "Maroua",
  "Bertoua", "Ebolowa", "Ngaoundéré",
];

const statutLabels = { a_venir: "À venir", en_cours: "En cours", termine: "Terminé" };
const statutColors = {
  a_venir: "bg-blue-500/20 text-blue-400",
  en_cours: "bg-green-500/20 text-green-400",
  termine: "bg-muted text-muted-foreground",
};

const emptyForm = {
  nom: "",
  date: "",
  heure: "",
  lieu: "",
  ville: "Dschang",
  theme: "",
  description: "",
  statut: "a_venir" as Evenement["statut"],
};

const ListeEvenements = () => {
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState<Evenement | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [filtreStatut, setFiltreStatut] = useState<string>("tous");
  const [error, setError] = useState("");

  // Photos : nouvelles à uploader
  const [newPhotos, setNewPhotos] = useState<File[]>([]);
  const [newPhotoPreviews, setNewPhotoPreviews] = useState<string[]>([]);

  // Photos existantes (mode édition)
  const [existingPhotos, setExistingPhotos] = useState<EvenementPhoto[]>([]);
  const [photosToDelete, setPhotosToDelete] = useState<number[]>([]);

  const token = localStorage.getItem("token");
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };

  /* Charger les événements */
  const fetchEvenements = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/admin/evenements`, axiosConfig);
      setEvenements(response.data.data || response.data);
    } catch (err) {
      console.error("Erreur chargement événements:", err);
      toast.error("Impossible de charger les événements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvenements();
  }, []);

  /* Filtres */
  const sorted = [...evenements]
    .filter((e) => filtreStatut === "tous" || e.statut === filtreStatut)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  /* URL photo */
  const getPhotoUrl = (photo: string) => {
    if (photo.startsWith("http")) return photo;
    return `${STORAGE_URL}/${photo}`;
  };

  /* Ouvrir formulaire */
  const ouvrir = (evt: Evenement | null = null) => {
    setError("");
    setNewPhotos([]);
    setNewPhotoPreviews([]);
    setPhotosToDelete([]);

    if (evt) {
      setEditId(evt.id);
      setForm({
        nom: evt.nom,
        date: evt.date,
        heure: evt.heure,
        lieu: evt.lieu,
        ville: evt.ville,
        theme: evt.theme || "",
        description: evt.description || "",
        statut: evt.statut,
      });
      setExistingPhotos(evt.photos || []);
    } else {
      setEditId(null);
      setForm(emptyForm);
      setExistingPhotos([]);
    }
    setShowForm(true);
  };

  /* Dupliquer */
  const dupliquer = (evt: Evenement) => {
    setError("");
    setEditId(null);
    setNewPhotos([]);
    setNewPhotoPreviews([]);
    setPhotosToDelete([]);
    setExistingPhotos([]);
    setForm({
      nom: evt.nom + " (copie)",
      date: "",
      heure: evt.heure,
      lieu: evt.lieu,
      ville: evt.ville,
      theme: evt.theme || "",
      description: evt.description || "",
      statut: "a_venir",
    });
    setShowForm(true);
    toast.info("Événement dupliqué — modifiez et sauvegardez.");
  };

  /* Gestion nouvelles photos */
  const handlePhotos = (e: any) => {
    const files = Array.from(e.target.files || []) as File[];
    const total = existingPhotos.length - photosToDelete.length + newPhotos.length + files.length;

    if (total > 10) {
      toast.error("Maximum 10 photos autorisées.");
      return;
    }

    // Validation type et taille
    for (const file of files) {
      if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
        toast.error("Format non supporté. Utilisez JPG ou PNG.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Chaque photo ne doit pas dépasser 5 Mo.");
        return;
      }
    }

    setNewPhotos((prev) => [...prev, ...files]);

    // Previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPhotoPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  /* Supprimer nouvelle photo (pas encore uploadée) */
  const removeNewPhoto = (idx: number) => {
    setNewPhotos((prev) => prev.filter((_, i) => i !== idx));
    setNewPhotoPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  /* Marquer photo existante pour suppression */
  const markPhotoForDeletion = (photoId: number) => {
    setPhotosToDelete((prev) =>
      prev.includes(photoId) ? prev.filter((id) => id !== photoId) : [...prev, photoId]
    );
  };

  /* Sauvegarder */
  const sauvegarder = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("nom", form.nom);
      formData.append("date", form.date);
      formData.append("heure", form.heure);
      formData.append("lieu", form.lieu);
      formData.append("ville", form.ville);
      formData.append("theme", form.theme);
      formData.append("description", form.description);
      formData.append("statut", form.statut);

      // Nouvelles photos
      newPhotos.forEach((file, i) => {
        formData.append(`photos[${i}]`, file);
      });

      // Photos à supprimer (mode édition)
      if (photosToDelete.length > 0) {
        photosToDelete.forEach((id, i) => {
          formData.append(`photos_to_delete[${i}]`, String(id));
        });
      }

      if (editId) {
        formData.append("_method", "PUT");
        const response = await axios.post(
          `${API_URL}/admin/evenements/${editId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const updated = response.data.data || response.data;
        setEvenements((prev) =>
          prev.map((ev) => (ev.id === editId ? updated : ev))
        );
        toast.success("Événement modifié !");
      } else {
        const response = await axios.post(
          `${API_URL}/admin/evenements`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setEvenements((prev) => [...prev, response.data.data || response.data]);
        toast.success("Événement créé !");
      }

      setShowForm(false);
    } catch (err: any) {
      console.error("Erreur sauvegarde:", err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Une erreur est survenue.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  /* Supprimer événement */
  const supprimer = async (id: number) => {
    if (!window.confirm("Supprimer cet événement ?")) return;
    try {
      await axios.delete(`${API_URL}/admin/evenements/${id}`, axiosConfig);
      setEvenements((prev) => prev.filter((e) => e.id !== id));
      toast.success("Événement supprimé.");
    } catch (err) {
      console.error("Erreur suppression:", err);
      toast.error("Erreur lors de la suppression.");
    }
  };

  /* Format date */
  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("fr-FR", {
      weekday: "short", day: "numeric", month: "short", year: "numeric",
    });

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl gold-text">Événements Annexes</h1>
          <p className="text-muted-foreground text-sm">
            {evenements.length} événement(s) • {sorted.length} affiché(s)
          </p>
        </div>
        <button
          onClick={() => ouvrir()}
          className="gold-gradient text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wider flex items-center gap-2"
        >
          <Plus size={18} /> Créer un événement
        </button>
      </div>

      {/* Filtres */}
      <div className="flex items-center gap-2 mb-4">
        <Filter size={16} className="text-muted-foreground" />
        {["tous", "a_venir", "en_cours", "termine"].map((s) => (
          <button
            key={s}
            onClick={() => setFiltreStatut(s)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              filtreStatut === s
                ? "border-primary bg-primary/20 text-primary"
                : "border-border text-muted-foreground hover:border-primary/50"
            }`}
          >
            {s === "tous" ? "Tous" : statutLabels[s as keyof typeof statutLabels]}
          </button>
        ))}
      </div>

      {/* Chargement */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Nom</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Date & Heure</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Lieu</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Thème</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Photos</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Statut</th>
                <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((evt) => (
                <tr
                  key={evt.id}
                  className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{evt.nom}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} className="text-primary" /> {fmtDate(evt.date)}
                    </div>
                    <div className="flex items-center gap-1 text-xs mt-0.5">
                      <Clock size={12} /> {evt.heure}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} className="text-primary" /> {evt.lieu}
                    </div>
                    <div className="text-xs mt-0.5">{evt.ville}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-primary">{evt.theme || "—"}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {evt.photos && evt.photos.length > 0 ? (
                      <div className="flex -space-x-2">
                        {evt.photos.slice(0, 3).map((p, i) => (
                          <img
                            key={i}
                            src={getPhotoUrl(p.photo)}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover border-2 border-card"
                            onError={(e: any) => { e.target.style.display = "none"; }}
                          />
                        ))}
                        {evt.photos.length > 3 && (
                          <div className="w-8 h-8 rounded-full bg-secondary border-2 border-card flex items-center justify-center text-xs text-muted-foreground">
                            +{evt.photos.length - 3}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground/50">Aucune</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${statutColors[evt.statut]}`}>
                      {statutLabels[evt.statut]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setShowDetail(evt)} className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground" title="Voir">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => ouvrir(evt)} className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground" title="Modifier">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => dupliquer(evt)} className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground" title="Dupliquer">
                        <Copy size={16} />
                      </button>
                      <button onClick={() => supprimer(evt.id)} className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-destructive" title="Supprimer">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-muted-foreground">
                    Aucun événement trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Détail */}
      <AnimatePresence>
        {showDetail && (
          <div
            className="fixed inset-0 bg-background/80 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetail(null)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-xl p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-2xl gold-text">{showDetail.nom}</h2>
                <button onClick={() => setShowDetail(null)} className="text-muted-foreground hover:text-foreground">
                  <X size={20} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase">Date</p>
                  <p className="text-sm text-foreground flex items-center gap-1">
                    <Calendar size={14} className="text-primary" /> {fmtDate(showDetail.date)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase">Heure</p>
                  <p className="text-sm text-foreground flex items-center gap-1">
                    <Clock size={14} className="text-primary" /> {showDetail.heure}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase">Lieu</p>
                  <p className="text-sm text-foreground flex items-center gap-1">
                    <MapPin size={14} className="text-primary" /> {showDetail.lieu}, {showDetail.ville}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase">Thème</p>
                  <p className="text-sm text-primary">{showDetail.theme || "—"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase">Statut</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${statutColors[showDetail.statut]}`}>
                    {statutLabels[showDetail.statut]}
                  </span>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-xs text-muted-foreground uppercase mb-1">Description</p>
                <p className="text-sm text-foreground whitespace-pre-line">{showDetail.description || "—"}</p>
              </div>
              {showDetail.photos && showDetail.photos.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase mb-2">
                    Photos ({showDetail.photos.length})
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {showDetail.photos.map((p, i) => (
                      <img
                        key={i}
                        src={getPhotoUrl(p.photo)}
                        alt=""
                        className="rounded-lg w-full aspect-video object-cover border border-border"
                        onError={(e: any) => { e.target.style.display = "none"; }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => { setShowDetail(null); ouvrir(showDetail); }}
                  className="flex-1 gold-gradient text-primary-foreground py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2"
                >
                  <Edit size={16} /> Modifier
                </button>
                <button
                  onClick={() => setShowDetail(null)}
                  className="flex-1 border border-border text-muted-foreground py-2.5 rounded-lg"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Formulaire */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 bg-background/80 z-50 flex items-center justify-center p-4">
            <motion.form
              onSubmit={sauvegarder}
              className="bg-card border border-border rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-4"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-display text-xl text-foreground">
                  {editId ? "Modifier" : "Créer"} un Événement
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
                <label className="block text-sm text-muted-foreground mb-1">Nom de l'événement *</label>
                <input type="text" name="nom" value={form.nom} onChange={handleChange} required
                  className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>

              {/* Date + Heure */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Date *</label>
                  <input type="date" name="date" value={form.date} onChange={handleChange} required
                    className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Heure *</label>
                  <input type="time" name="heure" value={form.heure} onChange={handleChange} required
                    className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
              </div>

              {/* Lieu + Ville */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Lieu précis *</label>
                  <input type="text" name="lieu" value={form.lieu} onChange={handleChange} required
                    placeholder="Ex: Hôtel Meumi Palace"
                    className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Ville *</label>
                  <select name="ville" value={form.ville} onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                    {villesCameroun.map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
              </div>

              {/* Thème */}
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Thème</label>
                <input type="text" name="theme" value={form.theme} onChange={handleChange}
                  placeholder='Ex : "Élégance Africaine"'
                  className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={4}
                  className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
              </div>

              {/* Photos existantes (mode édition) */}
              {editId && existingPhotos.length > 0 && (
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Photos existantes ({existingPhotos.length - photosToDelete.length} conservée(s))
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {existingPhotos.map((p) => (
                      <div key={p.id} className="relative group">
                        <img
                          src={getPhotoUrl(p.photo)}
                          alt=""
                          className={`rounded-lg w-full aspect-square object-cover border-2 transition-all ${
                            photosToDelete.includes(p.id)
                              ? "border-red-500 opacity-40"
                              : "border-border"
                          }`}
                          onError={(e: any) => { e.target.style.display = "none"; }}
                        />
                        <button
                          type="button"
                          onClick={() => markPhotoForDeletion(p.id)}
                          className={`absolute top-1 right-1 rounded-full p-0.5 text-white text-xs transition-opacity ${
                            photosToDelete.includes(p.id)
                              ? "bg-green-500 opacity-100"
                              : "bg-red-500 opacity-0 group-hover:opacity-100"
                          }`}
                        >
                          {photosToDelete.includes(p.id) ? (
                            <span className="px-1">↩</span>
                          ) : (
                            <X size={12} />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                  {photosToDelete.length > 0 && (
                    <p className="text-xs text-red-400 mt-1">
                      {photosToDelete.length} photo(s) seront supprimées à la sauvegarde.
                    </p>
                  )}
                </div>
              )}

              {/* Nouvelles photos */}
              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  {editId ? "Ajouter de nouvelles photos" : "Photos"} (max 10, JPG/PNG, 5 Mo)
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                  <input
                    type="file" multiple accept="image/jpeg,image/jpg,image/png"
                    onChange={handlePhotos} className="hidden" id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <Upload size={24} />
                    <span className="text-sm">Cliquer pour ajouter des photos</span>
                    <span className="text-xs">{newPhotos.length} nouvelle(s) photo(s) sélectionnée(s)</span>
                  </label>
                </div>
                {newPhotoPreviews.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {newPhotoPreviews.map((preview, i) => (
                      <div key={i} className="relative group">
                        <img
                          src={preview} alt=""
                          className="rounded-lg w-full aspect-square object-cover border border-border"
                        />
                        <button
                          type="button" onClick={() => removeNewPhoto(i)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Statut */}
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Statut</label>
                <select name="statut" value={form.statut} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                  <option value="a_venir">À venir</option>
                  <option value="en_cours">En cours</option>
                  <option value="termine">Terminé</option>
                </select>
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
                    <><Save size={16} /> {editId ? "Sauvegarder" : "Créer"}</>
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

export default ListeEvenements;