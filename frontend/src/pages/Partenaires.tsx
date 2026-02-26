import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Download, Star, Award, Sparkles, Handshake, Send, CheckCircle, Mail, Phone } from "lucide-react";

import leGuide from "@/assets/partners/le-guide.png";
import kdmSono from "@/assets/partners/kdm-sono.png";
import trecyClean from "@/assets/partners/trecy-clean.png";
import noirFier from "@/assets/partners/noir-et-fier.png";
import tiaLogo from "@/assets/partners/3ia-logo.png";
import sirTech from "@/assets/partners/sir.png";
import firstKlass from "@/assets/partners/class.jpeg";

interface Partner {
  nom: string;
  logo: string;
  categorie: string;
  description: string;
  site: string;
  email?: string;
  telephone?: string;
}

const partners: Partner[] = [
  { 
    nom: "Sir-Tech", 
    logo: sirTech, 
    categorie: "Platine", 
    description: "Prestation de services informatiques – Ventes des Accessoires Informatique – Commerce import/export – Formations", 
    site: "https://www.sir-tech.org",
    telephone: "+237 652 430 272",
    email: "contact@sir-tech.org"
  },
  { 
    nom: "3iA", 
    logo: tiaLogo, 
    categorie: "Or", 
    description: "Institut Ingénierie Informatique Appliquée - Formation d'excellence en informatique", 
    site: "https://institut3ia.com",
    telephone: "+237 683 44 93 78",
    email: "contact@3ia.com"
  },
  { 
    nom: "First Klass", 
    logo: firstKlass, 
    categorie: "Or", 
    description: "Studio photo professionnel - Shooting, événements et couverture médiatique", 
    site: "#",
    telephone: "+237 6XX XXX XXX",
    email: "contact@firstklass.cm"
  },
  { 
    nom: "KDM Sono", 
    logo: kdmSono, 
    categorie: "Or", 
    description: "Sonorisation & Événementiel - Équipement professionnel pour vos événements", 
    site: "#",
    telephone: "+237 6XX XXX XXX"
  },
  { 
    nom: "Noir & Fier", 
    logo: noirFier, 
    categorie: "Argent", 
    description: "Deluxe Version / Street Wear - Marque de streetwear premium", 
    site: "#",
    email: "contact@noiretfier.com"
  },
  { 
    nom: "Le Guide", 
    logo: leGuide, 
    categorie: "Argent", 
    description: "Centre d'étude et de la réflexion juridique", 
    site: "#"
  },
  { 
    nom: "Trecy Clean Express", 
    logo: trecyClean, 
    categorie: "Bronze", 
    description: "Services de nettoyage professionnel pour entreprises et particuliers", 
    site: "#",
    telephone: "+237 6XX XXX XXX"
  },
];

const categoryOrder = ["Platine", "Or", "Argent", "Bronze"];

const categoryConfig: Record<string, { icon: React.ReactNode; emoji: string; gradient: string; border: string; badge: string; color: string }> = {
  Platine: {
    icon: <Sparkles className="w-5 h-5" />,
    emoji: "💎",
    gradient: "from-platinum/20 to-transparent",
    border: "border-platinum/30",
    badge: "bg-platinum/20 text-platinum",
    color: "platinum",
  },
  Or: {
    icon: <Award className="w-5 h-5" />,
    emoji: "🥇",
    gradient: "from-gold/20 to-transparent",
    border: "border-gold/30",
    badge: "bg-gold/20 text-gold",
    color: "gold",
  },
  Argent: {
    icon: <Star className="w-5 h-5" />,
    emoji: "🥈",
    gradient: "from-silver/20 to-transparent",
    border: "border-silver/30",
    badge: "bg-silver/20 text-silver",
    color: "silver",
  },
  Bronze: {
    icon: <Star className="w-5 h-5" />,
    emoji: "🥉",
    gradient: "from-bronze/20 to-transparent",
    border: "border-bronze/30",
    badge: "bg-bronze/20 text-bronze",
    color: "bronze",
  },
};

