/**
 * Page Billetterie - Golden Vibes Events
 * -----------------------------------------
 * Affiche les packs de billets avec les vraies images.
 * Processus d'achat en 5 étapes avec paiement Orange/MTN.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Ticket, Star, CheckCircle, Phone, Mail, User, Users, 
  Crown, Sparkles, Gift, Music, Camera, Wine, Coffee,
  ChevronLeft, ChevronRight, Download, QrCode, Clock,
  AlertCircle, ShoppingCart, CreditCard, Smartphone
} from "lucide-react";
import { Link } from "react-router-dom";

/* Images des billets */
import billetClassique1 from "@/assets/billets/classique1-5000.png";
import billetClassique2 from "@/assets/billets/classique2-10000.png";
import billetVip from "@/assets/billets/vip-20000.png";
import billetVvip from "@/assets/billets/vvip-30000.png";
import billetGroupe from "@/assets/billets/groupe-20000.png";
import billetEtudiant from "@/assets/billets/etudiant-4000.png";

/* Packs disponibles avec images et avantages détaillés */
const packs = [
  {
    id: 1, 
    nom: "Pack Standard", 
    prix: 5000, 
    places: 200, 
    vendus: 178,
    image: billetClassique1,
    icon: Ticket,
    badge: "Presque complet",
    avantages: [
      "✅ Accès à la salle principale",
      "✅ Place assise standard",
      "✅ Ambiance musicale garantie",
      "✅ Accès aux animations"
    ],
    description: "L'essentiel pour profiter de la soirée",
    couleur: "from-blue-500 to-blue-600"
  },
  {
    id: 2, 
    nom: "Pack Gold", 
    prix: 10000, 
    places: 150, 
    vendus: 89,
    image: billetClassique2,
    icon: Star,
    badge: null,
    avantages: [
      "✅ Bonnes places (zone Gold)",
      "✅ Accès à l'espace lounge",
      "✅ 1 boisson offerte",
      "✅ Service prioritaire aux bars",
      "✅ Programme officiel offert"
    ],
    description: "Confort et services exclusifs",
    couleur: "from-yellow-500 to-yellow-600"
  },
  {
    id: 3, 
    nom: "Pack VIP", 
    prix: 20000, 
    places: 80, 
    vendus: 72,
    image: billetVip,
    icon: Crown,
    badge: "Presque complet",
    avantages: [
      "✅ Places premium (face à la scène)",
      "✅ Accès backstage (rencontre artistes)",
      "✅ Cocktail dînatoire inclus",
      "✅ Goodies officiels VIP",
      "✅ Photographe dédié",
      "✅ Entrée prioritaire"
    ],
    description: "L'expérience ultime",
    couleur: "from-purple-500 to-purple-600"
  },
  {
    id: 4, 
    nom: "Pack VVIP", 
    prix: 30000, 
    places: 30, 
    vendus: 24,
    image: billetVvip,
    icon: Sparkles,
    badge: "Presque complet",
    avantages: [
      "✅ Table privée réservée (4 pers.)",
      "✅ Service personnel dédié",
      "✅ Photo officielle avec les candidats",
      "✅ Accès total à tous les espaces",
      "✅ Cadeau surprise exclusif",
      "✅ Champagne offert",
      "✅ Parking VIP inclus"
    ],
    description: "Le summum du prestige",
    couleur: "from-red-500 to-red-600"
  },
  {
    id: 5, 
    nom: "Pack Groupe", 
    prix: 20000, 
    places: 50, 
    vendus: 28,
    image: billetGroupe,
    icon: Users,
    badge: null,
    avantages: [
      "✅ 5 billets pour le prix de 4",
      "✅ Places regroupées",
      "✅ Économisez 5000 FCFA",
      "✅ Idéal pour les sorties entre amis",
      "✅ Réservation groupée garantie"
    ],
    description: "5 entrées à tarif réduit",
    couleur: "from-green-500 to-green-600"
  },
  {
    id: 6, 
    nom: "Pack Étudiant", 
    prix: 4000, 
    places: 100, 
    vendus: 65,
    image: billetEtudiant,
    icon: Coffee,
    badge: null,
    avantages: [
      "✅ Tarif spécial étudiants",
      "✅ Sur présentation de la carte",
      "✅ Place en zone étudiante",
      "✅ 1 soft offert",
      "✅ Accès aux mêmes animations"
    ],
    description: "La soirée accessible à tous",
    couleur: "from-indigo-500 to-indigo-600"
  },
];

