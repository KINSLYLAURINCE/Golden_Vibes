/**
 * Page Candidats (publique)
 * -----------------------------------------
 * Grille de candidats style référence (dark card).
 * Filtre miss/master, recherche, tri.
 * Bouton "Voir" → page détail (2 images + vidéo).
 * Mobile : une seule card à la fois.
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Crown, Eye, Heart, ChevronLeft, ChevronRight } from "lucide-react";

const mockCandidats = [
  { id: 1, nom: "Nguemo Tatiana", numero: 1, categorie: "miss", votes: 1102, age: 22, ville: "Dschang", talent: "Danse Contemporaine", photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop" },
  { id: 2, nom: "Kamga Brielle", numero: 2, categorie: "miss", votes: 876, age: 21, ville: "Bafoussam", talent: "Chant Gospel", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop" },
  { id: 3, nom: "Fotso Mireille", numero: 3, categorie: "miss", votes: 954, age: 23, ville: "Douala", talent: "Mode & Stylisme", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop" },
  { id: 4, nom: "Tchamba Kevin", numero: 1, categorie: "master", votes: 982, age: 24, ville: "Yaoundé", talent: "Poésie Slam", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop" },
  { id: 5, nom: "Mbarga Yves", numero: 2, categorie: "master", votes: 745, age: 25, ville: "Dschang", talent: "Entrepreneuriat", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop" },
  { id: 6, nom: "Nkwenti Divine", numero: 4, categorie: "miss", votes: 698, age: 20, ville: "Bamenda", talent: "Poésie", photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop" },
  { id: 7, nom: "Djomo Patrick", numero: 3, categorie: "master", votes: 820, age: 23, ville: "Bamenda", talent: "Art Oratoire", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop" },
  { id: 8, nom: "Teguia Ornella", numero: 5, categorie: "miss", votes: 567, age: 22, ville: "Dschang", talent: "Danse Urbaine", photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop" },
];

const Candidats = () => {
  const [filter, setFilter] = useState("tous");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("votes");
  const [mobileIndex, setMobileIndex] = useState(0);

  const filtered = mockCandidats
    .filter((c) => filter === "tous" || c.categorie === filter)
    .filter((c) => c.nom.toLowerCase().includes(search.toLowerCase()) || String(c.numero).includes(search))
    .sort((a, b) => sortBy === "votes" ? b.votes - a.votes : sortBy === "numero" ? a.numero - b.numero : a.nom.localeCompare(b.nom));

  const changeFilter = (f) => { setFilter(f); setMobileIndex(0); };
  const mobilePrev = () => setMobileIndex((i) => (i === 0 ? filtered.length - 1 : i - 1));
  const mobileNext = () => setMobileIndex((i) => (i === filtered.length - 1 ? 0 : i + 1));

  return (
    <div className="py-12 bg-background min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-4xl gold-text text-center mb-2">Nos Candidats</h1>
        <p className="text-center text-muted-foreground mb-8">Soutenez vos favoris · Miss & Mister Golden Vibes 2026</p>

        {/* Filtres */}
        <div className="flex flex-wrap gap-3 items-center justify-center mb-6">
          {["tous", "miss", "master"].map((f) => (
            <button
              key={f}
              onClick={() => changeFilter(f)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                filter === f ? "gold-gradient text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              {f === "tous" ? "TOUS" : f === "miss" ? "MISS" : "MASTER"}
            </button>
          ))}
        </div>

        {/* Recherche + tri */}
        <div className="flex flex-wrap gap-3 items-center justify-center mb-8">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="votes">Par votes</option>
            <option value="numero">Par numéro</option>
            <option value="nom">Par nom</option>
          </select>
        </div>

        {/* Desktop : grille */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((c, i) => (
            <CandidatCard key={c.id} candidat={c} delay={i * 0.05} />
          ))}
        </div>

        {/* Mobile : une card à la fois */}
        <div className="md:hidden">
          {filtered.length > 0 && (
            <div className="max-w-sm mx-auto">
              <CandidatCard candidat={filtered[mobileIndex % filtered.length]} delay={0} />
              <div className="flex items-center justify-between mt-4">
                <button onClick={mobilePrev} className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center text-foreground">
                  <ChevronLeft size={20} />
                </button>
                <span className="text-xs text-muted-foreground">
                  {(mobileIndex % filtered.length) + 1} / {filtered.length}
                </span>
                <button onClick={mobileNext} className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center text-foreground">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-10">Aucun candidat trouvé.</p>
        )}
      </div>
    </div>
  );
};

/* ===== Card Candidat (style référence image) ===== */
const CandidatCard = ({ candidat: c, delay }) => (
  <motion.div
    className="bg-card rounded-xl border border-border overflow-hidden group hover:border-primary/50 transition-all"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
  >
    <div className="relative aspect-[3/4] overflow-hidden">
      <img src={c.photo} alt={c.nom} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute top-3 left-3">
        <span className="gold-gradient text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase">{c.categorie}</span>
      </div>
      <div className="absolute top-3 right-3">
        <span className="bg-background/80 backdrop-blur-sm text-foreground text-xs font-bold px-3 py-1 rounded-full">{c.votes.toLocaleString()} VOTES</span>
      </div>
    </div>
    <div className="p-4">
      <h3 className="font-display text-lg text-foreground mb-1">{c.nom}</h3>
      <p className="text-xs text-muted-foreground mb-2">{c.age} ans • {c.ville}</p>
      <p className="text-xs text-primary font-bold uppercase tracking-wider">Talent: {c.talent}</p>
    </div>
    <div className="flex border-t border-border">
      <Link
        to={`/candidats/${c.id}`}
        className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors border-r border-border"
      >
        <Eye size={14} /> Voir
      </Link>
      <Link
        to={`/vote?candidat=${c.id}`}
        className="flex-1 flex items-center justify-center gap-1.5 py-3 gold-gradient text-primary-foreground text-xs font-bold uppercase tracking-wider"
      >
        <Heart size={14} /> Voter
      </Link>
    </div>
  </motion.div>
);

export default Candidats;