const advantages = [
  { title: "Visibilité Premium", desc: "Votre logo sur tous nos supports de communication et événements." },
  { title: "Réseau Exclusif", desc: "Accès à un réseau de professionnels et d'influenceurs." },
  { title: "Événements VIP", desc: "Invitations exclusives à nos soirées et événements privés." },
  { title: "Retombées Médiatiques", desc: "Couverture presse et réseaux sociaux de grande envergure." },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

// Formulaire de contact intégré (sans dropdown)
const PartnerContactForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    nom: "",
    entreprise: "",
    email: "",
    telephone: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ nom: "", entreprise: "", email: "", telephone: "", message: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-body font-medium text-foreground mb-1.5">
            Nom complet *
          </label>
          <input
            type="text"
            name="nom"
            required
            value={form.nom}
            onChange={handleChange}
            className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all font-body text-sm"
            placeholder="Votre nom"
          />
        </div>
        <div>
          <label className="block text-sm font-body font-medium text-foreground mb-1.5">
            Entreprise *
          </label>
          <input
            type="text"
            name="entreprise"
            required
            value={form.entreprise}
            onChange={handleChange}
            className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all font-body text-sm"
            placeholder="Nom de votre entreprise"
          />
        </div>
        <div>
          <label className="block text-sm font-body font-medium text-foreground mb-1.5">
            Email *
          </label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all font-body text-sm"
            placeholder="votre@email.com"
          />
        </div>
        <div>
          <label className="block text-sm font-body font-medium text-foreground mb-1.5">
            Téléphone
          </label>
          <input
            type="tel"
            name="telephone"
            value={form.telephone}
            onChange={handleChange}
            className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all font-body text-sm"
            placeholder="+237 XX XX XX XX"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-body font-medium text-foreground mb-1.5">
          Message *
        </label>
        <textarea
          name="message"
          required
          rows={4}
          value={form.message}
          onChange={handleChange}
          className="w-full rounded-lg border border-border bg-secondary px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all font-body text-sm resize-none"
          placeholder="Parlez-nous de votre entreprise et de vos objectifs de partenariat..."
        />
      </div>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-gradient-to-r from-gold to-yellow-500 text-primary-foreground font-body font-semibold py-3.5 px-6 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
      >
        {submitted ? (
          <>
            <CheckCircle className="w-5 h-5" />
            Message envoyé avec succès !
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Envoyer ma demande
          </>
        )}
      </motion.button>
    </form>
  );
};

