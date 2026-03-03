import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink, Star, Award, Sparkles, Handshake, Send,
  CheckCircle, Mail, Phone, AlertCircle, Loader2, ChevronDown,
  Globe, RefreshCw
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────
type Categorie = "platine" | "or" | "argent" | "bronze";

interface Partner {
  id: number;
  nom: string;
  logo: string;
  categorie: Categorie;
  description: string;
  site_web?: string;
  email?: string;
  telephone?: string;
  statut: "actif";
  ordre: number;
}

// ─── Config ──────────────────────────────────────────────────────────────────
const API_URL     = "http://localhost:8000/api";
const STORAGE_URL = "http://localhost:8000/storage";

const getLogoUrl = (logo: string) => {
  if (!logo) return null;
  if (logo.startsWith("http")) return logo;
  return `${STORAGE_URL}/${logo}`;
};

// Minuscules — correspondent exactement aux valeurs en BDD
const categoryOrder: Categorie[] = ["platine", "or", "argent", "bronze"];

const categoryConfig: Record<Categorie, {
  icon: React.ReactNode;
  emoji: string;
  label: string;
  gradient: string;
  border: string;
  badge: string;
  glow: string;
}> = {
  platine: {
    icon: <Sparkles className="w-4 h-4" />,
    emoji: "💎",
    label: "Platine",
    gradient: "from-[#e5e4e2]/10 via-transparent to-transparent",
    border: "border-[#e5e4e2]/20 hover:border-[#e5e4e2]/50",
    badge: "bg-[#e5e4e2]/15 text-[#d4d3d1] ring-1 ring-[#e5e4e2]/30",
    glow: "hover:shadow-[0_0_40px_rgba(229,228,226,0.12)]",
  },
  or: {
    icon: <Award className="w-4 h-4" />,
    emoji: "🥇",
    label: "Or",
    gradient: "from-amber-400/10 via-transparent to-transparent",
    border: "border-amber-400/20 hover:border-amber-400/50",
    badge: "bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/30",
    glow: "hover:shadow-[0_0_40px_rgba(251,191,36,0.12)]",
  },
  argent: {
    icon: <Star className="w-4 h-4" />,
    emoji: "🥈",
    label: "Argent",
    gradient: "from-slate-400/10 via-transparent to-transparent",
    border: "border-slate-400/20 hover:border-slate-400/50",
    badge: "bg-slate-400/15 text-slate-300 ring-1 ring-slate-400/30",
    glow: "hover:shadow-[0_0_40px_rgba(148,163,184,0.12)]",
  },
  bronze: {
    icon: <Star className="w-4 h-4" />,
    emoji: "🥉",
    label: "Bronze",
    gradient: "from-orange-700/10 via-transparent to-transparent",
    border: "border-orange-700/20 hover:border-orange-700/50",
    badge: "bg-orange-700/15 text-orange-400 ring-1 ring-orange-700/30",
    glow: "hover:shadow-[0_0_40px_rgba(194,120,64,0.12)]",
  },
};

// Fallback sécurisé : si catégorie inconnue, on prend bronze
const getCfg = (cat: string) => categoryConfig[cat as Categorie] ?? categoryConfig.bronze;

const advantages = [
  { title: "Visibilité Premium", desc: "Votre logo sur tous nos supports de communication et événements.", emoji: "📣" },
  { title: "Réseau Exclusif",    desc: "Accès à un réseau de professionnels et d'influenceurs.",          emoji: "🤝" },
  { title: "Événements VIP",     desc: "Invitations exclusives à nos soirées et événements privés.",       emoji: "🎟️" },
  { title: "Retombées Médias",   desc: "Couverture presse et réseaux sociaux de grande envergure.",        emoji: "📰" },
];

