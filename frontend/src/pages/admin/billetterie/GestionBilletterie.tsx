/**
 * Gestion de la billetterie (Admin)
 * -----------------------------------------
 * Gestion des packs et liste des ventes.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Eye, X, Save, Package, ShoppingCart } from "lucide-react";

/* Packs simulés */
const mockPacks = [
  { id: 1, nom: "Standard", prix: 2000, places: 200, vendus: 120, actif: true },
  { id: 2, nom: "Gold", prix: 5000, places: 100, vendus: 67, actif: true },
  { id: 3, nom: "VIP", prix: 10000, places: 50, vendus: 38, actif: true },
  { id: 4, nom: "Groupe (5 billets)", prix: 8000, places: 30, vendus: 12, actif: true },
];

/* Ventes simulées */
const mockVentes = [
  { id: "CMD-001", date: "2026-03-15 14:30", nom: "Jean Mbarga", pack: "VIP", quantite: 2, montant: 20000, paiement: "Orange Money", statut: "validé" },
  { id: "CMD-002", date: "2026-03-15 15:10", nom: "Marie Ngo", pack: "Gold", quantite: 1, montant: 5000, paiement: "MTN MoMo", statut: "validé" },
  { id: "CMD-003", date: "2026-03-15 16:00", nom: "Paul Teka", pack: "Standard", quantite: 4, montant: 8000, paiement: "Orange Money", statut: "en_attente" },
  { id: "CMD-004", date: "2026-03-14 12:00", nom: "Alice Fon", pack: "VIP", quantite: 1, montant: 10000, paiement: "MTN MoMo", statut: "validé" },
];

const GestionBilletterie = () => {
  const [onglet, setOnglet] = useState("packs");
  const [packs, setPacks] = useState(mockPacks);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nom: "", prix: "", places: "", avantages: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const sauvegarder = (e) => {
    e.preventDefault();
    setPacks([...packs, { id: Date.now(), nom: form.nom, prix: Number(form.prix), places: Number(form.places), vendus: 0, actif: true }]);
    setShowForm(false);
  };

  return (
    <div>
      <h1 className="font-display text-3xl gold-text mb-2">Billetterie</h1>
      <p className="text-muted-foreground text-sm mb-6">Gestion des packs et suivi des ventes</p>

      {/* Onglets */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "packs", label: "Packs", icon: Package },
          { key: "ventes", label: "Ventes", icon: ShoppingCart },
        ].map((tab) => (
          <button key={tab.key} onClick={() => setOnglet(tab.key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              onglet === tab.key ? "gold-gradient text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}>
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Onglet Packs */}
      {onglet === "packs" && (
        <>
          <div className="flex justify-end mb-4">
            <button onClick={() => setShowForm(true)} className="gold-gradient text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
              <Plus size={18} /> Nouveau Pack
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {packs.map((p) => {
              const pct = Math.round((p.vendus / p.places) * 100);
              return (
                <div key={p.id} className="bg-card border border-border rounded-xl p-5">
                  <h3 className="font-display text-lg text-foreground">{p.nom}</h3>
                  <p className="text-2xl font-bold text-primary">{p.prix.toLocaleString()} <span className="text-sm">FCFA</span></p>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>{p.vendus}/{p.places} vendus</span><span>{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full gold-gradient rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Revenu : {(p.vendus * p.prix).toLocaleString()} FCFA</p>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Onglet Ventes */}
      {onglet === "ventes" && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                {["Commande", "Date", "Client", "Pack", "Qté", "Montant", "Paiement", "Statut"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockVentes.map((v) => (
                <tr key={v.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                  <td className="px-4 py-3 text-sm font-mono text-primary">{v.id}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{v.date}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{v.nom}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{v.pack}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{v.quantite}</td>
                  <td className="px-4 py-3 text-sm text-primary font-bold">{v.montant.toLocaleString()} FCFA</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{v.paiement}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded ${v.statut === "validé" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {v.statut === "validé" ? "✅ Validé" : "⏳ En attente"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal nouveau pack */}
      {showForm && (
        <div className="fixed inset-0 bg-background/80 z-50 flex items-center justify-center p-4">
          <motion.form onSubmit={sauvegarder} className="bg-card border border-border rounded-xl p-6 w-full max-w-md space-y-4" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl text-foreground">Nouveau Pack</h2>
              <button type="button" onClick={() => setShowForm(false)} className="text-muted-foreground"><X size={20} /></button>
            </div>
            <div><label className="block text-sm text-muted-foreground mb-1">Nom *</label><input name="nom" value={form.nom} onChange={handleChange} required className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary" /></div>
            <div><label className="block text-sm text-muted-foreground mb-1">Prix (FCFA) *</label><input type="number" name="prix" value={form.prix} onChange={handleChange} required className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary" /></div>
            <div><label className="block text-sm text-muted-foreground mb-1">Nombre de places *</label><input type="number" name="places" value={form.places} onChange={handleChange} required className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary" /></div>
            <div><label className="block text-sm text-muted-foreground mb-1">Avantages (un par ligne)</label><textarea name="avantages" value={form.avantages} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary" /></div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-border text-muted-foreground py-2.5 rounded-lg">Annuler</button>
              <button type="submit" className="flex-1 gold-gradient text-primary-foreground py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2"><Save size={16} /> Créer</button>
            </div>
          </motion.form>
        </div>
      )}
    </div>
  );
};

export default GestionBilletterie;
