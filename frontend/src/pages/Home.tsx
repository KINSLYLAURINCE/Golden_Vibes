/**
 * Page d'accueil - Golden Vibes Events
 * -----------------------------------------
 * Toutes les sections : Hero, Présentation, Candidats (leaders seulement),
 * Événements annexes, Line-up (DJs + Artistes), Partenaires,
 * Témoignages, Actualités, CTA final.
 */

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Crown, Ticket, Users, Star, MapPin, Calendar, Music, Heart,
  ChevronRight, ChevronLeft, Clock, Eye, Quote, Newspaper,
  UserPlus, Handshake, Facebook, Instagram, Twitter, Phone, Play, Trophy
} from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import logo from "@/assets/logo-golden-vibes.png";
import Countdown from "@/components/Countdown";
import MarqueePartenaires from "@/components/MarqueePartenaires";

/* Photos DJs */
import djWilly from "@/assets/djs/dj-willy.jpg";
import djSlimboyz from "@/assets/djs/dj-slimboyz.jpg";
import djSeven from "@/assets/djs/dj-seven.jpg";
import djZidane from "@/assets/djs/dj-zidane.jpg";
import djNike from "@/assets/djs/dj-nike.jpg";

/* Photos Artistes */
import wizdomOg from "@/assets/artists/wizdom-og.jpg";
import karlixGyal from "@/assets/artists/karlix-gyal.jpg";
import artisteSurprise from "@/assets/artists/artiste-surprise.jpg";

/* ── Données mock candidats avec plusieurs photos ── */
const candidats = [
  { 
    id: 1, 
    nom: "Nguemo Tatiana", 
    numero: 1, 
    categorie: "miss", 
    votes: 1102, 
    age: 22, 
    ville: "Dschang", 
    talent: "Danse Contemporaine",
    description: "Danseuse passionnée depuis l'enfance, je veux représenter la grâce et l'élégance de la femme camerounaise.",
    photos: [
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop"
    ]
  },
  { 
    id: 2, 
    nom: "Kamga Brielle", 
    numero: 2, 
    categorie: "miss", 
    votes: 876, 
    age: 21, 
    ville: "Bafoussam", 
    talent: "Chant Gospel",
    description: "Artiste gospel avec une voix qui touche les cœurs. Je chante pour la paix et l'unité.",
    photos: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop"
    ]
  },
  { 
    id: 3, 
    nom: "Fotso Mireille", 
    numero: 3, 
    categorie: "miss", 
    votes: 954, 
    age: 23, 
    ville: "Douala", 
    talent: "Mode & Stylisme",
    description: "Créatrice de mode, passionnée par l'élégance et le design africain.",
    photos: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop"
    ]
  },
  { 
    id: 4, 
    nom: "Tchamba Kevin", 
    numero: 1, 
    categorie: "master", 
    votes: 982, 
    age: 24, 
    ville: "Yaoundé", 
    talent: "Poésie Slam",
    description: "Poète engagé, j'utilise les mots pour inspirer le changement et l'espoir.",
    photos: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=600&fit=crop"
    ]
  },
  { 
    id: 5, 
    nom: "Mbarga Yves", 
    numero: 2, 
    categorie: "master", 
    votes: 745, 
    age: 25, 
    ville: "Dschang", 
    talent: "Entrepreneuriat",
    description: "Jeune entrepreneur innovant dans la tech. Je crée des solutions pour l'éducation.",
    photos: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=600&fit=crop"
    ]
  },
  { 
    id: 6, 
    nom: "Djomo Patrick", 
    numero: 3, 
    categorie: "master", 
    votes: 820, 
    age: 23, 
    ville: "Bamenda", 
    talent: "Art Oratoire",
    description: "Orateur passionné, je crois en la puissance des mots pour changer le monde.",
    photos: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=600&fit=crop"
    ]
  },
];

/* ── DJs ── */
const djs = [
  { nom: "DJ Willy", photo: djWilly },
  { nom: "DJ Slimboyz", photo: djSlimboyz },
  { nom: "DJ Seven", photo: djSeven },
  { nom: "DJ Zidane", photo: djZidane },
  { nom: "DJ Nike La Légende", photo: djNike },
];

/* ── Artistes avec photos ── */
const artists = [
  { nom: "Wizdom OG", photo: wizdomOg },
  { nom: "Karlix Gyal", photo: karlixGyal },
  { nom: "Artiste Surprise", photo: artisteSurprise },
];

