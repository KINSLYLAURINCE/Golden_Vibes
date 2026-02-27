/**
 * Détail d'un candidat (Page publique)
 * -----------------------------------------
 * Affiche les photos en carousel automatique, vidéo de présentation,
 * description, nombre de votes et bouton pour voter.
 */

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Crown, Heart, Play, User, MapPin, Calendar, Award } from "lucide-react";

/* Données simulées */
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
    description: "Étudiante en droit, passionnée par la défense des droits des femmes et l'éducation des jeunes filles. Je milite pour l'émancipation féminine à travers l'art et la culture.",
    photos: [
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop"
    ],
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ"
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
    description: "Artiste gospel avec une voix puissante qui touche les cœurs. Je chante pour la paix et l'unité depuis mon plus jeune âge.",
    photos: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop"
    ],
    video: ""
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
    description: "Créatrice de mode, passionnée par l'élégance et le design. Je crée des vêtements qui racontent des histoires et célèbrent la culture africaine.",
    photos: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop"
    ],
    video: ""
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
    description: "Poète engagé qui utilise les mots pour inspirer le changement. Mes textes parlent de justice sociale, d'espoir et de résilience.",
    photos: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=800&fit=crop"
    ],
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ"
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
    description: "Jeune entrepreneur innovant dans le domaine de la tech. Je développe des solutions digitales pour faciliter l'accès à l'éducation.",
    photos: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1463453091185-61582044d556?w=600&h=800&fit=crop"
    ],
    video: ""
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
    description: "Poétesse qui capture la beauté de la vie à travers ses vers. Je crois en la puissance des mots pour guérir et inspirer.",
    photos: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=800&fit=crop"
    ],
    video: ""
  },
];

const CandidatDetail = () => {
  const { id } = useParams();
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const candidat = mockCandidats.find((c) => c.id === Number(id));

  useEffect(() => {
    if (!candidat) return;
    
    let interval;
    if (!isPaused && candidat.photos.length > 1) {
      interval = setInterval(() => {
        setPhotoIndex((prevIndex) => (prevIndex + 1) % candidat.photos.length);
      }, 4000); // Change toutes les 4 secondes
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPaused, candidat]);

  if (!candidat) {
    return (
      <div className="py-20 bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl text-foreground mb-4">Candidat introuvable</h2>
          <Link to="/candidats" className="text-primary hover:underline">← Retour aux candidats</Link>
        </div>
      </div>
    );
  }

  const photoPrecedente = () => {
    setPhotoIndex((i) => (i === 0 ? candidat.photos.length - 1 : i - 1));
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 8000);
  };

  const photoSuivante = () => {
    setPhotoIndex((i) => (i === candidat.photos.length - 1 ? 0 : i + 1));
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 8000);
  };

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  return (
    <div className="py-12 bg-background min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link to="/candidats" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm transition-colors">
          <ArrowLeft size={16} /> Retour aux candidats
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Carousel de photos avec défilement automatique */}
          <motion.div
            className="relative aspect-[3/4] rounded-xl overflow-hidden border border-border shadow-xl group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Images en défilement */}
            <div className="w-full h-full">
              {candidat.photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`${candidat.nom} - photo ${index + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                    index === photoIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
            </div>

            {/* Indicateurs de position */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {candidat.photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPhotoIndex(i);
                    setIsPaused(true);
                    setTimeout(() => setIsPaused(false), 8000);
                  }}
                  className={`transition-all ${
                    i === photoIndex 
                      ? 'w-4 h-2 bg-gold rounded-full' 
                      : 'w-2 h-2 bg-white/70 rounded-full hover:bg-white'
                  }`}
                  aria-label={`Voir photo ${i + 1}`}
                />
              ))}
            </div>

            {/* Flèches de navigation */}
            {candidat.photos.length > 1 && (
              <>
                <button 
                  onClick={photoPrecedente}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-black/70"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={photoSuivante}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-black/70"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Badge catégorie */}
            <div className="absolute top-4 left-4 gold-gradient text-primary-foreground px-4 py-2 rounded-full text-sm font-bold uppercase shadow-lg z-10">
              {candidat.categorie === "miss" ? "MISS" : "MASTER"} N°{candidat.numero}
            </div>

            {/* Indicateur de défilement automatique */}
            {candidat.photos.length > 1 && (
              <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 z-10">
                <Play size={12} className={isPaused ? "opacity-50" : "animate-pulse"} />
                <span>{isPaused ? "Pause" : "Auto"}</span>
              </div>
            )}
          </motion.div>

          {/* Infos et description */}
          <motion.div 
            className="flex flex-col justify-center space-y-6"
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
          >
            <div>
              <span className="inline-block text-xs uppercase tracking-wider text-primary mb-2 bg-primary/10 px-3 py-1 rounded-full">
                {candidat.categorie === "miss" ? "Miss Golden Vibes" : "Master Golden Vibes"}
              </span>
              <h1 className="font-display text-4xl sm:text-5xl text-foreground mb-2">{candidat.nom}</h1>
              
              {/* Informations clés */}
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User size={16} className="text-primary" />
                  <span className="text-sm">{candidat.age} ans</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin size={16} className="text-primary" />
                  <span className="text-sm">{candidat.ville}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Award size={16} className="text-primary" />
                  <span className="text-sm">#{candidat.numero}</span>
                </div>
              </div>
            </div>

            {/* Talent */}
            <div className="bg-secondary/50 border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Crown size={18} className="text-gold" />
                <span className="text-sm font-semibold uppercase tracking-wider text-foreground">Talent</span>
              </div>
              <p className="text-lg text-primary font-bold">{candidat.talent}</p>
            </div>

            {/* Description */}
            {candidat.description && (
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-display text-lg text-foreground mb-3">À propos</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {candidat.description}
                </p>
              </div>
            )}

            {/* Votes */}
            <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Heart size={24} className="text-gold fill-gold" />
                  <span className="text-sm text-muted-foreground">Votes</span>
                </div>
                <span className="text-sm text-primary font-semibold">{candidat.votes.toLocaleString()} votes</span>
              </div>
              <p className="text-5xl font-bold text-primary font-display mb-2">{candidat.votes.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">
                <span className="text-gold font-bold">{(candidat.votes * 100).toLocaleString()} FCFA</span> collectés
              </p>
            </div>

            {/* Bouton de vote */}
            <Link
              to={`/vote?candidat=${candidat.id}`}
              className="gold-gradient text-primary-foreground py-4 rounded-xl font-semibold text-center uppercase tracking-wider flex items-center justify-center gap-2 text-lg hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl"
            >
              <Heart size={22} /> Voter pour {candidat.nom.split(" ")[0]}
            </Link>
            <p className="text-xs text-muted-foreground text-center">1 vote = 100 FCFA · Votes illimités</p>
          </motion.div>
        </div>

        {/* Vidéo de présentation */}
        {candidat.video && (
          <motion.div 
            className="mt-12" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Play size={20} className="text-primary" />
              </div>
              <h2 className="font-display text-2xl text-foreground">Vidéo de présentation</h2>
            </div>
            <div className="aspect-video rounded-xl overflow-hidden border border-border bg-card shadow-xl">
              <iframe 
                src={candidat.video} 
                className="w-full h-full" 
                allowFullScreen 
                title={`Vidéo de présentation - ${candidat.nom}`}
                loading="lazy"
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CandidatDetail;