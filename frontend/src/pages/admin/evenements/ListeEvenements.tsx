/**
 * Gestion des événements annexes (Admin)
 * -----------------------------------------
 * Liste complète, création, modification, duplication,
 * activation/désactivation et suppression des événements.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Edit, Trash2, Eye, Calendar, MapPin, Clock,
  ToggleLeft, ToggleRight, X, Save, Copy, Filter,
  Upload, Image as ImageIcon, ChevronDown
} from "lucide-react";
import { toast } from "sonner";

/* Types */
interface Evenement {
  id: number;
  nom: string;
  date: string;
  heureDebut: string;
  heureFin: string;
  lieu: string;
  ville: string;
  theme: string;
  descriptionCourte: string;
  descriptionDetaillee: string;
  photos: string[];
  statut: "a_venir" | "en_cours" | "termine";
  actif: boolean;
}

/* Données simulées */
const mockEvenements: Evenement[] = [
  {
    id: 1, nom: "Soirée Élégance Africaine", date: "2026-04-05",
    heureDebut: "19:00", heureFin: "23:00",
    lieu: "Hôtel Meumi Palace", ville: "Dschang",
    theme: "Élégance Africaine",
    descriptionCourte: "Une soirée prestigieuse célébrant la mode africaine.",
    descriptionDetaillee: "Grande soirée de gala mettant en lumière la richesse de la culture vestimentaire africaine. Défilés, cocktails et performances live.",
    photos: [], statut: "a_venir", actif: true,
  },
  {
    id: 2, nom: "Fashion Show Urbain", date: "2026-04-08",
    heureDebut: "20:00", heureFin: "00:00",
    lieu: "Place de la Mairie", ville: "Dschang",
    theme: "Mode Urbaine",
    descriptionCourte: "Défilé de mode urbaine en plein air.",
    descriptionDetaillee: "Un défilé de mode en plein cœur de la ville. Les créateurs locaux présentent leurs collections streetwear et prêt-à-porter.",
    photos: [], statut: "a_venir", actif: true,
  },
  {
    id: 3, nom: "Pool Party Dorée", date: "2026-04-10",
    heureDebut: "14:00", heureFin: "19:00",
    lieu: "Résidence Palm", ville: "Dschang",
    theme: "Summer Gold",
    descriptionCourte: "Pool party exclusive ambiance dorée.",
    descriptionDetaillee: "Après-midi détente au bord de la piscine avec DJ set, cocktails tropicaux et dress code doré.",
    photos: [], statut: "a_venir", actif: false,
  },
];

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
  nom: "", date: "", heureDebut: "", heureFin: "",
  lieu: "", ville: "Dschang", theme: "",
  descriptionCourte: "", descriptionDetaillee: "",
  statut: "a_venir" as Evenement["statut"], actif: true,
};

