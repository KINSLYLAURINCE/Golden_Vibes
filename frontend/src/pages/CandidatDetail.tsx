/**
 * Détail d'un candidat (Page publique)
 * -----------------------------------------
 * Affiche 2 photos en carousel, vidéo de présentation,
 * nombre de votes et bouton pour voter.
 */

import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Crown, Heart, Play } from "lucide-react";

/* Données simulées */
const mockCandidats = [
  { id: 1, nom: "Nguemo Tatiana", numero: 1, categorie: "miss", votes: 1102, age: 22, ville: "Dschang", talent: "Danse Contemporaine", photos: ["https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=800&fit=crop", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop"], video: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: 2, nom: "Kamga Brielle", numero: 2, categorie: "miss", votes: 876, age: 21, ville: "Bafoussam", talent: "Chant Gospel", photos: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop"], video: "" },
  { id: 3, nom: "Fotso Mireille", numero: 3, categorie: "miss", votes: 954, age: 23, ville: "Douala", talent: "Mode & Stylisme", photos: ["https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop", "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop"], video: "" },
  { id: 4, nom: "Tchamba Kevin", numero: 1, categorie: "master", votes: 982, age: 24, ville: "Yaoundé", talent: "Poésie Slam", photos: ["https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=800&fit=crop", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop"], video: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: 5, nom: "Mbarga Yves", numero: 2, categorie: "master", votes: 745, age: 25, ville: "Dschang", talent: "Entrepreneuriat", photos: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop"], video: "" },
  { id: 6, nom: "Nkwenti Divine", numero: 4, categorie: "miss", votes: 698, age: 20, ville: "Bamenda", talent: "Poésie", photos: ["https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop", "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=800&fit=crop"], video: "" },
  { id: 7, nom: "Djomo Patrick", numero: 3, categorie: "master", votes: 820, age: 23, ville: "Bamenda", talent: "Art Oratoire", photos: ["https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop", "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=800&fit=crop"], video: "" },
  { id: 8, nom: "Teguia Ornella", numero: 5, categorie: "miss", votes: 567, age: 22, ville: "Dschang", talent: "Danse Urbaine", photos: ["https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=800&fit=crop", "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=800&fit=crop"], video: "" },
];

const CandidatDetail = () => {
  const { id } = useParams();
  const [photoIndex, setPhotoIndex] = useState(0);

  const candidat = mockCandidats.find((c) => c.id === Number(id));

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

  const photoPrecedente = () => setPhotoIndex((i) => (i === 0 ? candidat.photos.length - 1 : i - 1));
  const photoSuivante = () => setPhotoIndex((i) => (i === candidat.photos.length - 1 ? 0 : i + 1));

  return (
    <div className="py-12 bg-background min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/candidats" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm">
          <ArrowLeft size={16} /> Retour aux candidats
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Carousel de photos */}
          <motion.div
            className="relative aspect-[3/4] rounded-xl overflow-hidden border border-border"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <img src={candidat.photos[photoIndex]} alt={candidat.nom} className="w-full h-full object-cover" />
            {candidat.photos.length > 1 && (
              <>
                <button onClick={photoPrecedente} className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/60 rounded-full flex items-center justify-center text-foreground hover:bg-background/80">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={photoSuivante} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/60 rounded-full flex items-center justify-center text-foreground hover:bg-background/80">
                  <ChevronRight size={20} />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {candidat.photos.map((_, i) => (
                    <button key={i} onClick={() => setPhotoIndex(i)} className={`w-2.5 h-2.5 rounded-full transition-colors ${i === photoIndex ? "bg-primary" : "bg-foreground/40"}`} />
                  ))}
                </div>
              </>
            )}
            <div className="absolute top-4 left-4 gold-gradient text-primary-foreground px-3 py-1 rounded-full text-sm font-bold uppercase">
              {candidat.categorie} N°{candidat.numero}
            </div>
          </motion.div>

          {/* Infos */}
          <motion.div className="flex flex-col justify-center" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <span className="text-xs uppercase tracking-wider text-primary mb-2">{candidat.categorie}</span>
            <h1 className="font-display text-3xl sm:text-4xl text-foreground mb-1">{candidat.nom}</h1>
            <p className="text-sm text-muted-foreground mb-1">{candidat.age} ans • {candidat.ville}</p>
            <p className="text-sm text-primary font-bold uppercase tracking-wider mb-4">Talent: {candidat.talent}</p>

            <div className="bg-card border border-border rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-2">
                <Crown size={24} className="text-primary" />
                <span className="text-sm text-muted-foreground">Nombre de votes</span>
              </div>
              <p className="text-4xl font-bold text-primary font-display">{candidat.votes.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">{(candidat.votes * 100).toLocaleString()} FCFA collectés</p>
            </div>

            <Link
              to={`/vote?candidat=${candidat.id}`}
              className="gold-gradient text-primary-foreground py-4 rounded-xl font-semibold text-center uppercase tracking-wider flex items-center justify-center gap-2 text-lg hover:opacity-90 transition-opacity"
            >
              <Heart size={22} /> Voter pour {candidat.nom.split(" ")[0]}
            </Link>
            <p className="text-xs text-muted-foreground text-center mt-3">1 vote = 100 FCFA · Votes illimités</p>
          </motion.div>
        </div>

        {/* Vidéo de présentation */}
        {candidat.video && (
          <motion.div className="mt-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="flex items-center gap-2 mb-4">
              <Play size={20} className="text-primary" />
              <h2 className="font-display text-xl text-foreground">Vidéo de présentation</h2>
            </div>
            <div className="aspect-video rounded-xl overflow-hidden border border-border bg-card">
              <iframe src={candidat.video} className="w-full h-full" allowFullScreen title={`Vidéo ${candidat.nom}`} />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CandidatDetail;