// ─── Animations ───────────────────────────────────────────────────────────────
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp  = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};
const scaleIn = {
  hidden:  { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

// ─── Hook API ─────────────────────────────────────────────────────────────────
function usePartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/partenaires`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error("Réponse API invalide");
      // Normalise la catégorie en minuscules pour matcher categoryConfig
      const data: Partner[] = (json.data as Partner[]).map(p => ({
        ...p,
        categorie: (p.categorie ?? "").toLowerCase() as Categorie,
      }));
      setPartners(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);
  return { partners, loading, error, reload: load };
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const PartnerSkeleton = () => (
  <div className="rounded-2xl border border-white/5 bg-white/3 p-6 animate-pulse">
    <div className="w-24 h-24 mx-auto rounded-xl bg-white/5 mb-4" />
    <div className="h-4 bg-white/5 rounded w-2/3 mx-auto mb-2" />
    <div className="h-3 bg-white/5 rounded w-full mb-1" />
    <div className="h-3 bg-white/5 rounded w-5/6 mx-auto" />
  </div>
);

// ─── Card Partenaire ──────────────────────────────────────────────────────────
const PartnerCard = ({ p, platinum = false }: { p: Partner; platinum?: boolean }) => {
  const cfg = getCfg(p.categorie);
  const [imgErr, setImgErr] = useState(false);
  const logoUrl = getLogoUrl(p.logo);

  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -6, transition: { type: "spring", stiffness: 300 } }}
      className={`group relative rounded-2xl border ${cfg.border} ${cfg.glow}
        bg-gradient-to-br ${cfg.gradient} bg-[rgba(255,255,255,0.03)]
        backdrop-blur-sm p-6 transition-all duration-300
        ${platinum ? "md:flex md:items-start md:gap-10 md:p-10" : ""}`}
    >
      {/* Badge catégorie */}
      <div className={`absolute top-4 right-4 flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.badge}`}>
        {cfg.icon} {cfg.label}
      </div>

      {/* Logo */}
      <div className={`flex items-center justify-center rounded-xl bg-white/5 overflow-hidden
        ${platinum ? "w-40 h-40 flex-shrink-0" : "w-28 h-28 mx-auto mb-5"}`}>
        {logoUrl && !imgErr ? (
          <img
            src={logoUrl}
            alt={`Logo ${p.nom}`}
            className="w-full h-full object-contain p-3"
            onError={() => setImgErr(true)}
          />
        ) : (
          <span className="text-4xl">{cfg.emoji}</span>
        )}
      </div>

      {/* Contenu */}
      <div className={platinum ? "flex-1 pt-1" : "text-center"}>
        <h3
          className={`font-bold tracking-tight mb-2 ${platinum ? "text-2xl" : "text-lg"}`}
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {p.nom}
        </h3>
        <p className="text-sm text-white/50 mb-4 leading-relaxed">{p.description}</p>

        {(p.email || p.telephone) && (
          <div className="border-t border-white/5 pt-3 mb-4 space-y-1.5">
            {p.email && (
              <a href={`mailto:${p.email}`}
                 className={`flex items-center gap-1.5 text-xs text-white/40 hover:text-amber-300 transition-colors ${platinum ? "" : "justify-center"}`}>
                <Mail className="w-3 h-3" /> {p.email}
              </a>
            )}
            {p.telephone && (
              <a href={`tel:${p.telephone}`}
                 className={`flex items-center gap-1.5 text-xs text-white/40 hover:text-amber-300 transition-colors ${platinum ? "" : "justify-center"}`}>
                <Phone className="w-3 h-3" /> {p.telephone}
              </a>
            )}
          </div>
        )}

        {p.site_web && p.site_web !== "" ? (
          <a href={p.site_web} target="_blank" rel="noopener noreferrer"
             className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-semibold text-xs py-2 px-4 rounded-lg transition-all hover:brightness-110 hover:shadow-lg hover:shadow-amber-400/25">
            <Globe className="w-3.5 h-3.5" /> Visiter le site
          </a>
        ) : (
          <span className="inline-flex items-center gap-2 text-white/20 text-xs py-2 px-4 rounded-lg border border-white/5 cursor-not-allowed">
            <ExternalLink className="w-3.5 h-3.5" /> Site non disponible
          </span>
        )}
      </div>
    </motion.article>
  );
};

// ─── Filtre ───────────────────────────────────────────────────────────────────
type FilterValue = Categorie | "tous";

const FilterBar = ({ active, onChange }: { active: FilterValue; onChange: (v: FilterValue) => void }) => (
  <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
    {(["tous", ...categoryOrder] as FilterValue[]).map(t => {
      const cfg = t !== "tous" ? getCfg(t) : null;
      return (
        <button key={t} onClick={() => onChange(t)}
          className={`text-sm font-semibold px-4 py-1.5 rounded-full border transition-all ${
            active === t
              ? "bg-amber-400 text-black border-amber-400"
              : "border-white/10 text-white/50 hover:border-white/30 hover:text-white/80"
          }`}>
          {t === "tous" ? "Tous" : `${cfg!.emoji} ${cfg!.label}`}
        </button>
      );
    })}
  </div>
);

// ─── Formulaire ───────────────────────────────────────────────────────────────
const ContactForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending]     = useState(false);
  const [form, setForm] = useState({ nom: "", entreprise: "", email: "", telephone: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1200));
    setSending(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setForm({ nom: "", entreprise: "", email: "", telephone: "", message: "" });
  };

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/40 transition-all text-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { name: "nom",        label: "Nom complet *",       type: "text",  ph: "Votre nom",               req: true  },
          { name: "entreprise", label: "Entreprise *",        type: "text",  ph: "Nom de votre entreprise", req: true  },
          { name: "email",      label: "Email *",             type: "email", ph: "votre@email.com",          req: true  },
          { name: "telephone",  label: "Téléphone",           type: "tel",   ph: "+237 XX XX XX XX",         req: false },
        ].map(f => (
          <div key={f.name}>
            <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">{f.label}</label>
            <input type={f.type} name={f.name} required={f.req}
                   value={form[f.name as keyof typeof form]}
                   onChange={handleChange} className={inputClass} placeholder={f.ph} />
          </div>
        ))}
      </div>
      <div>
        <label className="block text-xs font-semibold text-white/50 mb-1.5 uppercase tracking-wider">Message *</label>
        <textarea name="message" required rows={4} value={form.message}
                  onChange={handleChange} className={`${inputClass} resize-none`}
                  placeholder="Parlez-nous de votre entreprise et de vos objectifs de partenariat..." />
      </div>

      <motion.button type="submit" disabled={sending || submitted}
        whileHover={!sending && !submitted ? { scale: 1.02 } : {}}
        whileTap={!sending && !submitted ? { scale: 0.98 } : {}}
        className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70 shadow-lg hover:shadow-amber-400/30">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.span key="ok" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" /> Demande envoyée !
            </motion.span>
          ) : sending ? (
            <motion.span key="load" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" /> Envoi en cours…
            </motion.span>
          ) : (
            <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
              <Send className="w-5 h-5" /> Envoyer ma demande
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </form>
  );
};

// ─── Page principale ──────────────────────────────────────────────────────────
const Partenaires = () => {
  const { partners, loading, error, reload } = usePartners();
  const [filter, setFilter] = useState<FilterValue>("tous");

  const filtered = filter === "tous" ? partners : partners.filter(p => p.categorie === filter);
  const grouped  = categoryOrder.reduce<Record<string, Partner[]>>((acc, cat) => {
    const items = filtered.filter(p => p.categorie === cat);
    if (items.length) acc[cat] = items;
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-[#080808] text-white overflow-x-hidden"
          style={{ fontFamily: "'DM Sans', sans-serif" }}>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');`}</style>

      {/* Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-400/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-0 w-[400px] h-[400px] bg-yellow-300/4 rounded-full blur-[100px]" />
      </div>

      {/* ── Hero ── */}
      <section className="relative z-10 pt-28 pb-20 text-center px-4">
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 text-amber-300 text-xs font-semibold tracking-widest uppercase mb-8">
            <Handshake className="w-3.5 h-3.5" /> Nos Partenaires
          </span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black mb-6 leading-[1.05]"
          style={{ fontFamily: "'Playfair Display', serif" }}>
          Ils font briller<br />
          <span className="bg-gradient-to-r from-amber-300 to-yellow-500 bg-clip-text text-transparent">
            Golden Vibes
          </span>
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="text-white/40 text-lg max-w-xl mx-auto">
          Des partenaires d'exception qui soutiennent notre vision et créent avec nous des événements inoubliables.
        </motion.p>

        {/* Stats tiers */}
        {!loading && !error && partners.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-8 mt-12">
            {categoryOrder.map(cat => {
              const count = partners.filter(p => p.categorie === cat).length;
              if (!count) return null;
              const cfg = getCfg(cat);
              return (
                <div key={cat} className="text-center">
                  <p className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>{count}</p>
                  <p className="text-xs text-white/35 mt-1">{cfg.emoji} {cfg.label}</p>
                </div>
              );
            })}
          </motion.div>
        )}
      </section>

      {/* ── Grille ── */}
      <section className="relative z-10 container mx-auto max-w-6xl px-4 pb-24">

        {!loading && !error && partners.length > 0 && (
          <FilterBar active={filter} onChange={setFilter} />
        )}

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <PartnerSkeleton key={i} />)}
          </div>
        )}

        {error && (
          <motion.div variants={scaleIn} initial="hidden" animate="visible"
            className="flex flex-col items-center gap-4 py-20 text-center">
            <AlertCircle className="w-12 h-12 text-red-400/60" />
            <p className="text-white/40 text-sm">
              Impossible de charger les partenaires<br />
              <span className="text-red-400/60 text-xs">{error}</span>
            </p>
            <button onClick={reload}
              className="inline-flex items-center gap-2 text-sm border border-white/10 px-4 py-2 rounded-xl hover:border-white/30 transition-colors text-white/50 hover:text-white">
              <RefreshCw className="w-4 h-4" /> Réessayer
            </button>
          </motion.div>
        )}

        {!loading && !error && partners.length === 0 && (
          <p className="text-center text-white/30 py-20">Aucun partenaire actif pour le moment.</p>
        )}

        {!loading && !error && Object.keys(grouped).length > 0 && (
          <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-14">
            {categoryOrder.map(cat => {
              const items = grouped[cat];
              if (!items?.length) return null;
              const cfg = getCfg(cat);
              const isPlatinum = cat === "platine";

              return (
                <motion.div key={cat} variants={fadeUp}>
                  <div className="flex items-center gap-4 mb-6">
                    <span className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full ${cfg.badge}`}>
                      {cfg.emoji} Partenaire {cfg.label}
                    </span>
                    <div className="flex-1 h-px bg-white/5" />
                    <span className="text-xs text-white/20">{items.length} partenaire{items.length > 1 ? "s" : ""}</span>
                  </div>

                  <div className={`grid gap-6 ${isPlatinum ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
                    {items.map((p, i) => (
                      <PartnerCard key={p.id ?? `${p.nom}-${i}`} p={p} platinum={isPlatinum} />
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {!loading && !error && partners.length > 0 && Object.keys(grouped).length === 0 && (
          <p className="text-center text-white/30 py-20">Aucun partenaire dans cette catégorie.</p>
        )}
      </section>

      {/* ── Devenir Partenaire ── */}
      <section className="relative z-10 bg-gradient-to-b from-white/2 to-transparent py-24">
        <div className="container mx-auto max-w-6xl px-4">

          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 text-amber-300 text-xs font-semibold tracking-widest uppercase mb-6">
              <Handshake className="w-3.5 h-3.5" /> Rejoignez-nous
            </span>
            <h2 className="text-4xl md:text-6xl font-black mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Devenir{" "}
              <span className="bg-gradient-to-r from-amber-300 to-yellow-500 bg-clip-text text-transparent">
                Partenaire
              </span>
            </h2>
            <p className="text-white/40 max-w-xl mx-auto">
              Associez votre marque au prestige de Golden Vibes Events et bénéficiez d'une visibilité exceptionnelle.
            </p>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="visible"
            viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {advantages.map((adv, i) => (
              <motion.div key={i} variants={fadeUp}
                className="rounded-2xl border border-white/5 bg-white/3 p-6 text-center hover:border-amber-400/20 hover:bg-white/5 transition-all">
                <div className="text-3xl mb-4">{adv.emoji}</div>
                <h3 className="font-bold text-base mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{adv.title}</h3>
                <p className="text-white/40 text-sm">{adv.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="lg:col-span-3 rounded-2xl border border-white/7 bg-white/3 p-8">
              <h3 className="font-bold text-xl mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                Formulaire de contact
              </h3>
              <ContactForm />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 space-y-5">

              <div className="rounded-2xl border border-white/7 bg-white/3 p-8">
                <h4 className="font-bold text-lg mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Contact Direct
                </h4>
                <div className="space-y-3 text-sm">
                  {[
                    { label: "Email",     value: "partenariat@goldenvibes.events", href: "mailto:partenariat@goldenvibes.events" },
                    { label: "Téléphone", value: "+237 652 430 272",               href: "tel:+237652430272" },
                    { label: "Adresse",   value: "Dschang, Cameroun",              href: undefined },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between gap-2">
                      <span className="text-white/30 shrink-0">{row.label}</span>
                      {row.href
                        ? <a href={row.href} className="text-amber-300/80 hover:text-amber-300 text-right transition-colors">{row.value}</a>
                        : <span className="text-white/60 text-right">{row.value}</span>}
                    </div>
                  ))}
                  <div className="flex justify-between gap-2 pt-2 border-t border-white/5">
                    <span className="text-white/20 text-xs">RCCM</span>
                    <span className="text-white/30 text-xs">RC/Dschang/2021/A/05</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/7 bg-white/3 p-6">
                <h4 className="font-semibold text-sm mb-4 text-white/60 uppercase tracking-wider">
                  Niveaux de partenariat
                </h4>
                <div className="space-y-3">
                  {categoryOrder.map(cat => {
                    const cfg = getCfg(cat);
                    return (
                      <div key={cat} className={`flex items-center gap-3 text-sm px-3 py-2 rounded-xl ${cfg.badge}`}>
                        <span>{cfg.emoji}</span>
                        <span className="font-semibold">{cfg.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="flex justify-center pb-10 opacity-20">
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </div>
    </main>
  );
};

export default Partenaires;