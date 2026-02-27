/**
 * Page Candidats (publique)
 * -----------------------------------------
 * Grille de candidats style référence (dark card).
 * Filtre miss/master, recherche, tri.
 * Bouton "Voir" → page détail (2 images + vidéo).
 * Mobile : grille avec défilement automatique des images par carte.
 */

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Crown, Eye, Heart, ChevronLeft, ChevronRight, Play } from "lucide-react";

const mockCandidats = [
  { 
    id: 1, 
    nom: "Amanda K.", 
    numero: 1, 
    categorie: "miss", 
    votes: 1245, 
    age: 22, 
    ville: "Douala", 
    talent: "CHANT LYRIQUE",
    description: "Étudiante en droit, passionnée par la défense des droits des femmes et l'éducation des jeunes filles.",
    photos: [
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop"
    ],
    video: "https://example.com/video1.mp4"
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
    description: "Artiste gospel avec une voix puissante qui touche les cœurs.",
    photos: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop"
    ],
    video: "https://example.com/video2.mp4"
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
    description: "Créatrice de mode, passionnée par l'élégance et le design.",
    photos: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop"
    ],
    video: "https://example.com/video3.mp4"
  },
  { 
    id: 4, 
    nom: "Tchamba Kevin", 
    numero: 1, 
    categorie: "master", 
    votes: 843, 
    age: 24, 
    ville: "Yaoundé", 
    talent: "Poésie Slam",
    description: "Poète engagé qui utilise les mots pour inspirer le changement.",
    photos: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=600&fit=crop"
    ],
    video: "https://example.com/video4.mp4"
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
    description: "Jeune entrepreneur innovant dans le domaine de la tech.",
    photos: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=600&fit=crop"
    ],
    video: "https://example.com/video5.mp4"
  },
  { 
    id: 6, 
    nom: "Nkwenti Divine", 
    numero: 4, 
    categorie: "miss", 
    votes: 698, 
    age: 20, 
    ville: "Bamenda", 
    talent: "Poésie",
    description: "Poétesse qui capture la beauté de la vie à travers ses vers.",
    photos: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop"
    ],
    video: "https://example.com/video6.mp4"
  },
];

const Candidats = () => {
  const [filter, setFilter] = useState("tous");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("votes");

  const filtered = mockCandidats
    .filter((c) => filter === "tous" || c.categorie === filter)
    .filter((c) => c.nom.toLowerCase().includes(search.toLowerCase()) || String(c.numero).includes(search))
    .sort((a, b) => sortBy === "votes" ? b.votes - a.votes : sortBy === "numero" ? a.numero - b.numero : a.nom.localeCompare(b.nom));

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
              onClick={() => setFilter(f)}
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

        {/* Grille responsive : 2 colonnes sur mobile, 3-4 sur desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((c, i) => (
            <CandidatCard 
              key={c.id} 
              candidat={c} 
              delay={i * 0.05} 
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-10">Aucun candidat trouvé.</p>
        )}
      </div>
    </div>
  );
};

/* ===== Card Candidat avec défilement automatique des images ===== */
const CandidatCard = ({ candidat: c, delay }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  const totalImages = c.photos.length;

  // Défilement automatique
  useEffect(() => {
    if (!isPaused && totalImages > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % totalImages);
      }, 3000); // Change toutes les 3 secondes
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, totalImages]);

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const handlePrev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? totalImages - 1 : prevIndex - 1
    );
    setIsPaused(true); // Pause au survol
    setTimeout(() => setIsPaused(false), 5000); // Reprend après 5s
  };

  const handleNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => 
      (prevIndex + 1) % totalImages
    );
    setIsPaused(true); // Pause au survol
    setTimeout(() => setIsPaused(false), 5000); // Reprend après 5s
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 5000);
  };

  return (
    <motion.div
      className="bg-card rounded-xl border border-border overflow-hidden group hover:border-primary/50 transition-all"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
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

        {/* Badge catégorie */}
        <div className="absolute top-2 left-2 z-10">
          <span className="gold-gradient text-primary-foreground text-[10px] md:text-xs font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full uppercase flex items-center gap-1">
            <Crown size={10} className="md:w-3 md:h-3" /> {c.categorie === "miss" ? "MISS" : "MASTER"}
          </span>
        </div>

        {/* Badge votes */}
        <div className="absolute top-2 right-2 z-10">
          <span className="bg-background/80 backdrop-blur-sm text-foreground text-[10px] md:text-xs font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full flex items-center gap-1">
            <Heart size={10} className="text-gold md:w-3 md:h-3" /> {c.votes.toLocaleString()}
          </span>
        </div>

        {/* Indicateur de vidéo */}
        {c.video && (
          <div className="absolute bottom-2 right-2 z-10">
            <span className="bg-black/50 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1">
              <Play size={10} /> Vidéo
            </span>
          </div>
        )}
      </div>
      
      <div className="p-2 md:p-4">
        <div className="flex justify-between items-start mb-1">
          <div>
            <h3 className="font-display text-sm md:text-lg text-foreground leading-tight">{c.nom}</h3>
            <p className="text-[10px] md:text-xs text-muted-foreground">{c.age} ans • {c.ville}</p>
          </div>
          <span className="text-[10px] md:text-xs font-bold text-gold">#{c.numero}</span>
        </div>
        
        <p className="text-[10px] md:text-xs text-muted-foreground mb-2 line-clamp-2">{c.description}</p>
        
        <div className="flex items-center gap-1 mb-2">
          <span className="text-[8px] md:text-xs bg-secondary text-foreground px-1.5 md:px-2 py-0.5 rounded whitespace-nowrap overflow-hidden text-ellipsis">
            {c.talent}
          </span>
        </div>
      </div>
      
      <div className="flex border-t border-border">
        <Link
          to={`/candidats/${c.id}`}
          className="flex-1 flex items-center justify-center gap-1 py-2 md:py-3 text-[10px] md:text-xs font-medium text-muted-foreground hover:text-foreground transition-colors border-r border-border"
        >
          <Eye size={12} className="md:w-4 md:h-4" /> Profil
        </Link>
        <Link
          to={`/vote?candidat=${c.id}`}
          className="flex-1 flex items-center justify-center gap-1 py-2 md:py-3 gold-gradient text-primary-foreground text-[10px] md:text-xs font-bold uppercase tracking-wider"
        >
          <Heart size={12} className="md:w-4 md:h-4" /> Voter
        </Link>
      </div>
    </motion.div>
  );
};

export default Candidats;