/* ── Événements annexes (aperçu) ── */
const evenementsPreview = [
  { id: 1, nom: "Pré-soirée Golden Vibes", date: "2026-04-05", heure: "20:00", lieu: "Mbouo Star Palace, Dschang", theme: "Black & Gold", description: "Soirée de lancement officielle de la semaine Golden Vibes. Ambiance chic et décontractée.", photos: ["https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=400&fit=crop"] },
  { id: 2, nom: "Séance photos candidat(e)s", date: "2026-04-08", heure: "10:00", lieu: "Studio First Class, Dschang", theme: "Élégance", description: "Shooting photo officiel des candidat(e)s. Ouvert au public pour encourager vos favoris.", photos: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=400&fit=crop"] },
  { id: 3, nom: "After Party Golden Vibes", date: "2026-04-12", heure: "22:00", lieu: "Mbouo Star Palace, Dschang", theme: "Celebration Night", description: "La fête continue ! After party exclusive pour célébrer les nouveaux Miss & Mister.", photos: ["https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop"] },
];

/* ── Témoignages ── */
const temoignages = [
  { nom: "Linda N.", texte: "Golden Vibes m'a donné confiance en moi. Une expérience inoubliable !", role: "Miss Golden Vibes 2025" },
  { nom: "Steve M.", texte: "L'ambiance, le professionnalisme… Dschang n'a jamais vu ça !", role: "Spectateur fidèle" },
  { nom: "Carole T.", texte: "Participer comme partenaire nous a ouvert des portes incroyables.", role: "Sponsor Or 2025" },
];

/* ── Actualités ── */
const actualites = [
  { titre: "Inscriptions ouvertes pour Miss & Mister 2026", date: "15 Jan 2026", extrait: "Les candidatures sont désormais ouvertes. Rejoignez l'aventure Golden Vibes !" },
  { titre: "Nouveau partenaire : KDM SONO rejoint la famille", date: "20 Fév 2026", extrait: "KDM SONO assurera la sonorisation professionnelle de la grande soirée." },
  { titre: "DJ Nike La Légende confirmé pour le 11 Avril", date: "01 Mars 2026", extrait: "Le légendaire DJ Nike sera aux platines pour une soirée explosive." },
];

const Home = () => {
  /* Trouver les leaders (premier de chaque catégorie par votes) */
  const missLeader = [...candidats]
    .filter(c => c.categorie === "miss")
    .sort((a, b) => b.votes - a.votes)[0];
  
  const masterLeader = [...candidats]
    .filter(c => c.categorie === "master")
    .sort((a, b) => b.votes - a.votes)[0];

  const leaders = [missLeader, masterLeader].filter(Boolean); // Filtrer les undefined

  /* Compteur votes total */
  const totalVotes = candidats.reduce((acc, c) => acc + c.votes, 0);

  return (
    <div>
      {/* ===== 1. HERO ===== */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/75" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.img src={logo} alt="Golden Vibes" className="w-28 h-28 mx-auto mb-6" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} />
          <motion.h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-4 drop-shadow-lg" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            Miss & Mister <span className="gold-text">Golden Vibes</span> 2026
          </motion.h1>
          <motion.p className="text-lg sm:text-2xl text-white font-semibold mb-2 drop-shadow-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            📍 Dschang · Mbouo Star Palace · 11 Avril 2026 · 18h
          </motion.p>
          <motion.p className="text-sm text-white/70 italic mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            "Brille, vibre et marque l'histoire de l'ambiance à Dschang"
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <Countdown targetDate="2026-04-11T18:00:00" />
          </motion.div>

          {/* Compteur de votes en temps réel */}
         

          {/* CTA principaux */}
          <motion.div className="flex flex-wrap justify-center gap-3 mt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
            <a 
              href="http://localhost:8080/vote?candidat=4" 
              className="gold-gradient text-primary-foreground px-6 py-3 rounded-lg font-semibold text-sm uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <Heart size={16} /> Voter Maintenant
            </a>
            <Link to="/billetterie" className="border border-primary text-primary px-6 py-3 rounded-lg font-semibold text-sm uppercase tracking-wider hover:bg-primary/10 transition-colors flex items-center gap-2">
              <Ticket size={16} /> Acheter un Billet
            </Link>
            <Link to="/contact" className="border border-white/30 text-white px-6 py-3 rounded-lg font-semibold text-sm uppercase tracking-wider hover:bg-white/10 transition-colors flex items-center gap-2">
              <UserPlus size={16} /> Devenir Candidat
            </Link>
            <Link to="/contact" className="border border-white/30 text-white px-6 py-3 rounded-lg font-semibold text-sm uppercase tracking-wider hover:bg-white/10 transition-colors flex items-center gap-2">
              <Handshake size={16} /> Devenir Partenaire
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===== 2. PRÉSENTATION ===== */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <motion.h2 className="font-display text-3xl gold-text mb-6" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            L'Événement Qui Fait Vibrer Dschang
          </motion.h2>
          <motion.p className="text-muted-foreground leading-relaxed text-base sm:text-lg mb-6" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <strong className="text-foreground">Golden Vibes Events</strong> est la plus grande soirée de gala, de mode et de talents de la ville de Dschang. 
            Chaque année, des candidat(e)s brillant(e)s rivalisent d'élégance, de charisme et de talent pour décrocher les titres convoités 
            de <span className="text-primary font-semibold">Miss</span> et <span className="text-primary font-semibold">Mister Golden Vibes</span>.
          </motion.p>
          <motion.p className="text-muted-foreground leading-relaxed text-base sm:text-lg" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            Au programme : défilé de mode, performances artistiques, DJs de renom et une ambiance 100% prestige. 
            Rejoignez-nous le <span className="text-primary font-semibold">11 Avril 2026</span> au <span className="text-primary font-semibold">Mbouo Star Palace</span> 
            pour une nuit inoubliable. 🌟
          </motion.p>
        </div>
      </section>

      {/* ===== 3. LEADERS (MISS et MASTER en tête) ===== */}
      <section className="py-12 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy size={24} className="text-gold" />
              <h2 className="font-display text-2xl sm:text-3xl gold-text">Les Leaders</h2>
              <Trophy size={24} className="text-gold" />
            </div>
            <p className="text-sm text-muted-foreground">Miss et Master en tête des votes</p>
          </div>

          {/* Desktop : 2 colonnes côte à côte */}
          <div className="hidden md:grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {leaders.map((c, i) => (
              <LeaderCard key={c.id} candidat={c} delay={i * 0.1} />
            ))}
          </div>

          {/* Mobile : 1 carte par ligne (pleine largeur) */}
          <div className="md:hidden space-y-6 max-w-sm mx-auto">
            {leaders.map((c, i) => (
              <LeaderCard key={c.id} candidat={c} delay={i * 0.1} />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/candidats" className="inline-flex items-center gap-1 text-primary text-sm font-medium hover:underline">
              Voir tous les candidats <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 4. ÉVÉNEMENTS ANNEXES ===== */}
      <section className="py-14 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl gold-text text-center mb-3">Événements Annexes</h2>
          <p className="text-center text-muted-foreground mb-10 text-sm">Toute la programmation autour de Golden Vibes 2026</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {evenementsPreview.map((ev, i) => (
              <motion.div
                key={ev.id}
                className="bg-card rounded-xl border border-border overflow-hidden group hover:border-primary/50 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {/* Photo événement */}
                <div className="aspect-video overflow-hidden">
                  <img src={ev.photos[0]} alt={ev.nom} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg text-foreground mb-2">{ev.nom}</h3>
                  <div className="space-y-1 text-xs text-muted-foreground mb-3">
                    <p className="flex items-center gap-1.5"><Calendar size={12} className="text-primary" /> {new Date(ev.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p>
                    <p className="flex items-center gap-1.5"><Clock size={12} className="text-primary" /> {ev.heure}</p>
                    <p className="flex items-center gap-1.5"><MapPin size={12} className="text-primary" /> {ev.lieu}</p>
                  </div>
                  <span className="inline-block text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full mb-3">{ev.theme}</span>
                  <p className="text-sm text-muted-foreground leading-relaxed">{ev.description}</p>
                  <Link to="/evenements" className="inline-flex items-center gap-1 text-primary text-xs font-medium mt-3 hover:underline">
                    En savoir plus <ChevronRight size={14} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/evenements" className="inline-flex items-center gap-1 text-primary text-sm font-medium hover:underline">
              Voir tous les événements <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 5. LINE-UP : DJs + Artistes ===== */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl gold-text text-center mb-10">Line-Up</h2>

          {/* DJs */}
          <div className="flex items-center gap-2 mb-6 justify-center">
            <Music className="text-primary" size={24} />
            <h3 className="font-display text-xl text-foreground">DJs</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl mx-auto mb-12">
            {djs.map((dj, i) => (
              <motion.div key={dj.nom} className="bg-background rounded-xl border border-border overflow-hidden group" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="aspect-square overflow-hidden">
                  <img src={dj.photo} alt={dj.nom} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-3 text-center">
                  <p className="font-display text-sm text-foreground">{dj.nom}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Artistes */}
          <div className="flex items-center gap-2 mb-6 justify-center">
            <Crown className="text-primary" size={24} />
            <h3 className="font-display text-xl text-foreground">Artistes</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {artists.map((a, i) => (
              <motion.div key={a.nom} className="bg-background rounded-xl border border-border overflow-hidden group text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
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
              <motion.div key={i} className="bg-card rounded-xl border border-border p-6 relative" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
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
              <motion.div key={i} className="bg-background rounded-xl border border-border p-6" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
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
        <div className="container mx-auto px-4">
          <h2 className="font-display text-2xl gold-text text-center mb-2">Nos Partenaires</h2>
          <MarqueePartenaires />
          <div className="text-center">
            <Link to="/partenaires" className="text-primary text-sm font-medium hover:underline">
              Voir tous les partenaires →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== 9. CTA FINAL + RÉSEAUX SOCIAUX ===== */}
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
            <a 
              href="http://localhost:8080/vote?candidat=4" 
              className="flex items-center gap-2 border border-primary text-primary px-6 py-3 rounded-lg font-semibold text-sm uppercase tracking-wider hover:bg-primary/10 transition-colors"
            >
              <Heart size={18} /> Voter
            </a>
          </div>

          {/* Réseaux sociaux */}
          <p className="text-sm text-muted-foreground mb-4">Suivez-nous sur les réseaux</p>
          <div className="flex justify-center gap-4">
            {[
              { icon: Facebook, label: "Facebook" },
              { icon: Instagram, label: "Instagram" },
              { icon: Twitter, label: "Twitter" },
              { icon: Phone, label: "WhatsApp" },
            ].map((s) => (
              <a key={s.label} href="#" className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors" aria-label={s.label}>
                <s.icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

/* ===== Composant Carte Leader (avec défilement d'images) ===== */
const LeaderCard = ({ candidat: c, delay }: { candidat: typeof candidats[0]; delay: number }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  const totalImages = c.photos.length;

  // Défilement automatique
  useEffect(() => {
    if (!isPaused && totalImages > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % totalImages);
      }, 3000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, totalImages]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  const handlePrev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? totalImages - 1 : prevIndex - 1
    );
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  };

  const handleNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => 
      (prevIndex + 1) % totalImages
    );
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  };

  return (
    <motion.div
      className="bg-card rounded-xl border-2 border-gold/30 overflow-hidden group hover:border-gold transition-all shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        {/* Badge Leader */}
        <div className="absolute top-2 left-2 z-20">
          <span className="bg-gold text-primary-foreground text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <Trophy size={12} /> LEADER {c.categorie === "miss" ? "MISS" : "MASTER"}
          </span>
        </div>

        {/* Images en défilement */}
        <div className="w-full h-full">
          {c.photos.map((photo, index) => (
            <img
              key={index}
              src={photo}
              alt={`${c.nom} - photo ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </div>

        {/* Indicateurs de position */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {c.photos.map((_, i) => (
            <button
              key={i}
              onClick={() => goToImage(i)}
              className={`transition-all ${
                i === currentImageIndex 
                  ? 'w-3 h-1.5 bg-gold rounded-full' 
                  : 'w-1.5 h-1.5 bg-white/70 rounded-full hover:bg-white'
              }`}
              aria-label={`Voir photo ${i + 1}`}
            />
          ))}
        </div>

        {/* Flèches de navigation */}
        {totalImages > 1 && (
          <>
            <button 
              onClick={handlePrev}
              className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-black/70"
            >
              <ChevronLeft size={14} className="text-white" />
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-black/70"
            >
              <ChevronRight size={14} className="text-white" />
            </button>
          </>
        )}

        {/* Badge votes */}
        <div className="absolute top-2 right-2 z-10">
          <span className="bg-background/80 backdrop-blur-sm text-foreground text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <Heart size={12} className="text-gold" /> {c.votes.toLocaleString()}
          </span>
        </div>

        {/* Indicateur de défilement automatique */}
        {totalImages > 1 && (
          <div className="absolute bottom-2 right-2 z-10 md:hidden">
            <span className="bg-black/50 text-white text-[8px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
              <Play size={8} className={isPaused ? "opacity-50" : "animate-pulse"} />
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-display text-xl text-foreground leading-tight">{c.nom}</h3>
            <p className="text-xs text-muted-foreground">{c.age} ans • {c.ville}</p>
          </div>
          <span className="text-sm font-bold text-gold">#{c.numero}</span>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{c.description}</p>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs bg-secondary text-foreground px-2 py-1 rounded-full">
            {c.talent}
          </span>
        </div>

        <div className="flex gap-2">
          <Link 
            to={`/candidats/${c.id}`} 
            className="flex-1 flex items-center justify-center gap-1 py-2 text-xs font-medium bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors"
          >
            <Eye size={14} /> Profil
          </Link>
          <a 
            href={`http://localhost:8080/vote?candidat=${c.id}`}
            className="flex-1 flex items-center justify-center gap-1 py-2 gold-gradient text-primary-foreground text-xs font-bold uppercase rounded-lg"
          >
            <Heart size={14} /> Voter
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default Home;