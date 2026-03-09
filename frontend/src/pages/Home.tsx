/**
 * Page d'accueil - Golden Vibes Events
 * Sections dynamiques : Candidats leaders, Événements, Partenaires (marquee)
 */

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Crown, Ticket, Users, Star, MapPin, Calendar, Music, Heart,
  ChevronRight, ChevronLeft, Clock, Eye, Quote, Newspaper,
  UserPlus, Handshake, Facebook, Instagram, Twitter, Phone, Trophy,
  Loader2, AlertCircle
} from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import logo from "@/assets/logo-golden-vibes.png";
import Countdown from "@/components/Countdown";
import djWilly         from "@/assets/djs/dj-willy.jpg";
import djSlimboyz      from "@/assets/djs/dj-slimboyz.jpg";
import djSeven         from "@/assets/djs/dj-seven.jpg";
import djZidane        from "@/assets/djs/dj-zidane.jpg";
import djNike          from "@/assets/djs/dj-nike.jpg";
import wizdomOg        from "@/assets/artists/wizdom-og.jpg";
import karlixGyal      from "@/assets/artists/karlix-gyal.jpg";
import artisteSurprise from "@/assets/artists/artiste-surprise.jpg";

import { API_URL, getImageUrl } from "@/services/api";

interface Candidat {
  id: number; nom: string; numero: number;
  categorie: "miss" | "master"; votes_count: number;
  photo1?: string; photo2?: string; age?: number;
  ville?: string; talent?: string; description?: string;
}
interface Evenement {
  id: number; nom: string; date: string;
  heure?: string; lieu?: string; theme?: string;
  description?: string; photos: unknown[];
}
interface Partenaire {
  id: number; nom: string; logo: string;
  categorie: string; site_web?: string;
}

function useCandidats() {
  const [data, setData]       = useState<Candidat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  useEffect(() => {
    fetch(`${API_URL}/candidats?sort=votes_count&order=desc`)
      .then(r => r.json()).then(j => setData(j.data ?? j))
      .catch(() => setError("Impossible de charger les candidats"))
      .finally(() => setLoading(false));
  }, []);
  return { data, loading, error };
}

function useEvenements() {
  const [data, setData]       = useState<Evenement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  useEffect(() => {
    fetch(`${API_URL}/evenements`)
      .then(r => r.json()).then(j => setData(j.data ?? j))
      .catch(() => setError("Impossible de charger les événements"))
      .finally(() => setLoading(false));
  }, []);
  return { data, loading, error };
}

function usePartenaires() {
  const [data, setData]       = useState<Partenaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  useEffect(() => {
    fetch(`${API_URL}/partenaires`)
      .then(r => r.json())
      .then(j => setData((j.data ?? j).map((p: Partenaire) => ({ ...p, categorie: (p.categorie ?? "").toLowerCase() }))))
      .catch(() => setError("Impossible de charger les partenaires"))
      .finally(() => setLoading(false));
  }, []);
  return { data, loading, error };
}

const djs = [
  { nom: "DJ Willy",           photo: djWilly    },
  { nom: "DJ Slimboyz",        photo: djSlimboyz },
  { nom: "DJ Seven",           photo: djSeven    },
  { nom: "DJ Zidane",          photo: djZidane   },
  { nom: "DJ Nike La Légende", photo: djNike     },
];
const artists = [
  { nom: "Wizdom OG",        photo: wizdomOg        },
  { nom: "Karlix Gyal",      photo: karlixGyal      },
  { nom: "Artiste Surprise", photo: artisteSurprise },
];
const temoignages = [
  { nom: "Linda N.",  texte: "Golden Vibes m'a donné confiance en moi. Une expérience inoubliable !", role: "Miss Golden Vibes 2025" },
  { nom: "Steve M.",  texte: "L'ambiance, le professionnalisme… Dschang n'a jamais vu ça !",           role: "Spectateur fidèle"     },
  { nom: "Carole T.", texte: "Participer comme partenaire nous a ouvert des portes incroyables.",       role: "Sponsor Or 2025"      },
];
const actualites = [
  { titre: "Inscriptions ouvertes pour Miss & Mister 2026",    date: "15 Jan 2026",  extrait: "Les candidatures sont désormais ouvertes. Rejoignez l'aventure Golden Vibes !" },
  { titre: "Nouveau partenaire : KDM SONO rejoint la famille", date: "20 Fév 2026",  extrait: "KDM SONO assurera la sonorisation professionnelle de la grande soirée."        },
  { titre: "DJ Nike La Légende confirmé pour le 11 Avril",     date: "01 Mars 2026", extrait: "Le légendaire DJ Nike sera aux platines pour une soirée explosive."            },
];