const Partenaires = () => (
  <main className="min-h-screen bg-background">
    {/* Hero Section */}
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-body font-medium mb-6">
            <Handshake className="w-4 h-4" />
            Nos Partenaires
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6"
        >
          Ils font briller{" "}
          <span className="text-gradient-gold">Golden Vibes</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-body"
        >
          Des partenaires d'exception qui soutiennent notre vision et contribuent à créer
          des événements inoubliables.
        </motion.p>
      </div>
    </section>

    {/* Partners by Category */}
    <section className="container pb-20">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="space-y-16"
      >
        {categoryOrder.map((cat) => {
          const items = partners.filter((p) => p.categorie === cat);
          if (!items.length) return null;
          const config = categoryConfig[cat];

          return (
            <motion.div key={cat} variants={itemVariants}>
              <div className="flex items-center gap-3 mb-8">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${config.badge} font-body font-semibold text-sm`}>
                  {config.emoji} Partenaire {cat}
                </div>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className={`grid gap-6 ${cat === "Platine" ? "grid-cols-1 md:grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
                {items.map((p, i) => (
                  <motion.div
                    key={`${p.nom}-${i}`}
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`group relative block rounded-2xl border ${config.border} bg-gradient-to-br ${config.gradient} bg-card p-6 transition-all hover:shadow-gold ${cat === "Platine" ? "md:flex md:items-start md:gap-8 md:p-8" : ""}`}
                  >
                    {/* Logo - plus grand et plus visible */}
                    <div className={`flex items-center justify-center rounded-xl bg-secondary/50 overflow-hidden ${cat === "Platine" ? "w-40 h-40 md:w-48 md:h-48 flex-shrink-0" : "w-32 h-32 mx-auto"} mb-6 ${cat === "Platine" ? "md:mb-0" : ""}`}>
                      <img
                        src={p.logo}
                        alt={`Logo ${p.nom}`}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>

                    {/* Info */}
                    <div className={cat === "Platine" ? "flex-1" : "text-center"}>
                      <h3 className={`font-display font-bold mb-2 ${cat === "Platine" ? "text-2xl" : "text-xl"}`}>
                        {p.nom}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-muted-foreground text-sm font-body mb-4">
                        {p.description}
                      </p>

                      {/* Catégorie */}
                      <div className="flex items-center gap-2 justify-center md:justify-start mb-4">
                        <span className={`text-xs px-3 py-1 rounded-full ${config.badge} font-body font-medium`}>
                          {cat}
                        </span>
                      </div>

                      {/* Coordonnées de contact (optionnel) */}
                      {(p.email || p.telephone) && (
                        <div className="border-t border-border pt-3 mb-3 space-y-2">
                          {p.email && (
                            <a
                              href={`mailto:${p.email}`}
                              className="flex items-center justify-center md:justify-start text-xs text-muted-foreground hover:text-primary transition-colors gap-1"
                            >
                              <Mail className="w-3 h-3" />
                              <span className="truncate">{p.email}</span>
                            </a>
                          )}
                          {p.telephone && (
                            <a
                              href={`tel:${p.telephone}`}
                              className="flex items-center justify-center md:justify-start text-xs text-muted-foreground hover:text-primary transition-colors gap-1"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{p.telephone}</span>
                            </a>
                          )}
                        </div>
                      )}

                      {/* Lien cliquable vers le site web */}
                      {p.site && p.site !== "#" ? (
                        <a
                          href={p.site}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-gold to-yellow-500 text-primary-foreground font-body font-medium py-2 px-4 rounded-lg transition-all hover:shadow-lg text-sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Visiter le site web
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-2 bg-secondary text-muted-foreground font-body font-medium py-2 px-4 rounded-lg text-sm cursor-not-allowed">
                          <ExternalLink className="w-4 h-4" />
                          Site non disponible
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>

    {/* Devenir Partenaire Section */}
    <section className="relative py-20 md:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-body font-medium mb-6">
            <Handshake className="w-4 h-4" />
            Rejoignez-nous
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Devenir <span className="text-gradient-gold">Partenaire</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-body">
            Associez votre marque au prestige de Golden Vibes Events et bénéficiez d'une
            visibilité exceptionnelle.
          </p>
        </motion.div>

        {/* Advantages Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {advantages.map((adv, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="rounded-2xl border border-border bg-card p-6 text-center hover:border-gold/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-5 h-5 text-gold" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{adv.title}</h3>
              <p className="text-muted-foreground text-sm font-body">{adv.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Form + Download */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 max-w-5xl mx-auto">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3 rounded-2xl border border-border bg-card p-8"
          >
            <h3 className="font-display font-bold text-xl mb-6">Formulaire de contact</h3>
            <PartnerContactForm />
          </motion.div>

          {/* Sidebar info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Contact info */}
            <div className="rounded-2xl border border-border bg-card p-8">
              <h4 className="font-display font-bold text-lg mb-4">Contact Direct</h4>
              <div className="space-y-3 text-sm font-body">
                <p className="text-muted-foreground">
                  <span className="text-foreground font-medium">Email :</span>{" "}
                  partenariat@goldenvibes.events
                </p>
                <p className="text-muted-foreground">
                  <span className="text-foreground font-medium">Téléphone :</span>{" "}
                  +237 652 430 272
                </p>
                <p className="text-muted-foreground">
                  <span className="text-foreground font-medium">Adresse :</span>{" "}
                  Dschang, Cameroun
                </p>
                <p className="text-muted-foreground text-xs mt-4">
                  <span className="text-foreground font-medium">RCCM :</span> RC/Dschang/2021/A/05
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  </main>
);

export default Partenaires;