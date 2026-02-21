/**
 * Page Billetterie - Golden Vibes Events
 * -----------------------------------------
 * Affiche les packs de billets avec les vraies images.
 * Formulaire d'achat avec paiement Orange/MTN.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Ticket, Star, CheckCircle, Phone, Mail, User } from "lucide-react";

/* Images des billets */
import billetClassique1 from "@/assets/billets/classique1-5000.png";
import billetClassique2 from "@/assets/billets/classique2-10000.png";
import billetVip from "@/assets/billets/vip-20000.png";
import billetVvip from "@/assets/billets/vvip-30000.png";

/* Packs disponibles avec images */
const packs = [
  {
    id: 1, nom: "Classique 1", prix: 5000, places: 200, vendus: 120,
    image: billetClassique1,
    avantages: ["Accès à la salle", "Place standard", "Ambiance garantie"],
  },
  {
    id: 2, nom: "Classique 2", prix: 10000, places: 150, vendus: 89,
    image: billetClassique2,
    avantages: ["Bonnes places", "Accès lounge", "1 boisson offerte"],
  },
  {
    id: 3, nom: "VIP", prix: 20000, places: 80, vendus: 52,
    image: billetVip,
    avantages: ["Places premium", "Accès backstage", "Cocktail inclus", "Goodies officiels"],
  },
  {
    id: 4, nom: "VVIP", prix: 30000, places: 30, vendus: 18,
    image: billetVvip,
    avantages: ["Table réservée", "Service exclusif", "Photo avec candidats", "Accès total", "Cadeau surprise"],
  },
];

const Billetterie = () => {
  const [selectedPack, setSelectedPack] = useState(null);
  const [step, setStep] = useState(1);
  const [payment, setPayment] = useState("orange");

  const pack = packs.find((p) => p.id === selectedPack);
  const restant = pack ? pack.places - pack.vendus : 0;

  return (
    <div className="py-12 bg-background min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-4xl gold-text text-center mb-2">Billetterie</h1>
        <p className="text-center text-muted-foreground mb-10">Réservez vos places pour le Golden Vibes Event</p>

        {/* Étape 1 : Choix du pack */}
        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {packs.map((p, i) => {
              const rest = p.places - p.vendus;
              const pct = (p.vendus / p.places) * 100;
              return (
                <motion.div
                  key={p.id}
                  className={`relative bg-card rounded-xl border overflow-hidden transition-all hover:border-primary/50 ${
                    p.nom === "VIP" || p.nom === "VVIP" ? "border-primary gold-glow" : "border-border"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  {/* Image du billet */}
                  <div className="w-full aspect-[2/1] overflow-hidden">
                    <img src={p.image} alt={p.nom} className="w-full h-full object-cover" />
                  </div>

                  {(p.nom === "VIP" || p.nom === "VVIP") && (
                    <div className="gold-gradient text-primary-foreground text-center py-1 text-xs font-bold uppercase tracking-wider">
                      {p.nom === "VVIP" ? "Exclusif" : "Populaire"}
                    </div>
                  )}

                  <div className="p-5">
                    <h3 className="font-display text-xl text-foreground mb-1">{p.nom}</h3>
                    <p className="text-2xl font-bold text-primary font-display">
                      {p.prix.toLocaleString()} <span className="text-sm">FCFA</span>
                    </p>

                    <div className="mt-3 space-y-1.5">
                      {p.avantages.map((a) => (
                        <div key={a} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Star size={10} className="text-primary shrink-0" />
                          {a}
                        </div>
                      ))}
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>{rest} places</span>
                        <span>{Math.round(pct)}%</span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full gold-gradient rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>

                    <button
                      onClick={() => { setSelectedPack(p.id); setStep(2); }}
                      className={`w-full mt-5 py-3 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all ${
                        p.nom === "VIP" || p.nom === "VVIP"
                          ? "gold-gradient text-primary-foreground"
                          : "border border-primary text-primary hover:bg-primary/10"
                      }`}
                    >
                      <Ticket size={16} className="inline mr-2" /> Réserver
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Étape 2 : Formulaire */}
        {step === 2 && pack && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg mx-auto space-y-6">
            <div className="p-4 bg-card rounded-xl border border-border">
              <p className="text-xs text-primary uppercase tracking-wider">Pack sélectionné</p>
              <p className="font-display text-xl text-foreground">{pack.nom} — {pack.prix.toLocaleString()} FCFA</p>
            </div>
            {[
              { icon: User, label: "Nom complet", placeholder: "Votre nom", type: "text" },
              { icon: Phone, label: "Téléphone", placeholder: "6XX XXX XXX", type: "tel" },
              { icon: Mail, label: "Email", placeholder: "votre@email.com", type: "email" },
            ].map((f) => (
              <div key={f.label}>
                <label className="block text-sm text-muted-foreground mb-2">{f.label}</label>
                <div className="relative">
                  <f.icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type={f.type} placeholder={f.placeholder} className="w-full pl-9 pr-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
              </div>
            ))}

            {/* Mode de paiement */}
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Mode de paiement</label>
              <div className="flex gap-3">
                {[
                  { key: "orange", label: "🟠 Orange Money" },
                  { key: "mtn", label: "🟡 MTN MoMo" },
                ].map((p) => (
                  <button
                    key={p.key}
                    onClick={() => setPayment(p.key)}
                    className={`flex-1 p-3 rounded-xl border text-center font-semibold text-sm transition-all ${
                      payment === p.key ? "border-primary gold-glow bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 border border-border text-muted-foreground py-3 rounded-lg">Retour</button>
              <button onClick={() => setStep(3)} className="flex-1 gold-gradient text-primary-foreground py-3 rounded-lg font-semibold uppercase tracking-wider">
                Payer {pack.prix.toLocaleString()} FCFA
              </button>
            </div>
          </motion.div>
        )}

        {/* Étape 3 : Confirmation */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 max-w-md mx-auto">
            <div className="w-20 h-20 gold-gradient rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-primary-foreground" />
            </div>
            <h2 className="font-display text-2xl text-foreground mb-2">Réservation confirmée !</h2>
            <p className="text-muted-foreground mb-2">Votre billet <span className="text-primary font-bold">{pack?.nom}</span> a été réservé.</p>
            <p className="text-sm text-muted-foreground mb-8">Vous recevrez votre billet avec QR code par email et SMS.</p>
            <button onClick={() => { setStep(1); setSelectedPack(null); }} className="gold-gradient text-primary-foreground px-8 py-3 rounded-lg font-semibold uppercase tracking-wider">
              Acheter un autre billet
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Billetterie;