const ListeEvenements = () => {
  const [evenements, setEvenements] = useState<Evenement[]>(mockEvenements);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState<Evenement | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [filtreStatut, setFiltreStatut] = useState<string>("tous");
  const [photos, setPhotos] = useState<File[]>([]);

  /* Tri par date */
  const sorted = [...evenements]
    .filter((e) => filtreStatut === "tous" || e.statut === filtreStatut)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  /* Ouvrir le formulaire */
  const ouvrir = (evt: Evenement | null = null) => {
    if (evt) {
      setEditId(evt.id);
      setForm({
        nom: evt.nom, date: evt.date, heureDebut: evt.heureDebut, heureFin: evt.heureFin,
        lieu: evt.lieu, ville: evt.ville, theme: evt.theme,
        descriptionCourte: evt.descriptionCourte, descriptionDetaillee: evt.descriptionDetaillee,
        statut: evt.statut, actif: evt.actif,
      });
    } else {
      setEditId(null);
      setForm(emptyForm);
    }
    setPhotos([]);
    setShowForm(true);
  };

  /* Dupliquer */
  const dupliquer = (evt: Evenement) => {
    ouvrir(null);
    setForm({
      nom: evt.nom + " (copie)", date: "", heureDebut: evt.heureDebut, heureFin: evt.heureFin,
      lieu: evt.lieu, ville: evt.ville, theme: evt.theme,
      descriptionCourte: evt.descriptionCourte, descriptionDetaillee: evt.descriptionDetaillee,
      statut: "a_venir", actif: false,
    });
    toast.info("Événement dupliqué — modifiez et sauvegardez.");
  };

  /* Sauvegarder */
  const sauvegarder = (e: any) => {
    e.preventDefault();
    if (editId) {
      setEvenements(evenements.map((ev) => (ev.id === editId ? { ...ev, ...form, photos: ev.photos } : ev)));
      toast.success("Événement modifié !");
    } else {
      setEvenements([...evenements, { id: Date.now(), ...form, photos: [] }]);
      toast.success("Événement créé !");
    }
    setShowForm(false);
  };

  /* Supprimer */
  const supprimer = (id: number) => {
    if (window.confirm("Supprimer cet événement ?")) {
      setEvenements(evenements.filter((e) => e.id !== id));
      toast.success("Événement supprimé.");
    }
  };

  /* Toggle actif */
  const toggleActif = (id: number) => {
    setEvenements(evenements.map((e) => (e.id === id ? { ...e, actif: !e.actif } : e)));
    const ev = evenements.find((e) => e.id === id);
    toast.success(ev?.actif ? "Événement désactivé" : "Événement activé");
  };

  /* Photos */
  const handlePhotos = (e: any) => {
    const files = Array.from(e.target.files || []) as File[];
    if (photos.length + files.length > 10) {
      toast.error("Maximum 10 photos autorisées.");
      return;
    }
    setPhotos([...photos, ...files]);
  };
  const removePhoto = (idx: number) => setPhotos(photos.filter((_, i) => i !== idx));

  /* Format date */
  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl gold-text">Événements Annexes</h1>
          <p className="text-muted-foreground text-sm">{evenements.length} événement(s) • {sorted.length} affiché(s)</p>
        </div>
        <button onClick={() => ouvrir()} className="gold-gradient text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
          <Plus size={18} /> Créer un événement
        </button>
      </div>

      {/* Filtres */}
      <div className="flex items-center gap-2 mb-4">
        <Filter size={16} className="text-muted-foreground" />
        {["tous", "a_venir", "en_cours", "termine"].map((s) => (
          <button key={s} onClick={() => setFiltreStatut(s)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${filtreStatut === s ? "border-primary bg-primary/20 text-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}>
            {s === "tous" ? "Tous" : statutLabels[s as keyof typeof statutLabels]}
          </button>
        ))}
      </div>

      {/* Tableau */}
      <div className="bg-card border border-border rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Nom</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Date & Heure</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Lieu</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Thème</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Statut</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Visibilité</th>
              <th className="text-right px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((evt) => (
              <tr key={evt.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-foreground">{evt.nom}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1"><Calendar size={14} className="text-primary" /> {fmtDate(evt.date)}</div>
                  <div className="flex items-center gap-1 text-xs mt-0.5"><Clock size={12} /> {evt.heureDebut} – {evt.heureFin}</div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1"><MapPin size={14} className="text-primary" /> {evt.lieu}</div>
                  <div className="text-xs mt-0.5">{evt.ville}</div>
                </td>
                <td className="px-4 py-3 text-sm text-primary">{evt.theme}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${statutColors[evt.statut]}`}>
                    {statutLabels[evt.statut]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded ${evt.actif ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {evt.actif ? "Public" : "Masqué"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => setShowDetail(evt)} className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground" title="Voir"><Eye size={16} /></button>
                    <button onClick={() => ouvrir(evt)} className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground" title="Modifier"><Edit size={16} /></button>
                    <button onClick={() => dupliquer(evt)} className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground" title="Dupliquer"><Copy size={16} /></button>
                    <button onClick={() => toggleActif(evt.id)} className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground" title="Activer/Désactiver">
                      {evt.actif ? <ToggleRight size={16} className="text-primary" /> : <ToggleLeft size={16} />}
                    </button>
                    <button onClick={() => supprimer(evt.id)} className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-destructive" title="Supprimer"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr><td colSpan={7} className="text-center py-12 text-muted-foreground">Aucun événement trouvé.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Détail */}
      <AnimatePresence>
        {showDetail && (
          <div className="fixed inset-0 bg-background/80 z-50 flex items-center justify-center p-4" onClick={() => setShowDetail(null)}>
            <motion.div onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-xl p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto"
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-2xl gold-text">{showDetail.nom}</h2>
                <button onClick={() => setShowDetail(null)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase">Date</p>
                  <p className="text-sm text-foreground flex items-center gap-1"><Calendar size={14} className="text-primary" /> {fmtDate(showDetail.date)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase">Horaires</p>
                  <p className="text-sm text-foreground flex items-center gap-1"><Clock size={14} className="text-primary" /> {showDetail.heureDebut} – {showDetail.heureFin}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase">Lieu</p>
                  <p className="text-sm text-foreground flex items-center gap-1"><MapPin size={14} className="text-primary" /> {showDetail.lieu}, {showDetail.ville}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase">Thème</p>
                  <p className="text-sm text-primary">{showDetail.theme}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase">Statut</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${statutColors[showDetail.statut]}`}>{statutLabels[showDetail.statut]}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase">Visibilité</p>
                  <span className={`text-xs px-2 py-1 rounded ${showDetail.actif ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>{showDetail.actif ? "Public" : "Masqué"}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground uppercase mb-1">Description courte</p>
                  <p className="text-sm text-foreground">{showDetail.descriptionCourte || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase mb-1">Description détaillée</p>
                  <p className="text-sm text-foreground whitespace-pre-line">{showDetail.descriptionDetaillee || "—"}</p>
                </div>
              </div>
              {showDetail.photos.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground uppercase mb-2">Photos ({showDetail.photos.length})</p>
                  <div className="grid grid-cols-3 gap-2">
                    {showDetail.photos.map((p, i) => (
                      <img key={i} src={p} alt="" className="rounded-lg w-full aspect-video object-cover border border-border" />
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-3 mt-6">
                <button onClick={() => { setShowDetail(null); ouvrir(showDetail); }}
                  className="flex-1 gold-gradient text-primary-foreground py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2">
                  <Edit size={16} /> Modifier
                </button>
                <button onClick={() => setShowDetail(null)}
                  className="flex-1 border border-border text-muted-foreground py-2.5 rounded-lg">
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
            <motion.form onSubmit={sauvegarder}
              className="bg-card border border-border rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-4"
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}>
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-display text-xl text-foreground">{editId ? "Modifier" : "Créer"} un Événement</h2>
                <button type="button" onClick={() => setShowForm(false)} className="text-muted-foreground"><X size={20} /></button>
              </div>

              {/* Nom */}
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Nom de l'événement *</label>
                <input type="text" name="nom" value={form.nom} onChange={handleChange} required
                  className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>

              {/* Date + Heures */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Date *</label>
                  <input type="date" name="date" value={form.date} onChange={handleChange} required
                    className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Heure de début *</label>
                  <input type="time" name="heureDebut" value={form.heureDebut} onChange={handleChange} required
                    className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Heure de fin *</label>
                  <input type="time" name="heureFin" value={form.heureFin} onChange={handleChange} required
                    className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
              </div>

              {/* Lieu + Ville */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Lieu précis *</label>
                  <input type="text" name="lieu" value={form.lieu} onChange={handleChange} required placeholder="Adresse complète"
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
                <input type="text" name="theme" value={form.theme} onChange={handleChange} placeholder='Ex : "Élégance Africaine"'
                  className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>

              {/* Descriptions */}
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Description courte (2-3 lignes)</label>
                <textarea name="descriptionCourte" value={form.descriptionCourte} onChange={handleChange} rows={2}
                  className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Description détaillée</label>
                <textarea name="descriptionDetaillee" value={form.descriptionDetaillee} onChange={handleChange} rows={4}
                  className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
              </div>

              {/* Photos */}
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Photos (max 10)</label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                  <input type="file" multiple accept="image/*" onChange={handlePhotos} className="hidden" id="photo-upload" />
                  <label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <Upload size={24} />
                    <span className="text-sm">Cliquer pour ajouter des photos</span>
                    <span className="text-xs">{photos.length}/10 photos sélectionnées</span>
                  </label>
                </div>
                {photos.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {photos.map((file, i) => (
                      <div key={i} className="relative group">
                        <img src={URL.createObjectURL(file)} alt="" className="rounded-lg w-full aspect-square object-cover border border-border" />
                        <button type="button" onClick={() => removePhoto(i)}
                          className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Statut + Visibilité */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Statut</label>
                  <select name="statut" value={form.statut} onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                    <option value="a_venir">À venir</option>
                    <option value="en_cours">En cours</option>
                    <option value="termine">Terminé</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Affichage public</label>
                  <select name="actif" value={form.actif ? "oui" : "non"} onChange={(e) => setForm({ ...form, actif: e.target.value === "oui" })}
                    className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                    <option value="oui">Oui</option>
                    <option value="non">Non</option>
                  </select>
                </div>
              </div>

              {/* Boutons */}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-border text-muted-foreground py-2.5 rounded-lg hover:bg-secondary transition-colors">Annuler</button>
                <button type="submit" className="flex-1 gold-gradient text-primary-foreground py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2">
                  <Save size={16} /> {editId ? "Sauvegarder" : "Créer"}
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
