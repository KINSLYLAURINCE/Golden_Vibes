import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Edit, Trash2, X, Save, Package, ShoppingCart, Loader2, Upload, Mail, Phone,
  AlertCircle, CheckCircle, Info 
} from "lucide-react";
import axios from "axios";

import { API_URL, getImageUrl } from "@/services/api"; // ✅

const emptyForm = { nom: "", prix: "", places_disponibles: "", avantages: "", statut: "en_vente" };

const statutColors = {
  en_vente: "bg-amber-900/30 text-amber-400",
  epuise: "bg-red-900/30 text-red-400",
  inactif: "bg-muted text-muted-foreground",
};
const statutLabels = { en_vente: "En vente", epuise: "Épuisé", inactif: "Inactif" };

const paiementColors = {
  valide: "bg-amber-900/30 text-amber-400",
  echoue: "bg-red-900/30 text-red-400",
  en_attente: "bg-yellow-900/30 text-yellow-400",
};
const paiementLabels = {
  valide: "Validé",
  echoue: "Échoué",
  en_attente: "En attente",
};

const billetColors = {
  valide: "bg-amber-900/30 text-amber-400",
  utilise: "bg-muted text-muted-foreground",
  annule: "bg-red-900/30 text-red-400",
};
const billetLabels = {
  valide: "Valide",
  utilise: "Utilisé",
  annule: "Annulé",
};

const alertConfig = {
  success: {
    icon: CheckCircle,
    bgColor: "from-amber-500/20 via-yellow-500/20 to-amber-500/20",
    borderColor: "border-amber-500/30",
    textColor: "text-amber-400",
    glowColor: "shadow-amber-500/30",
    progressColor: "bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400"
  },
  error: {
    icon: AlertCircle,
    bgColor: "from-amber-600/20 via-yellow-600/20 to-amber-600/20",
    borderColor: "border-amber-600/30",
    textColor: "text-amber-500",
    glowColor: "shadow-amber-600/30",
    progressColor: "bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500"
  },
  info: {
    icon: Info,
    bgColor: "from-amber-400/20 via-yellow-400/20 to-amber-400/20",
    borderColor: "border-amber-400/30",
    textColor: "text-amber-300",
    glowColor: "shadow-amber-400/30",
    progressColor: "bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-300"
  }
};

