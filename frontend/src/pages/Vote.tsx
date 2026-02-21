import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, CheckCircle } from "lucide-react";

const candidats = [
  { id: 1, nom: "Nguemo Tatiana", numero: 1, categorie: "miss", photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop" },
  { id: 2, nom: "Kamga Brielle", numero: 2, categorie: "miss", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop" },
  { id: 3, nom: "Fotso Mireille", numero: 3, categorie: "miss", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop" },
  { id: 4, nom: "Tchamba Kevin", numero: 1, categorie: "master", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop" },
  { id: 5, nom: "Mbarga Yves", numero: 2, categorie: "master", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop" },
  { id: 6, nom: "Djomo Patrick", numero: 3, categorie: "master", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop" },
];

const Vote = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [phone, setPhone] = useState("");
  const [payment, setPayment] = useState<"orange" | "mtn">("orange");
  const [step, setStep] = useState(1);

  const candidate = candidats.find((c) => c.id === selected);

  return (
    <div className="py-12 bg-background min-h-screen">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="font-display text-4xl gold-text text-center mb-2">Voter</h1>
        <p className="text-center text-muted-foreground mb-10">1 vote = 100 FCFA · Votes illimités</p>

        {/* Steps indicator */}
        <div className="flex justify-center gap-2 mb-10">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
              step >= s ? "gold-gradient text-primary-foreground" : "bg-secondary text-muted-foreground"
            }`}>
              {step > s ? <CheckCircle size={18} /> : s}
            </div>
          ))}
        </div>

        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="font-display text-xl text-foreground mb-6 text-center">Choisissez votre candidat(e)</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {candidats.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { setSelected(c.id); setStep(2); }}
                  className={`p-3 rounded-xl border transition-all text-left ${
                    selected === c.id ? "border-primary gold-glow" : "border-border hover:border-primary/50"
                  } bg-card`}
                >
                  <img src={c.photo} alt={c.nom} className="w-full aspect-square object-cover rounded-lg mb-2" />
                  <p className="text-xs text-primary uppercase">{c.categorie} N°{c.numero}</p>
                  <p className="text-sm font-medium text-foreground">{c.nom}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && candidate && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border">
              <img src={candidate.photo} alt={candidate.nom} className="w-16 h-16 rounded-lg object-cover" />
              <div>
                <p className="text-xs text-primary uppercase">{candidate.categorie} N°{candidate.numero}</p>
                <p className="font-display text-lg text-foreground">{candidate.nom}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-2">Nombre de votes</label>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 bg-secondary rounded-lg text-foreground font-bold">-</button>
                <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} className="w-20 text-center bg-secondary border border-border rounded-lg py-2 text-foreground" />
                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 bg-secondary rounded-lg text-foreground font-bold">+</button>
              </div>
              <p className="text-primary font-bold mt-2">Total : {(quantity * 100).toLocaleString()} FCFA</p>
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-2">Numéro de téléphone</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="tel" placeholder="6XX XXX XXX" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full pl-9 pr-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-2">Mode de paiement</label>
              <div className="flex gap-3">
                {(["orange", "mtn"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPayment(p)}
                    className={`flex-1 p-4 rounded-xl border text-center font-semibold uppercase text-sm transition-all ${
                      payment === p ? "border-primary gold-glow bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground"
                    }`}
                  >
                    {p === "orange" ? "🟠 Orange Money" : "🟡 MTN MoMo"}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 border border-border text-muted-foreground py-3 rounded-lg font-medium">Retour</button>
              <button onClick={() => setStep(3)} className="flex-1 gold-gradient text-primary-foreground py-3 rounded-lg font-semibold uppercase tracking-wider">Payer {(quantity * 100).toLocaleString()} FCFA</button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
            <div className="w-20 h-20 gold-gradient rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-primary-foreground" />
            </div>
            <h2 className="font-display text-2xl text-foreground mb-2">Merci pour votre vote !</h2>
            <p className="text-muted-foreground mb-6">
              {quantity} vote(s) pour <span className="text-primary">{candidate?.nom}</span>
            </p>
            <p className="text-sm text-muted-foreground mb-8">Une confirmation sera envoyée par SMS.</p>
            <button onClick={() => { setStep(1); setSelected(null); setQuantity(1); setPhone(""); }} className="gold-gradient text-primary-foreground px-8 py-3 rounded-lg font-semibold uppercase tracking-wider">
              Voter à nouveau
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Vote;