const SectionLoader = () => (
  <div className="flex justify-center py-12">
    <Loader2 size={32} className="animate-spin text-primary" />
  </div>
);

const SectionError = ({ msg }: { msg: string }) => (
  <div className="flex justify-center items-center gap-2 py-12 text-muted-foreground text-sm">
    <AlertCircle size={16} className="text-red-400" /> {msg}
  </div>
);

// ─── Marquee item ─────────────────────────────────────────────────────────────
const MarqueeItem = ({ p }: { p: Partenaire }) => {
  const [imgErr, setImgErr] = useState(false);
  const logoUrl = getImageUrl(p.logo);
  const card = (
    <div className="flex flex-col items-center justify-center gap-2
      bg-card border border-border rounded-xl px-5 py-4 w-36 h-28 shrink-0
      hover:border-primary/40 hover:shadow-lg transition-all">
      <div className="w-14 h-14 flex items-center justify-center rounded-lg bg-secondary/50 overflow-hidden">
        {logoUrl && !imgErr
          ? <img src={logoUrl} alt={p.nom} className="w-full h-full object-contain p-1" onError={() => setImgErr(true)} />
          : <span className="text-2xl">🤝</span>
        }
      </div>
      <p className="text-xs font-medium text-foreground text-center leading-tight line-clamp-2">{p.nom}</p>
    </div>
  );
  return p.site_web
    ? <a href={p.site_web} target="_blank" rel="noopener noreferrer">{card}</a>
    : <div>{card}</div>;
};

