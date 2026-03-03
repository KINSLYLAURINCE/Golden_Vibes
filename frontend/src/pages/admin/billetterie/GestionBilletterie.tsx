/**
 * Gestion de la billetterie (Admin)
 * -----------------------------------------
 * Gestion des packs et liste des ventes.
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, X, Save, Package, ShoppingCart, Loader2 } from "lucide-react";
import axios from "axios";

const API_URL = "http://localhost:8000/api";

const emptyForm = {
  nom: "",
  prix: "",
  places_disponibles: "",
  avantages: "",
  statut: "en_vente",
};

const statutColors = {
  en_vente: "bg-green-500/20 text-green-400",
  epuise: "bg-red-500/20 text-red-400",
  inactif: "bg-muted text-muted-foreground",
};

const statutLabels = {
  en_vente: "En vente",
  epuise: "Épuisé",
  inactif: "Inactif",
};

const GestionBilletterie = () => {
  const [onglet, setOnglet] = useState("packs");

  // Packs
  const [packs, setPacks] = useState([]);
  const [loadingPacks, setLoadingPacks] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Billets/Ventes
  const [billets, setBillets] = useState([]);
  const [loadingBillets, setLoadingBillets] = useState(false);

  const token = localStorage.getItem("token");
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };

  /* Charger les packs */
  const fetchPacks = async () => {
    setLoadingPacks(true);
    try {
      const response = await axios.get(`${API_URL}/admin/packs`, axiosConfig);
      setPacks(response.data.data || response.data);
    } catch (err) {
      console.error("Erreur chargement packs:", err);
    } finally {
      setLoadingPacks(false);
    }
  };

  /* Charger les billets/ventes */
  const fetchBillets = async () => {
    setLoadingBillets(true);
    try {
      const response = await axios.get(`${API_URL}/admin/billets`, axiosConfig);
      setBillets(response.data.data || response.data);
    } catch (err) {
      console.error("Erreur chargement billets:", err);
    } finally {
      setLoadingBillets(false);
    }
  };

  useEffect(() => {
    fetchPacks();
  }, []);

  useEffect(() => {
    if (onglet === "ventes") fetchBillets();
  }, [onglet]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  /* Ouvrir formulaire */
  const ouvrir = (pack = null) => {
    setError("");
    if (pack) {
      setEditId(pack.id);
      setForm({
        nom: pack.nom,
        prix: pack.prix,
        places_disponibles: pack.places_disponibles,
        // Avantages : tableau JSON → une ligne par avantage
        avantages: Array.isArray(pack.avantages)
          ? pack.avantages.join("\n")
          : pack.avantages || "",
        statut: pack.statut,
      });
    } else {
      setEditId(null);
      setForm(emptyForm);
    }
    setShowForm(true);
  };

  /* Sauvegarder */
  const sauvegarder = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      // Convertir avantages (texte multi-ligne) en tableau JSON
      const avantagesArray = form.avantages
        .split("\n")
        .map((a) => a.trim())
        .filter((a) => a.length > 0);

      const payload = {
        nom: form.nom,
        prix: Number(form.prix),
        places_disponibles: Number(form.places_disponibles),
        avantages: avantagesArray,
        statut: form.statut,
      };

      if (editId) {
        const response = await axios.put(
          `${API_URL}/admin/packs/${editId}`,
          payload,
          axiosConfig
        );
        const updated = response.data.data || response.data;
        setPacks((prev) => prev.map((p) => (p.id === editId ? updated : p)));
      } else {
        const response = await axios.post(
          `${API_URL}/admin/packs`,
          payload,
          axiosConfig
        );
        setPacks((prev) => [...prev, response.data.data || response.data]);
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
    if (!window.confirm("Supprimer ce pack ?")) return;
    try {
      await axios.delete(`${API_URL}/admin/packs/${id}`, axiosConfig);
      setPacks((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Erreur suppression:", err);
      alert("Erreur lors de la suppression.");
    }
  };

  /* Totaux */
  const totalRevenu = packs.reduce((acc, p) => acc + p.places_vendues * p.prix, 0);
  const totalVendus = packs.reduce((acc, p) => acc + p.places_vendues, 0);
  const totalPlaces = packs.reduce((acc, p) => acc + p.places_disponibles, 0);

  return (
    <div>
      <h1 className="font-display text-3xl gold-text mb-2">Billetterie</h1>
      <p className="text-muted-foreground text-sm mb-6">Gestion des packs et suivi des ventes</p>

      {/* Stats rapides */}
      {!loadingPacks && packs.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Billets vendus</p>
            <p className="text-2xl font-bold text-primary">{totalVendus}<span className="text-sm text-muted-foreground">/{totalPlaces}</span></p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Taux de remplissage</p>
            <p className="text-2xl font-bold text-primary">
              {totalPlaces > 0 ? Math.round((totalVendus / totalPlaces) * 100) : 0}%
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Revenu total</p>
            <p className="text-2xl font-bold text-primary">{totalRevenu.toLocaleString()} <span className="text-sm">FCFA</span></p>
          </div>
        </div>
      )}

      {/* Onglets */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "packs", label: "Packs", icon: Package },
          { key: "ventes", label: "Ventes", icon: ShoppingCart },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setOnglet(tab.key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              onglet === tab.key
                ? "gold-gradient text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Onglet Packs */}
      {onglet === "packs" && (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => ouvrir()}
              className="gold-gradient text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wider flex items-center gap-2"
            >
              <Plus size={18} /> Nouveau Pack
            </button>
          </div>

          {loadingPacks ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-primary" />
            </div>
          ) : packs.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">Aucun pack créé.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {packs.map((p) => {
                const pct = p.places_disponibles > 0
                  ? Math.round((p.places_vendues / p.places_disponibles) * 100)
                  : 0;
                return (
                  <div key={p.id} className="bg-card border border-border rounded-xl p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-display text-lg text-foreground">{p.nom}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statutColors[p.statut]}`}>
                        {statutLabels[p.statut]}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-primary">
                      {Number(p.prix).toLocaleString()} <span className="text-sm">FCFA</span>
                    </p>

                    {/* Avantages */}
                    {Array.isArray(p.avantages) && p.avantages.length > 0 && (
                      <ul className="mt-2 space-y-0.5">
                        {p.avantages.slice(0, 3).map((a, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-center gap-1">
                            <span className="text-primary">✓</span> {a}
                          </li>
                        ))}
                        {p.avantages.length > 3 && (
                          <li className="text-xs text-muted-foreground">+{p.avantages.length - 3} autre(s)...</li>
                        )}
                      </ul>
                    )}

                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>{p.places_vendues}/{p.places_disponibles} vendus</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full gold-gradient rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mt-2">
                      Revenu : {(p.places_vendues * p.prix).toLocaleString()} FCFA
                    </p>

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => ouvrir(p)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-secondary hover:bg-secondary/80 rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Edit size={14} /> Modifier
                      </button>
                      <button
                        onClick={() => supprimer(p.id)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-secondary hover:bg-secondary/80 rounded-lg text-xs text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 size={14} /> Supprimer
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Onglet Ventes */}
      {onglet === "ventes" && (
        <>
          {loadingBillets ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-primary" />
            </div>
          ) : billets.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">Aucune vente enregistrée.</div>
          ) : (
            <div className="bg-card border border-border rounded-xl overflow-hidden overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    {["Commande", "Date", "Client", "Pack", "Qté", "Montant", "Paiement", "Statut"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {billets.map((v) => (
                    <tr key={v.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                      <td className="px-4 py-3 text-sm font-mono text-primary">
                        CMD-{String(v.id).padStart(3, "0")}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{v.created_at?.slice(0, 16).replace("T", " ")}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{v.nom_client || v.nom || "—"}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{v.pack?.nom || v.pack_nom || "—"}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{v.quantite || 1}</td>
                      <td className="px-4 py-3 text-sm text-primary font-bold">
                        {Number(v.montant || v.total || 0).toLocaleString()} FCFA
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{v.methode_paiement || v.paiement || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded ${
                          v.statut === "valide" || v.statut === "validé"
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {v.statut === "valide" || v.statut === "validé" ? "✅ Validé" : "⏳ En attente"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Modal Pack */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 bg-background/80 z-50 flex items-center justify-center p-4">
            <motion.form
              onSubmit={sauvegarder}
              className="bg-card border border-border rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto space-y-4"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl text-foreground">
                  {editId ? "Modifier" : "Nouveau"} Pack
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

              <div>
                <label className="block text-sm text-muted-foreground mb-1">Nom *</label>
                <input
                  name="nom" value={form.nom} onChange={handleChange} required
                  placeholder="Ex: VIP, Gold, Standard..."
                  className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Prix (FCFA) *</label>
                  <input
                    type="number" name="prix" value={form.prix} onChange={handleChange} required min="0"
                    className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Places disponibles *</label>
                  <input
                    type="number" name="places_disponibles" value={form.places_disponibles} onChange={handleChange} required min="1"
                    className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Avantages <span className="text-xs text-muted-foreground/60">(un par ligne)</span>
                </label>
                <textarea
                  name="avantages" value={form.avantages} onChange={handleChange} rows={4}
                  placeholder={"Accès VIP\nBoisson offerte\nPhoto souvenir"}
                  className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">Statut</label>
                <select
                  name="statut" value={form.statut} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="en_vente">En vente</option>
                  <option value="epuise">Épuisé</option>
                  <option value="inactif">Inactif</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button" onClick={() => setShowForm(false)} disabled={saving}
                  className="flex-1 border border-border text-muted-foreground py-2.5 rounded-lg hover:bg-secondary transition-colors disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="submit" disabled={saving}
                  className="flex-1 gold-gradient text-primary-foreground py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
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

export default GestionBilletterie;