const GestionBilletterie = () => {
  const [onglet, setOnglet] = useState("packs");
  const [packs, setPacks] = useState([]);
  const [loadingPacks, setLoadingPacks] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [existingImage, setExistingImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [billets, setBillets] = useState([]);
  const [loadingBillets, setLoadingBillets] = useState(false);
  const [selectedBillet, setSelectedBillet] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const [filtreStatutPaiement, setFiltreStatutPaiement] = useState("tous");
  const [filtreStatutBillet, setFiltreStatutBillet] = useState("tous");
  const [recherche, setRecherche] = useState("");

  const token = localStorage.getItem("token");
  const axiosConfig = { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: "", message: "" }), 5000);
  };

  const fetchPacks = async () => {
    setLoadingPacks(true);
    try {
      const res = await axios.get(`${API_URL}/admin/packs`, axiosConfig);
      setPacks(res.data.data || res.data);
    } catch (err) {
      console.error("Erreur packs:", err);
      showAlert("error", "Impossible de charger les packs");
    } finally {
      setLoadingPacks(false);
    }
  };

  const fetchBillets = async () => {
    setLoadingBillets(true);
    try {
      const res = await axios.get(`${API_URL}/admin/billets`, axiosConfig);
      setBillets(res.data.data || res.data);
    } catch (err) {
      console.error("Erreur billets:", err);
      showAlert("error", "Impossible de charger les ventes");
    } finally {
      setLoadingBillets(false);
    }
  };

  useEffect(() => { fetchPacks(); }, []);
  useEffect(() => { if (onglet === "ventes") fetchBillets(); }, [onglet]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)) {
      setError("Format non supporté. Utilisez JPG, PNG ou WebP.");
      showAlert("error", "Format non supporté. Utilisez JPG, PNG ou WebP.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("L'image ne doit pas dépasser 5 Mo.");
      showAlert("error", "L'image ne doit pas dépasser 5 Mo.");
      return;
    }
    setError("");
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
    showAlert("success", "Image ajoutée avec succès");
  };

  const ouvrir = (pack = null) => {
    setError(""); setImage(null); setImagePreview("");
    if (pack) {
      setEditId(pack.id);
      setForm({
        nom: pack.nom, prix: pack.prix,
        places_disponibles: pack.places_disponibles,
        avantages: Array.isArray(pack.avantages) ? pack.avantages.join("\n") : pack.avantages || "",
        statut: pack.statut,
      });
      setExistingImage(pack.image || "");
    } else {
      setEditId(null); setForm(emptyForm); setExistingImage("");
    }
    setShowForm(true);
  };

  const sauvegarder = async (e) => {
    e.preventDefault(); setSaving(true); setError("");
    try {
      const avantagesArray = form.avantages.split("\n").map(a => a.trim()).filter(a => a.length > 0);
      if (image) {
        const fd = new FormData();
        fd.append("nom", form.nom);
        fd.append("prix", Number(form.prix));
        fd.append("places_disponibles", Number(form.places_disponibles));
        avantagesArray.forEach((a, i) => fd.append(`avantages[${i}]`, a));
        fd.append("statut", form.statut);
        fd.append("image", image);
        const headers = { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" };
        if (editId) {
          fd.append("_method", "PUT");
          const res = await axios.post(`${API_URL}/admin/packs/${editId}`, fd, { headers });
          setPacks(prev => prev.map(p => p.id === editId ? (res.data.data || res.data) : p));
          showAlert("success", "Pack modifié avec succès");
        } else {
          const res = await axios.post(`${API_URL}/admin/packs`, fd, { headers });
          setPacks(prev => [...prev, res.data.data || res.data]);
          showAlert("success", "Pack créé avec succès");
        }
      } else {
        const payload = {
          nom: form.nom, prix: Number(form.prix),
          places_disponibles: Number(form.places_disponibles),
          avantages: avantagesArray, statut: form.statut,
        };
        if (editId) {
          const res = await axios.put(`${API_URL}/admin/packs/${editId}`, payload, axiosConfig);
          setPacks(prev => prev.map(p => p.id === editId ? (res.data.data || res.data) : p));
          showAlert("success", "Pack modifié avec succès");
        } else {
          const res = await axios.post(`${API_URL}/admin/packs`, payload, axiosConfig);
          setPacks(prev => [...prev, res.data.data || res.data]);
          showAlert("success", "Pack créé avec succès");
        }
      }
      setShowForm(false);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || "Une erreur est survenue";
      setError(msg);
      showAlert("error", msg);
    } finally {
      setSaving(false);
    }
  };

  const supprimer = async (id) => {
    if (!window.confirm("Supprimer ce pack ?")) return;
    try {
      await axios.delete(`${API_URL}/admin/packs/${id}`, axiosConfig);
      setPacks(prev => prev.filter(p => p.id !== id));
      showAlert("success", "Pack supprimé avec succès");
    } catch (err) {
      showAlert("error", err.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  const billetsFiltres = billets.filter(v => {
    const matchPaiement = filtreStatutPaiement === "tous" || v.statut_paiement === filtreStatutPaiement;
    const matchBillet = filtreStatutBillet === "tous" || v.statut_billet === filtreStatutBillet;
    const matchRecherche = !recherche ||
      v.nom_client?.toLowerCase().includes(recherche.toLowerCase()) ||
      v.email?.toLowerCase().includes(recherche.toLowerCase()) ||
      v.telephone?.includes(recherche) ||
      v.transaction_id?.toLowerCase().includes(recherche.toLowerCase()) ||
      v.qr_code?.toLowerCase().includes(recherche.toLowerCase());
    return matchPaiement && matchBillet && matchRecherche;
  });

  const totalRevenu = packs.reduce((acc, p) => acc + p.places_vendues * p.prix, 0);
  const totalVendus = packs.reduce((acc, p) => acc + p.places_vendues, 0);
  const totalPlaces = packs.reduce((acc, p) => acc + p.places_disponibles, 0);

  return (
    <div className="relative">
      {/* Alert System */}
      <AnimatePresence>
        {alert.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4"
          >
            <motion.div
              className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${alertConfig[alert.type]?.bgColor} backdrop-blur-xl border ${alertConfig[alert.type]?.borderColor} shadow-2xl ${alertConfig[alert.type]?.glowColor}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="relative p-4">
                <div className="flex items-start gap-3">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"] }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    className="p-2 rounded-xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm"
                  >
                    {alert.type === "success" && <CheckCircle size={28} className="text-amber-400" />}
                    {alert.type === "error" && <AlertCircle size={28} className="text-amber-500" />}
                    {alert.type === "info" && <Info size={28} className="text-amber-300" />}
                  </motion.div>
                  <div className="flex-1">
                    <motion.h3
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                      className={`font-bold text-lg ${alertConfig[alert.type]?.textColor}`}
                    >
                      {alert.type === "success" && "Succès"}
                      {alert.type === "error" && "Erreur"}
                      {alert.type === "info" && "Information"}
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                      className="text-white/90 text-sm mt-0.5"
                    >
                      {alert.message}
                    </motion.p>
                    <motion.div
                      className="flex gap-1 mt-2"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                    >
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="h-1 w-8 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400"
                          animate={{ scaleY: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
                        />
                      ))}
                    </motion.div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
                    onClick={() => setAlert({ show: false, type: "", message: "" })}
                    className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <X size={16} className="text-white/70" />
                  </motion.button>
                </div>
                <motion.div
                  initial={{ width: "100%" }} animate={{ width: "0%" }}
                  transition={{ duration: 5, ease: "linear" }}
                  className={`absolute bottom-0 left-0 h-1 ${alertConfig[alert.type]?.progressColor}`}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <h1 className="font-display text-3xl gold-text mb-2">Billetterie</h1>
      <p className="text-muted-foreground text-sm mb-6">Gestion des packs et suivi des ventes</p>

      {/* Stats */}
      {!loadingPacks && packs.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Billets vendus", value: `${totalVendus}`, suffix: `/${totalPlaces}`, delay: 0.1 },
            { label: "Taux remplissage", value: `${totalPlaces > 0 ? Math.round((totalVendus / totalPlaces) * 100) : 0}%`, delay: 0.2 },
            { label: "Revenu total", value: `${totalRevenu.toLocaleString()}`, suffix: " FCFA", delay: 0.3 },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: s.delay }}
              className="bg-card border border-border rounded-xl p-4"
            >
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{s.label}</p>
              <p className="text-2xl font-bold text-amber-400">
                {s.value}
                {s.suffix && <span className="text-sm text-muted-foreground">{s.suffix}</span>}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Onglets */}
      <div className="flex gap-2 mb-6">
        {[{ key: "packs", label: "Packs", icon: Package }, { key: "ventes", label: "Ventes", icon: ShoppingCart }].map((tab, index) => (
          <motion.button
            key={tab.key}
            onClick={() => setOnglet(tab.key)}
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              onglet === tab.key
                ? "gold-gradient text-primary-foreground scale-105 shadow-lg"
                : "bg-secondary text-muted-foreground hover:text-foreground hover:scale-105"
            }`}
          >
            <tab.icon size={16} /> {tab.label}
            {tab.key === "ventes" && billets.length > 0 && (
              <span className="bg-amber-900/30 text-amber-400 text-xs px-1.5 py-0.5 rounded-full">{billets.length}</span>
            )}
          </motion.button>
        ))}
      </div>

      {/* ── Onglet Packs ── */}
      {onglet === "packs" && (
        <>
          <div className="flex justify-end mb-4">
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => ouvrir()}
              className="gold-gradient text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wider flex items-center gap-2"
            >
              <Plus size={18} /> Nouveau Pack
            </motion.button>
          </div>

          {loadingPacks ? (
            <div className="flex items-center justify-center py-20">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                <Loader2 size={32} className="text-amber-400" />
              </motion.div>
            </div>
          ) : packs.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20 text-muted-foreground">
              Aucun pack créé.
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {packs.map((p, index) => {
                const pct = p.places_disponibles > 0 ? Math.round((p.places_vendues / p.places_disponibles) * 100) : 0;
                const imageUrl = getImageUrl(p.image); // ✅
                return (
                  <motion.div
                    key={p.id}
                    className="bg-card border border-border rounded-xl overflow-hidden"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, boxShadow: "0 10px 30px -15px rgba(245,158,11,0.3)" }}
                  >
                    {imageUrl ? (
                      <div className="w-full h-32 overflow-hidden">
                        <motion.img
                          whileHover={{ scale: 1.1 }}
                          src={imageUrl}
                          alt={p.nom}
                          className="w-full h-full object-cover"
                          onError={e => { e.target.style.display = "none"; }}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-32 bg-secondary flex items-center justify-center">
                        <Package size={32} className="text-muted-foreground" />
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-display text-lg text-foreground">{p.nom}</h3>
                        <motion.span
                          animate={p.statut === "en_vente" ? { boxShadow: ["0 0 0 0 rgba(245,158,11,0.4)", "0 0 0 10px rgba(245,158,11,0)"] } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                          className={`text-xs px-2 py-0.5 rounded-full ${statutColors[p.statut]}`}
                        >
                          {statutLabels[p.statut]}
                        </motion.span>
                      </div>
                      <p className="text-2xl font-bold text-amber-400">{Number(p.prix).toLocaleString()} <span className="text-sm">FCFA</span></p>
                      {Array.isArray(p.avantages) && p.avantages.length > 0 && (
                        <ul className="mt-2 space-y-0.5">
                          {p.avantages.slice(0, 3).map((a, i) => (
                            <li key={i} className="text-xs text-muted-foreground flex items-center gap-1">
                              <span className="text-amber-400">✓</span> {a}
                            </li>
                          ))}
                          {p.avantages.length > 3 && <li className="text-xs text-muted-foreground">+{p.avantages.length - 3} autre(s)...</li>}
                        </ul>
                      )}
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>{p.places_vendues}/{p.places_disponibles} vendus</span><span>{pct}%</span>
                        </div>
                        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: index * 0.1 }}
                            className="h-full gold-gradient rounded-full"
                          />
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">Revenu : {(p.places_vendues * p.prix).toLocaleString()} FCFA</p>
                      <div className="flex gap-2 mt-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          onClick={() => ouvrir(p)}
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-secondary hover:bg-secondary/80 rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Edit size={14} /> Modifier
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          onClick={() => supprimer(p.id)}
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-secondary hover:bg-secondary/80 rounded-lg text-xs text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 size={14} /> Supprimer
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ── Onglet Ventes ── */}
      {onglet === "ventes" && (
        <>
          <div className="flex flex-wrap gap-3 mb-4">
            <input
              type="text"
              placeholder="Rechercher (nom, email, tél, ref...)"
              value={recherche}
              onChange={e => setRecherche(e.target.value)}
              className="flex-1 min-w-[200px] px-4 py-2 bg-secondary border border-border rounded-lg text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <select
              value={filtreStatutPaiement}
              onChange={e => setFiltreStatutPaiement(e.target.value)}
              className="px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="tous">Tous les paiements</option>
              <option value="valide">Validés</option>
              <option value="en_attente">En attente</option>
              <option value="echoue">Échoués</option>
            </select>
            <select
              value={filtreStatutBillet}
              onChange={e => setFiltreStatutBillet(e.target.value)}
              className="px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="tous">Tous les billets</option>
              <option value="valide">Valides</option>
              <option value="utilise">Utilisés</option>
              <option value="annule">Annulés</option>
            </select>
          </div>

          <p className="text-xs text-muted-foreground mb-3">{billetsFiltres.length} résultat(s)</p>

          {loadingBillets ? (
            <div className="flex items-center justify-center py-20">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                <Loader2 size={32} className="text-amber-400" />
              </motion.div>
            </div>
          ) : billetsFiltres.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20 text-muted-foreground">
              Aucune vente trouvée.
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-xl overflow-hidden overflow-x-auto"
            >
              <table className="w-full min-w-[1100px]">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    {["Réf.", "Date", "Client", "Contact", "Pack", "Qté", "Montant", "Mode", "QR Code", "Paiement", "Billet"].map(h => (
                      <th key={h} className="text-left px-3 py-3 text-xs uppercase tracking-wider text-muted-foreground whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {billetsFiltres.map((v, index) => (
                    <motion.tr
                      key={v.id}
                      className="border-b border-border last:border-0 hover:bg-secondary/30 cursor-pointer"
                      onClick={() => setSelectedBillet(v)}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.001, backgroundColor: "rgba(245,158,11,0.05)" }}
                    >
                      <td className="px-3 py-3 text-xs font-mono text-amber-400 whitespace-nowrap">
                        {v.transaction_id?.slice(0, 16) || `CMD-${String(v.id).padStart(3, "0")}`}
                      </td>
                      <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {v.created_at?.slice(0, 16).replace("T", " ")}
                      </td>
                      <td className="px-3 py-3">
                        <p className="text-sm text-foreground font-medium">{v.nom_client || "—"}</p>
                      </td>
                      <td className="px-3 py-3">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail size={10} className="text-amber-400" /> {v.email || "—"}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Phone size={10} className="text-amber-400" /> {v.telephone || "—"}
                        </p>
                      </td>
                      <td className="px-3 py-3 text-sm text-foreground whitespace-nowrap">{v.pack?.nom || "—"}</td>
                      <td className="px-3 py-3 text-sm text-foreground text-center">{v.quantite || 1}</td>
                      <td className="px-3 py-3 text-sm text-amber-400 font-bold whitespace-nowrap">
                        {Number(v.montant_total || 0).toLocaleString()} FCFA
                      </td>
                      <td className="px-3 py-3 text-xs text-muted-foreground capitalize">{v.mode_paiement || "—"}</td>
                      <td className="px-3 py-3">
                        <span className="text-xs font-mono text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                          {v.qr_code?.slice(0, 12) || "—"}
                        </span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <motion.span
                          animate={v.statut_paiement === "valide" ? { boxShadow: ["0 0 0 0 rgba(245,158,11,0.4)", "0 0 0 10px rgba(245,158,11,0)"] } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                          className={`text-xs px-2 py-1 rounded-full ${paiementColors[v.statut_paiement] || "bg-muted text-muted-foreground"}`}
                        >
                          {paiementLabels[v.statut_paiement] || v.statut_paiement}
                        </motion.span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className={`text-xs px-2 py-1 rounded-full ${billetColors[v.statut_billet] || "bg-muted text-muted-foreground"}`}>
                          {billetLabels[v.statut_billet] || v.statut_billet || "—"}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </>
      )}

      {/* ── Modal détail billet ── */}
      <AnimatePresence>
        {selectedBillet && (
          <div className="fixed inset-0 bg-background/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedBillet(null)}>
            <motion.div
              className="bg-card border border-border rounded-xl p-6 w-full max-w-md space-y-4"
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl text-foreground">Détail du billet</h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedBillet(null)} className="text-muted-foreground hover:text-foreground"
                >
                  <X size={20} />
                </motion.button>
              </div>
              <div className="space-y-3 text-sm">
                {[
                  { label: "Référence",       value: selectedBillet.transaction_id, mono: true, gold: true },
                  { label: "QR Code",         value: selectedBillet.qr_code,        mono: true             },
                  { label: "Client",          value: selectedBillet.nom_client                              },
                  { label: "Email",           value: selectedBillet.email                                   },
                  { label: "Téléphone",       value: selectedBillet.telephone                               },
                  { label: "Pack",            value: selectedBillet.pack?.nom || "—"                        },
                  { label: "Quantité",        value: selectedBillet.quantite                                },
                  { label: "Mode paiement",   value: selectedBillet.mode_paiement, capitalize: true         },
                  { label: "Date commande",   value: selectedBillet.created_at?.slice(0, 16).replace("T", " "), small: true },
                ].map(row => (
                  <div key={row.label} className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className={`${row.gold ? "text-amber-400" : "text-foreground"} ${row.mono ? "font-mono text-xs" : ""} ${row.capitalize ? "capitalize" : ""} ${row.small ? "text-xs" : ""}`}>
                      {row.value}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Montant total</span>
                  <span className="text-amber-400 font-bold">{Number(selectedBillet.montant_total).toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Statut paiement</span>
                  <motion.span
                    animate={selectedBillet.statut_paiement === "valide" ? { boxShadow: ["0 0 0 0 rgba(245,158,11,0.4)", "0 0 0 10px rgba(245,158,11,0)"] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`text-xs px-2 py-1 rounded-full ${paiementColors[selectedBillet.statut_paiement]}`}
                  >
                    {paiementLabels[selectedBillet.statut_paiement]}
                  </motion.span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Statut billet</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${billetColors[selectedBillet.statut_billet]}`}>
                    {billetLabels[selectedBillet.statut_billet] || "—"}
                  </span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedBillet(null)}
                className="w-full gold-gradient text-primary-foreground py-2.5 rounded-lg font-semibold text-sm"
              >
                Fermer
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Modal Pack (formulaire) ── */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 bg-background/80 z-50 flex items-center justify-center p-4">
            <motion.form
              onSubmit={sauvegarder}
              className="bg-card border border-border rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto space-y-4"
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl text-foreground">{editId ? "Modifier" : "Nouveau"} Pack</h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
                  type="button" onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"
                >
                  <X size={20} />
                </motion.button>
              </div>

              {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">{error}</div>}

              <div>
                <label className="block text-sm text-muted-foreground mb-1">Nom *</label>
                <input name="nom" value={form.nom} onChange={handleChange} required placeholder="Ex: VIP, Gold..."
                  className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500" />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Image <span className="text-xs text-muted-foreground/60">(JPG, PNG, WebP — max 5 Mo)</span>
                </label>
                <label className={`flex flex-col items-center justify-center h-36 border-2 border-dashed rounded-lg cursor-pointer transition-all bg-secondary overflow-hidden ${imagePreview || existingImage ? "border-amber-500 border-solid" : "border-border hover:border-amber-500/50"}`}>
                  {imagePreview ? (
                    <motion.img
                      initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      src={imagePreview} alt="Preview" className="h-full w-full object-cover"
                    />
                  ) : existingImage ? (
                    <div className="relative w-full h-full">
                      <img
                        src={getImageUrl(existingImage)} // ✅
                        alt="Actuelle" className="h-full w-full object-cover"
                        onError={e => { e.target.style.display = "none"; }}
                      />
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs text-white bg-black/60 px-2 py-0.5 rounded whitespace-nowrap">
                        Cliquer pour remplacer
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Upload size={24} /><span className="text-xs">Cliquer pour ajouter une image</span>
                    </div>
                  )}
                  <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden" onChange={handleImage} />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Prix (FCFA) *</label>
                  <input type="number" name="prix" value={form.prix} onChange={handleChange} required min="0"
                    className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500" />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Places *</label>
                  <input type="number" name="places_disponibles" value={form.places_disponibles} onChange={handleChange} required min="1"
                    className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Avantages <span className="text-xs text-muted-foreground/60">(un par ligne)</span>
                </label>
                <textarea name="avantages" value={form.avantages} onChange={handleChange} rows={4}
                  placeholder={"Accès VIP\nBoisson offerte\nPhoto souvenir"}
                  className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-amber-500" />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">Statut</label>
                <select name="statut" value={form.statut} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500">
                  <option value="en_vente">En vente</option>
                  <option value="epuise">Épuisé</option>
                  <option value="inactif">Inactif</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  type="button" onClick={() => setShowForm(false)} disabled={saving}
                  className="flex-1 border border-border text-muted-foreground py-2.5 rounded-lg hover:bg-secondary transition-colors disabled:opacity-50"
                >
                  Annuler
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  type="submit" disabled={saving}
                  className="flex-1 gold-gradient text-primary-foreground py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving
                    ? <><Loader2 size={16} className="animate-spin" /> En cours...</>
                    : <><Save size={16} /> {editId ? "Sauvegarder" : "Créer"}</>
                  }
                </motion.button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GestionBilletterie;