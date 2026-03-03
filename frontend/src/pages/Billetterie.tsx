/**
 * Page Billetterie - Golden Vibes Events
 * -----------------------------------------
 * Affiche les packs depuis l'API.
 * Processus d'achat en 5 étapes avec paiement NotchPay.
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Ticket, Star, CheckCircle, Phone, Mail, User, Users,
  Crown, Sparkles, Coffee, ChevronLeft, ChevronRight,
  Download, QrCode, Clock, AlertCircle, CreditCard,
  Smartphone, Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:8000/api";

interface Pack {
  id: number;
  nom: string;
  prix: number;
  places_disponibles: number;
  places_vendues: number;
  avantages: string[];
  statut: string;
}

interface FormData {
  nom: string;
  telephone: string;
  email: string;
}

const PACK_ICONS: Record<string, any> = {
  "Standard": Ticket,
  "Gold": Star,
  "VIP": Crown,
  "VVIP": Sparkles,
  "Groupe": Users,
  "Étudiant": Coffee,
};

const formatPhone = (tel: string) => {
  const cleaned = tel.replace(/\D/g, "");
  if (cleaned.startsWith("237")) return cleaned;
  return `237${cleaned}`;
};

const Billetterie = () => {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loadingPacks, setLoadingPacks] = useState(true);
  const [selectedPack, setSelectedPack] = useState<number | null>(null);
  const [step, setStep] = useState(1);
  const [quantite, setQuantite] = useState(1);
  const [payment, setPayment] = useState<"orange" | "mtn">("orange");
  const [formData, setFormData] = useState<FormData>({ nom: "", telephone: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [transactionId, setTransactionId] = useState("");

  const pack = packs.find((p) => p.id === selectedPack);
  const restant = pack ? pack.places_disponibles - pack.places_vendues : 0;
  const total = pack ? pack.prix * quantite : 0;

  /* Charger les packs */
  useEffect(() => {
    const fetchPacks = async () => {
      setLoadingPacks(true);
      try {
        const response = await axios.get(`${API_URL}/packs`);
        const data = response.data.data || response.data;
        // Filtrer uniquement les packs en vente
        setPacks(data.filter((p: Pack) => p.statut === "en_vente"));
      } catch (err) {
        console.error("Erreur chargement packs:", err);
      } finally {
        setLoadingPacks(false);
      }
    };
    fetchPacks();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  /* Validation formulaire */
  const validateForm = () => {
    if (!formData.nom.trim()) { setError("Le nom est obligatoire."); return false; }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Email invalide."); return false;
    }
    if (!formData.telephone.trim()) { setError("Le numéro de téléphone est obligatoire."); return false; }
    const formatted = formatPhone(formData.telephone);
    if (!/^237[0-9]{9}$/.test(formatted)) {
      setError("Numéro invalide. Format attendu : 6XX XXX XXX"); return false;
    }
    return true;
  };

  /* Soumettre la commande */
  const handlePayer = async () => {
    if (!validateForm()) return;
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API_URL}/billets`, {
        pack_id: selectedPack,
        quantite,
        nom: formData.nom,
        email: formData.email,
        telephone: formatPhone(formData.telephone),
        mode_paiement: payment,
      });

      if (response.data.success) {
        const url = response.data.data?.payment_url;
        const txId = response.data.data?.transaction_id;
        setTransactionId(txId || "");

        if (url) {
          // Redirection vers NotchPay
          window.location.href = url;
        } else {
          setStep(5);
        }
      } else {
        setError(response.data.message || "Erreur lors du paiement.");
      }
    } catch (err: any) {
      console.error("Erreur achat billet:", err);
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Une erreur est survenue. Veuillez réessayer."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 bg-background min-h-screen">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl gold-text mb-2">Billetterie</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Réservez vos places pour le Golden Vibes Event du 11 Avril 2026 au Mbouo Star Palace
          </p>
        </div>

        {/* Progress bar */}
        {selectedPack && step > 1 && step < 5 && (
          <div className="max-w-3xl mx-auto mb-8">
            <div className="flex items-center justify-between">
              {[
                { n: 1, label: "Pack" },
                { n: 2, label: "Quantité" },
                { n: 3, label: "Infos" },
                { n: 4, label: "Paiement" },
              ].map(({ n, label }) => (
                <div key={n} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step > n ? "gold-gradient text-primary-foreground" :
                    step === n ? "border-2 border-primary text-primary" :
                    "bg-secondary text-muted-foreground"
                  }`}>
                    {step > n ? <CheckCircle size={16} /> : n}
                  </div>
                  <span className="text-xs mt-1 text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
            <div className="relative mt-2 h-1 bg-secondary rounded-full">
              <div
                className="absolute h-full gold-gradient rounded-full transition-all duration-300"
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* ── ÉTAPE 1 : Choix du pack ── */}
        {step === 1 && (
          <>
            {loadingPacks ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={40} className="animate-spin text-primary" />
              </div>
            ) : packs.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                Aucun pack disponible pour le moment.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {packs.map((p, i) => {
                  const rest = p.places_disponibles - p.places_vendues;
                  const pct = (p.places_vendues / p.places_disponibles) * 100;
                  const presqueComplet = rest < p.places_disponibles * 0.1;
                  const PackIcon = PACK_ICONS[p.nom] || Ticket;
                  const avantages = Array.isArray(p.avantages) ? p.avantages : [];

                  return (
                    <motion.div
                      key={p.id}
                      className="relative bg-card rounded-xl border border-border overflow-hidden transition-all hover:border-primary/50 hover:shadow-xl group"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      {/* Badge */}
                      {presqueComplet && (
                        <div className="absolute top-2 right-2 z-10">
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 animate-pulse">
                            <AlertCircle size={12} /> Presque complet
                          </span>
                        </div>
                      )}

                      {/* Header coloré */}
                      <div className="gold-gradient p-6 flex items-center justify-between">
                        <PackIcon size={28} className="text-primary-foreground" />
                        <span className="text-primary-foreground text-sm font-bold uppercase tracking-wider">
                          {p.nom}
                        </span>
                      </div>

                      <div className="p-5">
                        <p className="text-3xl font-bold text-primary font-display mb-1">
                          {Number(p.prix).toLocaleString()}
                          <span className="text-sm font-normal text-muted-foreground ml-1">FCFA</span>
                        </p>

                        {/* Avantages */}
                        {avantages.length > 0 && (
                          <div className="space-y-1.5 mb-4 mt-3">
                            {avantages.slice(0, 4).map((a, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                                <span className="text-primary mt-0.5 shrink-0">✓</span>
                                <span>{a}</span>
                              </div>
                            ))}
                            {avantages.length > 4 && (
                              <p className="text-xs text-primary">+{avantages.length - 4} autres avantages</p>
                            )}
                          </div>
                        )}

                        {/* Barre de dispo */}
                        <div className="mt-4">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">{rest} places restantes</span>
                            <span className="text-foreground font-medium">{Math.round(pct)}%</span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                presqueComplet ? "bg-red-500" : "gold-gradient"
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => { setSelectedPack(p.id); setQuantite(1); setStep(2); }}
                          disabled={rest === 0}
                          className="w-full mt-5 py-3 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all gold-gradient text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Ticket size={16} className="inline mr-2" />
                          {rest === 0 ? "Épuisé" : "Choisir ce pack"}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            <div className="mt-10 text-center">
              <p className="text-sm text-muted-foreground">
                🎫 Billet nominatif envoyé par email avec QR code unique · Confirmation SMS
              </p>
            </div>
          </>
        )}

        {/* ── ÉTAPE 2 : Quantité ── */}
        {step === 2 && pack && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto">
            <div className="bg-card rounded-xl border border-border p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-2xl text-foreground">{pack.nom}</h2>
                <button onClick={() => setStep(1)} className="text-xs text-muted-foreground hover:text-primary underline">
                  Changer
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-secondary rounded-lg mb-6">
                <span className="text-foreground">Prix unitaire</span>
                <span className="text-xl font-bold text-primary">{Number(pack.prix).toLocaleString()} FCFA</span>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Nombre de billets (max {restant})
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantite(Math.max(1, quantite - 1))}
                    disabled={quantite <= 1}
                    className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-primary/10 transition-colors disabled:opacity-40"
                  >
                    -
                  </button>
                  <div className="flex-1 text-center">
                    <span className="text-2xl font-bold text-foreground">{quantite}</span>
                    <span className="text-sm text-muted-foreground ml-1">billet(s)</span>
                  </div>
                  <button
                    onClick={() => setQuantite(Math.min(restant, quantite + 1))}
                    disabled={quantite >= restant}
                    className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-primary/10 transition-colors disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
                {quantite >= restant && (
                  <p className="text-xs text-red-500 mt-2">
                    Plus que {restant} place(s) disponible(s)
                  </p>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-border flex justify-between items-center">
                <span className="text-foreground">Total</span>
                <span className="text-2xl font-bold gold-text">{total.toLocaleString()} FCFA</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 border border-border text-muted-foreground py-3 rounded-lg hover:bg-secondary transition-colors">
                <ChevronLeft size={16} className="inline mr-1" /> Retour
              </button>
              <button onClick={() => setStep(3)} className="flex-1 gold-gradient text-primary-foreground py-3 rounded-lg font-semibold uppercase tracking-wider hover:opacity-90">
                Continuer <ChevronRight size={16} className="inline ml-1" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ── ÉTAPE 3 : Informations personnelles ── */}
        {step === 3 && pack && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto space-y-6">
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-display text-xl text-foreground mb-4">Vos informations</h3>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    <User size={14} className="inline mr-1" /> Nom complet *
                  </label>
                  <input
                    type="text" name="nom" value={formData.nom} onChange={handleInputChange}
                    placeholder="Votre nom et prénom"
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    <Phone size={14} className="inline mr-1" /> Numéro de téléphone *
                  </label>
                  <input
                    type="tel" name="telephone" value={formData.telephone} onChange={handleInputChange}
                    placeholder="6XX XXX XXX"
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    <Mail size={14} className="inline mr-1" /> Adresse email *
                  </label>
                  <input
                    type="email" name="email" value={formData.email} onChange={handleInputChange}
                    placeholder="votre@email.com"
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Votre billet avec QR code sera envoyé à cette adresse
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 border border-border text-muted-foreground py-3 rounded-lg hover:bg-secondary transition-colors">
                <ChevronLeft size={16} className="inline mr-1" /> Retour
              </button>
              <button
                onClick={() => {
                  if (validateForm()) { setError(""); setStep(4); }
                }}
                className="flex-1 gold-gradient text-primary-foreground py-3 rounded-lg font-semibold uppercase tracking-wider hover:opacity-90"
              >
                Continuer <ChevronRight size={16} className="inline ml-1" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ── ÉTAPE 4 : Paiement ── */}
        {step === 4 && pack && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto space-y-6">
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-display text-xl text-foreground mb-4">Paiement sécurisé</h3>

              {/* Récapitulatif */}
              <div className="bg-secondary rounded-lg p-4 mb-6">
                <p className="text-sm text-muted-foreground mb-2">Récapitulatif</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{pack.nom} x{quantite}</span>
                    <span className="text-foreground">{total.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Client</span>
                    <span className="text-foreground">{formData.nom}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t border-border">
                    <span className="text-foreground">Total</span>
                    <span className="gold-text">{total.toLocaleString()} FCFA</span>
                  </div>
                </div>
              </div>

              {/* Mode de paiement */}
              <div className="mb-6">
                <label className="block text-sm text-muted-foreground mb-3">
                  Mode de paiement
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: "orange", label: "Orange Money", icon: "🟠" },
                    { key: "mtn", label: "MTN MoMo", icon: "🟡" },
                  ].map((p) => (
                    <button
                      key={p.key}
                      onClick={() => setPayment(p.key as "orange" | "mtn")}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                        payment === p.key
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:border-primary/30"
                      }`}
                    >
                      <span className="text-2xl mb-1 block">{p.icon}</span>
                      <span className={`text-sm font-semibold ${payment === p.key ? "text-primary" : "text-muted-foreground"}`}>
                        {p.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                  {error}
                </div>
              )}

              <div className="bg-secondary/50 rounded-lg p-4 border border-border">
                <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Smartphone size={16} className="text-primary" />
                  Vous serez redirigé vers NotchPay pour finaliser le paiement
                </p>
                <p className="text-xs text-muted-foreground">
                  Après confirmation du paiement, votre billet sera envoyé à <span className="text-foreground">{formData.email}</span>
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(3)} disabled={loading} className="flex-1 border border-border text-muted-foreground py-3 rounded-lg hover:bg-secondary transition-colors disabled:opacity-50">
                <ChevronLeft size={16} className="inline mr-1" /> Retour
              </button>
              <button
                onClick={handlePayer}
                disabled={loading}
                className="flex-1 gold-gradient text-primary-foreground py-3 rounded-lg font-semibold uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <><Loader2 size={18} className="animate-spin" /> En cours...</>
                ) : (
                  <><CreditCard size={16} /> Payer {total.toLocaleString()} FCFA</>
                )}
              </button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              En confirmant, vous acceptez nos conditions générales de vente.
            </p>
          </motion.div>
        )}

        {/* ── ÉTAPE 5 : Confirmation ── */}
        {step === 5 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto">
            <div className="bg-card rounded-xl border-2 border-primary/20 p-8 text-center">
              <div className="w-20 h-20 gold-gradient rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-primary-foreground" />
              </div>

              <h2 className="font-display text-2xl text-foreground mb-2">Commande envoyée !</h2>
              <p className="text-muted-foreground mb-4">
                Votre billet <span className="text-primary font-bold">{pack?.nom}</span> sera confirmé après validation du paiement.
              </p>

              {transactionId && (
                <div className="bg-secondary rounded-lg p-4 mb-6">
                  <p className="text-xs text-muted-foreground mb-1">Référence transaction</p>
                  <p className="font-mono font-bold text-primary text-sm">{transactionId}</p>
                </div>
              )}

              <div className="bg-white p-4 rounded-xl mb-6 inline-block">
                <div className="w-32 h-32 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
                  <QrCode size={80} className="text-white" />
                </div>
              </div>

              <div className="space-y-3 mb-6 text-left bg-secondary/30 rounded-lg p-4">
                <p className="text-sm text-foreground flex items-center gap-2">
                  <Mail size={16} className="text-primary" />
                  Billet envoyé à : {formData.email}
                </p>
                <p className="text-sm text-foreground flex items-center gap-2">
                  <Phone size={16} className="text-primary" />
                  Confirmation SMS : {formData.telephone}
                </p>
                <p className="text-sm text-foreground flex items-center gap-2">
                  <Clock size={16} className="text-primary" />
                  QR code scanné à l'entrée
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  to="/"
                  className="gold-gradient text-primary-foreground px-6 py-3 rounded-lg font-semibold text-sm uppercase tracking-wider hover:opacity-90 transition-opacity"
                >
                  Retour à l'accueil
                </Link>
                <button
                  onClick={() => {
                    setStep(1);
                    setSelectedPack(null);
                    setQuantite(1);
                    setFormData({ nom: "", telephone: "", email: "" });
                    setError("");
                    setTransactionId("");
                  }}
                  className="text-primary text-sm hover:underline"
                >
                  Acheter un autre billet
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Billetterie;