// ─── Marquee piste ────────────────────────────────────────────────────────────
const MarqueePartenaires = ({ partenaires }: { partenaires: Partenaire[] }) => {
  const items = [...partenaires, ...partenaires];
  return (
    <div className="relative w-full overflow-hidden py-2">
      <div className="pointer-events-none absolute left-0 top-0 h-full w-20 z-10 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-20 z-10 bg-gradient-to-l from-background to-transparent" />
      <div
        className="flex gap-5 w-max"
        style={{ animation: "gv-marquee 28s linear infinite" }}
        onMouseEnter={e => (e.currentTarget.style.animationPlayState = "paused")}
        onMouseLeave={e => (e.currentTarget.style.animationPlayState = "running")}
      >
        {items.map((p, i) => <MarqueeItem key={`${p.id}-${i}`} p={p} />)}
      </div>
      <style>{`@keyframes gv-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
    </div>
  );
};

// ─── Carte Leader ─────────────────────────────────────────────────────────────
const LeaderCard = ({ candidat: c, delay }: { candidat: Candidat; delay: number }) => {
  const photos = [c.photo1, c.photo2].filter(Boolean).map(p => getImageUrl(p)!).filter(Boolean);
  const [idx, setIdx]       = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!paused && photos.length > 1) {
      timer.current = setInterval(() => setIdx(p => (p + 1) % photos.length), 3000);
    }
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [paused, photos.length]);

  const go = (dir: 1 | -1, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setIdx(p => (p + dir + photos.length) % photos.length);
    setPaused(true); setTimeout(() => setPaused(false), 5000);
  };

  // Determine badge text based on position
  const getBadgeText = () => {
    if (c.categorie === "miss") return "LEADER MISS";
    if (c.categorie === "master") return "LEADER MASTER";
    return "CANDIDAT";
  };

  return (
    <motion.div
      className="bg-card rounded-xl border-2 border-gold/30 overflow-hidden group hover:border-gold transition-all shadow-xl"
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay }}
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
        <div className="absolute top-2 left-2 z-20">
          <span className="bg-gold text-primary-foreground text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <Trophy size={12} /> {getBadgeText()}
          </span>
        </div>
        <div className="absolute top-2 right-2 z-10">
          <span className="bg-background/80 backdrop-blur-sm text-foreground text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <Heart size={12} className="text-gold" /> {Number(c.votes_count ?? 0).toLocaleString()}
          </span>
        </div>
        {photos.length > 0
          ? photos.map((photo, i) => (
              <img key={i} src={photo} alt={`${c.nom} ${i + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === idx ? "opacity-100" : "opacity-0"}`} />
            ))
          : <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs">Aucune photo</div>
        }
        {photos.length > 1 && (
          <>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
              {photos.map((_, i) => (
                <button key={i}
                  onClick={() => { setIdx(i); setPaused(true); setTimeout(() => setPaused(false), 5000); }}
                  className={`transition-all ${i === idx ? "w-3 h-1.5 bg-yellow-400 rounded-full" : "w-1.5 h-1.5 bg-white/70 rounded-full"}`}
                />
              ))}
            </div>
            <button onClick={e => go(-1, e)} className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
              <ChevronLeft size={14} className="text-white" />
            </button>
            <button onClick={e => go(1, e)} className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
              <ChevronRight size={14} className="text-white" />
            </button>
          </>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-display text-xl text-foreground leading-tight">{c.nom}</h3>
            {(c.age || c.ville) && (
              <p className="text-xs text-muted-foreground">{[c.age ? `${c.age} ans` : null, c.ville].filter(Boolean).join(" • ")}</p>
            )}
          </div>
          <span className="text-sm font-bold text-gold">#{c.numero}</span>
        </div>
        {c.description && <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{c.description}</p>}
        {c.talent && <div className="mb-3"><span className="text-xs bg-secondary text-foreground px-2 py-1 rounded-full">{c.talent}</span></div>}
        <div className="flex gap-2">
          <Link to={`/candidats/${c.id}`} className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-medium bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors">
            <Eye size={14} /> Profil
          </Link>
          <Link to={`/vote?candidat=${c.id}`} className="flex-1 flex items-center justify-center gap-1 py-2 gold-gradient text-primary-foreground text-xs font-bold uppercase rounded-lg">
            <Heart size={14} /> Voter
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Carte Événement ──────────────────────────────────────────────────────────
const EvenementCard = ({ ev, delay }: { ev: Evenement; delay: number }) => {
  const photo = Array.isArray(ev.photos) && ev.photos.length > 0 ? getImageUrl(ev.photos[0] as string) : null;
  return (
    <motion.div
      className="bg-card rounded-xl border border-border overflow-hidden group hover:border-primary/50 transition-all"
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay }}
    >
      <div className="aspect-video overflow-hidden bg-secondary">
        {photo
          ? <img src={photo} alt={ev.nom} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          : <div className="w-full h-full flex items-center justify-center"><Calendar size={32} className="text-muted-foreground/30" /></div>
        }
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg text-foreground mb-2">{ev.nom}</h3>
        <div className="space-y-1 text-xs text-muted-foreground mb-3">
          {ev.date && (
            <p className="flex items-center gap-1.5">
              <Calendar size={12} className="text-primary" />
              {new Date(ev.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          )}
          {ev.heure && <p className="flex items-center gap-1.5"><Clock size={12} className="text-primary" /> {ev.heure}</p>}
          {ev.lieu  && <p className="flex items-center gap-1.5"><MapPin size={12} className="text-primary" /> {ev.lieu}</p>}
        </div>
        {ev.theme && <span className="inline-block text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full mb-3">{ev.theme}</span>}
        {ev.description && <p className="text-sm text-muted-foreground leading-relaxed">{ev.description}</p>}
        <Link to="/evenements" className="inline-flex items-center gap-1 text-primary text-xs font-medium mt-3 hover:underline">
          En savoir plus <ChevronRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
};

// ─── Page principale ──────────────────────────────────────────────────────────
const Home = () => {
  const { data: candidats,   loading: loadingC, error: errorC } = useCandidats();
  const { data: evenements,  loading: loadingE, error: errorE } = useEvenements();
  const { data: partenaires, loading: loadingP, error: errorP } = usePartenaires();

  // Get top 4 candidats for the Leaders section (sorted by votes)
  const topCandidats = candidats.slice(0, 4);

  return (
    <div>
      {/* ===== 1. HERO ===== */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/75" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.img src={logo} alt="Golden Vibes" className="w-28 h-28 mx-auto mb-6"
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} />
          <motion.h1
            className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-4 drop-shadow-lg"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            Miss & Mister <span className="gold-text">Golden Vibes</span> 2026
          </motion.h1>
          <motion.p className="text-lg sm:text-2xl text-white font-semibold mb-2 drop-shadow-md"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            📍 Dschang · Mbouo Star Palace · 11 Avril 2026 · 18h
          </motion.p>
          <motion.p className="text-sm text-white/70 italic mb-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            "Brille, vibre et marque l'histoire de l'ambiance à Dschang"
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <Countdown targetDate="2026-04-11T18:00:00" />
          </motion.div>
          <motion.div className="flex flex-wrap justify-center gap-3 mt-8"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
            <Link to="/candidats" className="gold-gradient text-primary-foreground px-6 py-3 rounded-lg font-semibold text-sm uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-2">
              <Heart size={16} /> Voter Maintenant
            </Link>
            <Link to="/billetterie" className="border border-primary text-primary px-6 py-3 rounded-lg font-semibold text-sm uppercase tracking-wider hover:bg-primary/10 transition-colors flex items-center gap-2">
              <Ticket size={16} /> Acheter un Billet
            </Link>
            <Link to="/contact" className="border border-white/30 text-white px-6 py-3 rounded-lg font-semibold text-sm uppercase tracking-wider hover:bg-white/10 transition-colors flex items-center gap-2">
              <UserPlus size={16} /> Devenir Candidat
            </Link>
            <Link to="/partenaires" className="border border-white/30 text-white px-6 py-3 rounded-lg font-semibold text-sm uppercase tracking-wider hover:bg-white/10 transition-colors flex items-center gap-2">
              <Handshake size={16} /> Devenir Partenaire
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===== 2. PRÉSENTATION ===== */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <motion.h2 className="font-display text-3xl gold-text mb-6"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            L'Événement Qui Fait Vibrer Dschang
          </motion.h2>
          <motion.p className="text-muted-foreground leading-relaxed text-base sm:text-lg mb-6"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <strong className="text-foreground">Golden Vibes Events</strong> est la plus grande soirée de gala, de mode et de talents de la ville de Dschang.
            Chaque année, des candidat(e)s brillant(e)s rivalisent d'élégance, de charisme et de talent pour décrocher les titres convoités
            de <span className="text-primary font-semibold">Miss</span> et <span className="text-primary font-semibold">Mister Golden Vibes</span>.
          </motion.p>
          <motion.p className="text-muted-foreground leading-relaxed text-base sm:text-lg"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            Au programme : défilé de mode, performances artistiques, DJs de renom et une ambiance 100% prestige.
            Rejoignez-nous le <span className="text-primary font-semibold">11 Avril 2026</span> au{" "}
            <span className="text-primary font-semibold">Mbouo Star Palace</span> pour une nuit inoubliable. 🌟
          </motion.p>
        </div>
      </section>

      {/* ===== 3. LEADERS ===== */}
      <section className="py-12 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy size={24} className="text-gold" />
              <h2 className="font-display text-2xl sm:text-3xl gold-text">Les Leaders</h2>
              <Trophy size={24} className="text-gold" />
            </div>
            <p className="text-sm text-muted-foreground">Les 4 candidats en tête des votes</p>
          </div>
          {loadingC && <SectionLoader />}
          {errorC   && <SectionError msg={errorC} />}
          {!loadingC && !errorC && topCandidats.length > 0 && (
            <>
              {/* Desktop: 4 cards grid with original size */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {topCandidats.map((c, i) => <LeaderCard key={c.id} candidat={c} delay={i * 0.1} />)}
              </div>
              {/* Mobile: 2 cards grid with original size */}
              <div className="md:hidden grid grid-cols-2 gap-4 max-w-lg mx-auto">
                {topCandidats.slice(0, 2).map((c, i) => <LeaderCard key={c.id} candidat={c} delay={i * 0.1} />)}
              </div>
            </>
          )}
          {!loadingC && !errorC && topCandidats.length === 0 && (
            <p className="text-center text-muted-foreground text-sm py-8">Aucun candidat disponible pour le moment(0).</p>
          )}
          <div className="text-center mt-8">
            <Link to="/candidats" className="inline-flex items-center gap-1 text-primary text-sm font-medium hover:underline">
              Voir tous les candidats <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 4. ÉVÉNEMENTS ===== */}
      <section className="py-14 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl gold-text text-center mb-3">Événements Annexes</h2>
          <p className="text-center text-muted-foreground mb-10 text-sm">Toute la programmation autour de Golden Vibes 2026</p>
          {loadingE && <SectionLoader />}
          {errorE   && <SectionError msg={errorE} />}
          {!loadingE && !errorE && evenements.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {evenements.slice(0, 3).map((ev, i) => <EvenementCard key={ev.id} ev={ev} delay={i * 0.1} />)}
            </div>
          )}
          {!loadingE && !errorE && evenements.length === 0 && (
            <p className="text-center text-muted-foreground text-sm py-8">Aucun événement programmé pour le moment.</p>
          )}
          <div className="text-center mt-8">
            <Link to="/evenements" className="inline-flex items-center gap-1 text-primary text-sm font-medium hover:underline">
              Voir tous les événements <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 5. LINE-UP ===== */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl gold-text text-center mb-10">Line-Up</h2>
          <div className="flex items-center gap-2 mb-6 justify-center">
            <Music className="text-primary" size={24} />
            <h3 className="font-display text-xl text-foreground">DJs</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl mx-auto mb-12">
            {djs.map((dj, i) => (
              <motion.div key={dj.nom} className="bg-background rounded-xl border border-border overflow-hidden group"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="aspect-square overflow-hidden">
                  <img src={dj.photo} alt={dj.nom} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-3 text-center"><p className="font-display text-sm text-foreground">{dj.nom}</p></div>
              </motion.div>
            ))}
          </div>
          <div className="flex items-center gap-2 mb-6 justify-center">
            <Crown className="text-primary" size={24} />
            <h3 className="font-display text-xl text-foreground">Artistes</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {artists.map((a, i) => (
              <motion.div key={a.nom} className="bg-background rounded-xl border border-border overflow-hidden group text-center"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="aspect-[3/4] overflow-hidden">
                  <img src={a.photo} alt={a.nom} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <p className="font-display text-base text-foreground">{a.nom}</p>
                  <Star size={14} className="text-primary mx-auto mt-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 6. TÉMOIGNAGES ===== */}
      <section className="py-14 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl gold-text text-center mb-10">Ce Qu'ils Disent</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {temoignages.map((t, i) => (
              <motion.div key={i} className="bg-card rounded-xl border border-border p-6 relative"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Quote size={24} className="text-primary/30 absolute top-4 right-4" />
                <p className="text-muted-foreground text-sm italic leading-relaxed mb-4">"{t.texte}"</p>
                <p className="font-display text-foreground text-sm">{t.nom}</p>
                <p className="text-xs text-primary">{t.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 7. ACTUALITÉS ===== */}
      <section className="py-14 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl gold-text text-center mb-10">Actualités</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {actualites.map((a, i) => (
              <motion.div key={i} className="bg-background rounded-xl border border-border p-6"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="flex items-center gap-2 mb-3">
                  <Newspaper size={16} className="text-primary" />
                  <span className="text-xs text-muted-foreground">{a.date}</span>
                </div>
                <h3 className="font-display text-sm text-foreground mb-2">{a.titre}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{a.extrait}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 8. PARTENAIRES ===== */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 mb-8">
          <h2 className="font-display text-2xl gold-text text-center">Nos Partenaires</h2>
        </div>
        {loadingP && <SectionLoader />}
        {errorP   && <SectionError msg={errorP} />}
        {!loadingP && !errorP && partenaires.length > 0 && (
          <MarqueePartenaires partenaires={partenaires} />
        )}
        {!loadingP && !errorP && partenaires.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-4">Aucun partenaire disponible.</p>
        )}
        <div className="text-center mt-6">
          <Link to="/partenaires" className="text-primary text-sm font-medium hover:underline">
            Voir tous les partenaires →
          </Link>
        </div>
      </section>

      {/* ===== 9. CTA FINAL ===== */}
      <section className="py-16 bg-card text-center">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl gold-text mb-4">Prêt à Briller ?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Une seule mission : briller, vibrer et marquer l'histoire de l'ambiance à Dschang. 🌟
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <Link to="/candidats" className="flex items-center gap-2 gold-gradient text-primary-foreground px-6 py-3 rounded-lg font-semibold text-sm uppercase tracking-wider">
              <Users size={18} /> Voir les Candidats
            </Link>
            <Link to="/billetterie" className="flex items-center gap-2 border border-primary text-primary px-6 py-3 rounded-lg font-semibold text-sm uppercase tracking-wider hover:bg-primary/10 transition-colors">
              <Ticket size={18} /> Billetterie
            </Link>
            <Link to="/vote" className="flex items-center gap-2 border border-primary text-primary px-6 py-3 rounded-lg font-semibold text-sm uppercase tracking-wider hover:bg-primary/10 transition-colors">
              <Heart size={18} /> Voter
            </Link>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Suivez-nous sur les réseaux</p>
          <div className="flex justify-center gap-4">
            {([
              { icon: Facebook,  label: "Facebook"  },
              { icon: Instagram, label: "Instagram" },
              { icon: Twitter,   label: "Twitter"   },
              { icon: Phone,     label: "WhatsApp"  },
            ] as const).map(s => (
              <a key={s.label} href="#" aria-label={s.label}
                className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                <s.icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;