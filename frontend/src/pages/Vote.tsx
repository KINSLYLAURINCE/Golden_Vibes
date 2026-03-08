import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Phone, CheckCircle, Loader2, Crown, Heart } from "lucide-react";
import axios from "axios";

import { API_URL, getImageUrl } from "@/services/api";


interface Candidat {
  id: number;
  nom: string;
  numero: number;
  categorie: string;
  photo1: string;
  photo2: string;
  votes_count: number;
  statut: string;
}

const Vote = () => {
  const [searchParams] = useSearchParams();
  const candidatIdFromUrl = searchParams.get("candidat");

  const [candidats, setCandidats] = useState<Candidat[]>([]);
  const [loadingCandidats, setLoadingCandidats] = useState(true);
  const [selected, setSelected] = useState<number | null>(
    candidatIdFromUrl ? Number(candidatIdFromUrl) : null
  );
  const [quantity, setQuantity] = useState(1);
  const [phone, setPhone] = useState("");
  const [payment, setPayment] = useState<"orange" | "mtn">("orange");
  const [step, setStep] = useState(candidatIdFromUrl ? 2 : 1);
  const [loading, setSaving] = useState(false);
  const [error, setError] = useState("");

  const candidate = candidats.find((c) => c.id === selected);

  useEffect(() => {
    const fetchCandidats = async () => {
      setLoadingCandidats(true);
      try {
        const response = await axios.get(`${API_URL}/candidats`);
        setCandidats(response.data.data || response.data);
      } catch (err) {
        console.error("Erreur chargement candidats:", err);
      } finally {
        setLoadingCandidats(false);
      }
    };
    fetchCandidats();
  }, []);

  const formatPhone = (tel: string) => {
    const cleaned = tel.replace(/\D/g, "");
    if (cleaned.startsWith("237")) return cleaned;
    return `237${cleaned}`;
  };

  const validateStep2 = () => {
    if (!phone) { setError("Veuillez entrer votre numéro de téléphone."); return false; }
    const formatted = formatPhone(phone);
    if (!/^237[0-9]{9}$/.test(formatted)) {
      setError("Numéro invalide. Format attendu : 6XX XXX XXX");
      return false;
    }
    return true;
  };

  const handlePay = async () => {
    if (!validateStep2()) return;
    setSaving(true);
    setError("");
    try {
      const response = await axios.post(`${API_URL}/votes`, {
        candidat_id: selected,
        nombre_votes: quantity,
        telephone: formatPhone(phone),
        mode_paiement: payment,
      });
      if (response.data.success) {
        const url = response.data.data?.payment_url;
        if (url) {
          window.location.href = url;
        } else {
          setStep(3);
        }
      } else {
        setError(response.data.message || "Erreur lors du paiement.");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Une erreur est survenue. Veuillez réessayer."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="py-12 bg-background min-h-screen">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="font-display text-4xl gold-text text-center mb-2">Voter</h1>
        <p className="text-center text-muted-foreground mb-10">
          1 vote = 100 FCFA · Votes illimités
        </p>

        {/* Steps indicator */}
        <div className="flex justify-center gap-2 mb-10">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step >= s
                  ? "gold-gradient text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {step > s ? <CheckCircle size={18} /> : s}
            </div>
          ))}
        </div>

        {/* ── STEP 1 : Choisir un candidat ── */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="font-display text-xl text-foreground mb-6 text-center">
              Choisissez votre candidat(e)
            </h2>

            {loadingCandidats ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={32} className="animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {candidats.map((c) => {
                  const photoUrl = getImageUrl(c.photo1); // ✅
                  return (
                    <button
                      key={c.id}
                      onClick={() => { setSelected(c.id); setStep(2); }}
                      className={`p-3 rounded-xl border transition-all text-left ${
                        selected === c.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      } bg-card`}
                    >
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={c.nom}
                          className="w-full aspect-square object-cover rounded-lg mb-2"
                          onError={(e: any) => { e.target.style.display = "none"; }}
                        />
                      ) : (
                        <div className="w-full aspect-square rounded-lg mb-2 bg-secondary flex items-center justify-center">
                          <Crown size={24} className="text-muted-foreground" />
                        </div>
                      )}
                      <p className="text-xs text-primary uppercase">
                        {c.categorie} N°{c.numero}
                      </p>
                      <p className="text-sm font-medium text-foreground leading-tight">{c.nom}</p>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Heart size={10} className="text-yellow-400" />
                        {Number(c.votes_count ?? 0).toLocaleString()} votes
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* ── STEP 2 : Paiement ── */}
        {step === 2 && candidate && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

            {/* Candidat sélectionné */}
            <div className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border">
              {getImageUrl(candidate.photo1) ? ( // ✅
                <img
                  src={getImageUrl(candidate.photo1)!}
                  alt={candidate.nom}
                  className="w-16 h-16 rounded-lg object-cover"
                  onError={(e: any) => { e.target.style.display = "none"; }}
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center">
                  <Crown size={24} className="text-muted-foreground" />
                </div>
              )}
              <div>
                <p className="text-xs text-primary uppercase">
                  {candidate.categorie} N°{candidate.numero}
                </p>
                <p className="font-display text-lg text-foreground">{candidate.nom}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Heart size={10} className="text-yellow-400" />
                  {Number(candidate.votes_count ?? 0).toLocaleString()} votes actuels
                </p>
              </div>
              <button
                onClick={() => setStep(1)}
                className="ml-auto text-xs text-muted-foreground hover:text-primary underline"
              >
                Changer
              </button>
            </div>

            {/* Erreur */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                {error}
              </div>
            )}

            {/* Quantité */}
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Nombre de votes</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-secondary rounded-lg text-foreground font-bold hover:bg-secondary/80 transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center bg-secondary border border-border rounded-lg py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 bg-secondary rounded-lg text-foreground font-bold hover:bg-secondary/80 transition-colors"
                >
                  +
                </button>
              </div>
              <p className="text-primary font-bold mt-2">
                Total : {(quantity * 100).toLocaleString()} FCFA
              </p>
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                Numéro de téléphone
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="tel"
                  placeholder="6XX XXX XXX"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setError(""); }}
                  className="w-full pl-9 pr-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Numéro Mobile Money utilisé pour le paiement
              </p>
            </div>

            {/* Mode de paiement */}
            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                Mode de paiement
              </label>
              <div className="flex gap-3">
                {(["orange", "mtn"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPayment(p)}
                    className={`flex-1 p-4 rounded-xl border text-center font-semibold uppercase text-sm transition-all ${
                      payment === p
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {p === "orange" ? "🟠 Orange Money" : "🟡 MTN MoMo"}
                  </button>
                ))}
              </div>
            </div>

            {/* Résumé */}
            <div className="p-4 bg-secondary/50 border border-border rounded-xl">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Résumé</p>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Candidat</span>
                <span className="text-foreground font-medium">{candidate.nom}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-muted-foreground">Votes</span>
                <span className="text-foreground font-medium">{quantity}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-muted-foreground">Paiement</span>
                <span className="text-foreground font-medium">
                  {payment === "orange" ? "Orange Money" : "MTN MoMo"}
                </span>
              </div>
              <div className="flex justify-between font-bold mt-2 pt-2 border-t border-border">
                <span className="text-foreground">Total</span>
                <span className="text-primary">{(quantity * 100).toLocaleString()} FCFA</span>
              </div>
            </div>

            {/* Boutons */}
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                disabled={loading}
                className="flex-1 border border-border text-muted-foreground py-3 rounded-lg font-medium hover:bg-secondary transition-colors disabled:opacity-50"
              >
                Retour
              </button>
              <button
                onClick={handlePay}
                disabled={loading}
                className="flex-1 gold-gradient text-primary-foreground py-3 rounded-lg font-semibold uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <><Loader2 size={18} className="animate-spin" /> En cours...</>
                ) : (
                  `Payer ${(quantity * 100).toLocaleString()} FCFA`
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* ── STEP 3 : Confirmation ── */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 gold-gradient rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-primary-foreground" />
            </div>
            <h2 className="font-display text-2xl text-foreground mb-2">Vote envoyé !</h2>
            <p className="text-muted-foreground mb-2">
              {quantity} vote(s) pour{" "}
              <span className="text-primary font-semibold">{candidate?.nom}</span>
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              Montant : <span className="text-primary font-bold">{(quantity * 100).toLocaleString()} FCFA</span>
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Votre vote sera confirmé après validation du paiement.
            </p>
            <button
              onClick={() => {
                setStep(1);
                setSelected(null);
                setQuantity(1);
                setPhone("");
                setError("");
              }}
              className="gold-gradient text-primary-foreground px-8 py-3 rounded-lg font-semibold uppercase tracking-wider"
            >
              Voter à nouveau
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Vote;