const Billetterie = () => {
  const [selectedPack, setSelectedPack] = useState(null);
  const [step, setStep] = useState(1);
  const [quantite, setQuantite] = useState(1);
  const [payment, setPayment] = useState("orange");
  const [formData, setFormData] = useState({
    nom: "",
    telephone: "",
    email: "",
    carteEtudiant: ""
  });
  const [numeroReservation, setNumeroReservation] = useState("");

  const pack = packs.find((p) => p.id === selectedPack);
  const restant = pack ? pack.places - pack.vendus : 0;
  const total = pack ? pack.prix * quantite : 0;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleReservation = () => {
    // Générer un numéro de réservation aléatoire
    const numero = "GV" + Date.now().toString().slice(-8) + Math.floor(Math.random() * 1000);
    setNumeroReservation(numero);
    setStep(4);
  };

  const handleConfirmPaiement = () => {
    setStep(5);
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

        {/* Progress Bar */}
        {selectedPack && step > 1 && step < 5 && (
          <div className="max-w-3xl mx-auto mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step > s ? "gold-gradient text-primary-foreground" : 
                    step === s ? "border-2 border-primary text-primary" : 
                    "bg-secondary text-muted-foreground"
                  }`}>
                    {step > s ? <CheckCircle size={16} /> : s}
                  </div>
                  <span className="text-xs mt-1 text-muted-foreground">
                    {s === 1 && "Pack"}
                    {s === 2 && "Quantité"}
                    {s === 3 && "Infos"}
                    {s === 4 && "Paiement"}
                  </span>
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

        {/* Étape 1 : Choix du pack */}
        {step === 1 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {packs.map((p, i) => {
                const rest = p.places - p.vendus;
                const pct = (p.vendus / p.places) * 100;
                const presqueComplet = rest < p.places * 0.1;
                
                return (
                  <motion.div
                    key={p.id}
                    className="relative bg-card rounded-xl border border-border overflow-hidden transition-all hover:border-primary/50 hover:shadow-xl group"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    {/* Badge Presque complet */}
                    {presqueComplet && (
                      <div className="absolute top-2 right-2 z-10">
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 animate-pulse">
                          <AlertCircle size={12} /> Presque complet
                        </span>
                      </div>
                    )}

                    {/* Image du billet */}
                    <div className="w-full aspect-[2/1] overflow-hidden">
                      <img src={p.image} alt={p.nom} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>

                    {/* Badge populaire ou exclusif */}
                    {(p.id === 3 || p.id === 4) && (
                      <div className={`gold-gradient text-primary-foreground text-center py-1 text-xs font-bold uppercase tracking-wider`}>
                        {p.id === 4 ? "⭐ Exclusif" : "🔥 Populaire"}
                      </div>
                    )}

                    <div className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-display text-xl text-foreground">{p.nom}</h3>
                        <p.icon size={20} className="text-primary" />
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">{p.description}</p>
                      
                      <p className="text-3xl font-bold text-primary font-display mb-3">
                        {p.prix.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">FCFA</span>
                      </p>

                      <div className="space-y-2 mb-4">
                        {p.avantages.slice(0, 4).map((a, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <span className="text-primary mt-0.5">✓</span>
                            <span>{a.replace("✅ ", "")}</span>
                          </div>
                        ))}
                        {p.avantages.length > 4 && (
                          <p className="text-xs text-primary">+{p.avantages.length - 4} autres avantages</p>
                        )}
                      </div>

                      {/* Barre de disponibilité */}
                      <div className="mt-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">{rest} places restantes</span>
                          <span className="text-foreground font-medium">{Math.round(pct)}% réservés</span>
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
                        onClick={() => { setSelectedPack(p.id); setStep(2); }}
                        className={`w-full mt-5 py-3 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all ${
                          p.id === 3 || p.id === 4
                            ? "gold-gradient text-primary-foreground hover:opacity-90"
                            : "border border-primary text-primary hover:bg-primary/10"
                        }`}
                      >
                        <Ticket size={16} className="inline mr-2" /> 
                        Choisir ce pack
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Information complémentaire */}
            <div className="mt-10 text-center">
              <p className="text-sm text-muted-foreground">
                🎫 Billet nominatif envoyé par email avec QR code unique.
                   Téléchargement PDF disponible.
                   Confirmation SMS avec numéro de réservation.
              </p>
            </div>
          </>
        )}

        {/* Étape 2 : Choix de la quantité */}
        {step === 2 && pack && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="max-w-lg mx-auto"
          >
            <div className="bg-card rounded-xl border border-border p-6 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <img src={pack.image} alt={pack.nom} className="w-20 h-10 object-cover rounded-lg" />
                <div>
                  <h2 className="font-display text-2xl text-foreground">{pack.nom}</h2>
                  <p className="text-sm text-muted-foreground">{pack.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                <span className="text-foreground">Prix unitaire</span>
                <span className="text-xl font-bold text-primary">{pack.prix.toLocaleString()} FCFA</span>
              </div>

              <div className="mt-6">
                <label className="block text-sm text-muted-foreground mb-2">
                  Nombre de billets (max {restant})
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantite(Math.max(1, quantite - 1))}
                    className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-primary/10 transition-colors"
                    disabled={quantite <= 1}
                  >
                    -
                  </button>
                  <div className="flex-1 text-center">
                    <span className="text-2xl font-bold text-foreground">{quantite}</span>
                    <span className="text-sm text-muted-foreground ml-1">billet(s)</span>
                  </div>
                  <button
                    onClick={() => setQuantite(Math.min(restant, quantite + 1))}
                    className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-primary/10 transition-colors"
                    disabled={quantite >= restant}
                  >
                    +
                  </button>
                </div>
                {quantite >= restant && (
                  <p className="text-xs text-red-500 mt-2">Plus que {restant} place(s) disponible(s)</p>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex justify-between items-center text-lg">
                  <span className="text-foreground">Total</span>
                  <span className="text-2xl font-bold gold-text">{total.toLocaleString()} FCFA</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setStep(1)} 
                className="flex-1 border border-border text-muted-foreground py-3 rounded-lg hover:bg-secondary transition-colors"
              >
                <ChevronLeft size={16} className="inline mr-1" /> Retour
              </button>
              <button 
                onClick={() => setStep(3)} 
                className="flex-1 gold-gradient text-primary-foreground py-3 rounded-lg font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity"
                disabled={quantite === 0}
              >
                Continuer <ChevronRight size={16} className="inline ml-1" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Étape 3 : Informations personnelles */}
        {step === 3 && pack && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="max-w-lg mx-auto space-y-6"
          >
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-display text-xl text-foreground mb-4">Vos informations</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    <User size={14} className="inline mr-1" /> Nom complet *
                  </label>
                  <input 
                    type="text" 
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    placeholder="Votre nom et prénom" 
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" 
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    <Phone size={14} className="inline mr-1" /> Numéro de téléphone *
                  </label>
                  <input 
                    type="tel" 
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    placeholder="6XX XXX XXX" 
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" 
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    <Mail size={14} className="inline mr-1" /> Adresse email *
                  </label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="votre@email.com" 
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" 
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">Votre billet avec QR code sera envoyé à cette adresse</p>
                </div>

                {pack.id === 6 && (
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">
                      Numéro de carte étudiante *
                    </label>
                    <input 
                      type="text" 
                      name="carteEtudiant"
                      value={formData.carteEtudiant}
                      onChange={handleInputChange}
                      placeholder="ex: ETU2025001" 
                      className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary" 
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">Présentez votre carte à l'entrée</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setStep(2)} 
                className="flex-1 border border-border text-muted-foreground py-3 rounded-lg hover:bg-secondary transition-colors"
              >
                <ChevronLeft size={16} className="inline mr-1" /> Retour
              </button>
              <button 
                onClick={handleReservation}
                className="flex-1 gold-gradient text-primary-foreground py-3 rounded-lg font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity"
                disabled={!formData.nom || !formData.telephone || !formData.email || (pack.id === 6 && !formData.carteEtudiant)}
              >
                Procéder au paiement
              </button>
            </div>
          </motion.div>
        )}

        {/* Étape 4 : Paiement */}
        {step === 4 && pack && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="max-w-lg mx-auto space-y-6"
          >
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-display text-xl text-foreground mb-4">Paiement sécurisé</h3>
              
              {/* Récapitulatif */}
              <div className="bg-secondary rounded-lg p-4 mb-6">
                <p className="text-sm text-muted-foreground mb-2">Récapitulatif de votre commande</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{pack.nom} x{quantite}</span>
                    <span>{pack.prix * quantite} FCFA</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t border-border">
                    <span>Total à payer</span>
                    <span className="gold-text">{total.toLocaleString()} FCFA</span>
                  </div>
                </div>
              </div>

              {/* Mode de paiement */}
              <div className="mb-6">
                <label className="block text-sm text-muted-foreground mb-3">Choisissez votre mode de paiement</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: "orange", label: "Orange Money", icon: "🟠", color: "from-orange-500 to-orange-600" },
                    { key: "mtn", label: "MTN MoMo", icon: "🟡", color: "from-yellow-500 to-yellow-600" },
                  ].map((p) => (
                    <button
                      key={p.key}
                      onClick={() => setPayment(p.key)}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                        payment === p.key 
                          ? "border-primary gold-glow bg-primary/10" 
                          : "border-border bg-card hover:border-primary/30"
                      }`}
                    >
                      <span className="text-2xl mb-2 block">{p.icon}</span>
                      <span className={`text-sm font-semibold ${
                        payment === p.key ? "text-primary" : "text-muted-foreground"
                      }`}>
                        {p.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Instructions de paiement */}
              <div className="bg-secondary/50 rounded-lg p-4 border border-border">
                <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Smartphone size={16} className="text-primary" />
                  Instructions de paiement {payment === "orange" ? "Orange Money" : "MTN MoMo"}
                </p>
                <ol className="text-xs text-muted-foreground space-y-2 list-decimal list-inside">
                  <li>Composez le <span className="font-mono text-foreground">#150#</span> sur votre téléphone</li>
                  <li>Sélectionnez "Transfert d'argent"</li>
                  <li>Entrez le numéro <span className="font-mono text-foreground">652430272</span></li>
                  <li>Entrez le montant de <span className="font-mono text-foreground">{total.toLocaleString()} FCFA</span></li>
                  <li>Entrez votre code secret pour confirmer</li>
                </ol>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setStep(3)} 
                className="flex-1 border border-border text-muted-foreground py-3 rounded-lg hover:bg-secondary transition-colors"
              >
                <ChevronLeft size={16} className="inline mr-1" /> Retour
              </button>
              <button 
                onClick={handleConfirmPaiement}
                className="flex-1 gold-gradient text-primary-foreground py-3 rounded-lg font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity"
              >
                <CreditCard size={16} className="inline mr-2" />
                J'ai payé
              </button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              En confirmant le paiement, vous acceptez nos conditions générales de vente.
              Le billet vous sera envoyé immédiatement après validation du paiement.
            </p>
          </motion.div>
        )}

        {/* Étape 5 : Confirmation et réception du billet */}
        {step === 5 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="max-w-md mx-auto"
          >
            <div className="bg-card rounded-xl border-2 border-primary/20 p-8 text-center">
              <div className="w-20 h-20 gold-gradient rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-primary-foreground" />
              </div>
              
              <h2 className="font-display text-2xl text-foreground mb-2">Réservation confirmée !</h2>
              <p className="text-muted-foreground mb-4">
                Votre billet <span className="text-primary font-bold">{pack?.nom}</span> a été réservé avec succès.
              </p>

              <div className="bg-secondary rounded-lg p-4 mb-6">
                <p className="text-xs text-muted-foreground mb-2">Numéro de réservation</p>
                <p className="text-2xl font-mono font-bold text-primary">{numeroReservation}</p>
              </div>

              {/* QR Code simulé */}
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
                  Le QR code sera scanné à l'entrée
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => window.print()}
                  className="flex items-center justify-center gap-2 border border-primary text-primary px-6 py-3 rounded-lg font-semibold text-sm uppercase tracking-wider hover:bg-primary/10 transition-colors"
                >
                  <Download size={16} /> Télécharger le billet (PDF)
                </button>

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
                    setFormData({ nom: "", telephone: "", email: "", carteEtudiant: "" });
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