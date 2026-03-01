/**
 * Détail d'un candidat (Page publique)
 * -----------------------------------------
 * Affiche les photos en carousel automatique, vidéo de présentation,
 * description, nombre de votes et bouton pour voter.
 */

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Crown, Heart, Play, Award, Loader2 } from "lucide-react";
import axios from "axios";

const API_URL = "http://localhost:1002/api";
const STORAGE_URL = "http://localhost:1002/storage";

const getPhotoUrl = (photo) => {
  if (!photo) return null;
  if (photo.startsWith("http")) return photo;
  return `${STORAGE_URL}/${photo}`;
};

/* Convertir lien YouTube/Facebook en embed */
const getEmbedUrl = (url) => {
  if (!url) return null;

  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([^&?/]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

  // Facebook
  if (url.includes("facebook.com")) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`;
  }

  return url;
};

const CandidatDetail = () => {
  const { id } = useParams();
  const [candidat, setCandidat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  /* Charger le candidat */
  useEffect(() => {
    const fetchCandidat = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/candidats/${id}`);
        const data = response.data.data || response.data;
        if (!data || !data.id) {
          setNotFound(true);
        } else {
          setCandidat(data);
        }
      } catch (err) {
        console.error("Erreur chargement candidat:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidat();
  }, [id]);

  /* Construction des photos */
  const photos = candidat
    ? [candidat.photo1, candidat.photo2].filter(Boolean).map(getPhotoUrl)
    : [];

  /* Défilement automatique */
  useEffect(() => {
    if (!candidat || isPaused || photos.length <= 1) return;
    const interval = setInterval(() => {
      setPhotoIndex((prev) => (prev + 1) % photos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, photos.length, candidat]);

  /* Chargement */
  if (loading) {
    return (
      <div className="py-20 bg-background min-h-screen flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-primary" />
      </div>
    );
  }

  /* Introuvable */
  if (notFound || !candidat) {
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
    setPhotoIndex((i) => (i === 0 ? photos.length - 1 : i - 1));
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 8000);
  };

  const photoSuivante = () => {
    setPhotoIndex((i) => (i === photos.length - 1 ? 0 : i + 1));
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 8000);
  };

  const embedUrl = getEmbedUrl(candidat.video);

  return (
    <div className="py-12 bg-background min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link
          to="/candidats"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm transition-colors"
        >
          <ArrowLeft size={16} /> Retour aux candidats
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Carousel de photos */}
          <motion.div
            className="relative aspect-[3/4] rounded-xl overflow-hidden border border-border shadow-xl group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {photos.length > 0 ? (
              photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`${candidat.nom} - photo ${index + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                    index === photoIndex ? "opacity-100" : "opacity-0"
                  }`}
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              ))
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-secondary text-muted-foreground text-sm">
                Aucune photo disponible
              </div>
            )}

            {/* Indicateurs */}
            {photos.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {photos.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setPhotoIndex(i);
                      setIsPaused(true);
                      setTimeout(() => setIsPaused(false), 8000);
                    }}
                    className={`transition-all ${
                      i === photoIndex
                        ? "w-4 h-2 bg-yellow-400 rounded-full"
                        : "w-2 h-2 bg-white/70 rounded-full hover:bg-white"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Flèches */}
            {photos.length > 1 && (
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

            {/* Auto indicator */}
            {photos.length > 1 && (
              <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 z-10">
                <Play size={12} className={isPaused ? "opacity-50" : "animate-pulse"} />
                <span>{isPaused ? "Pause" : "Auto"}</span>
              </div>
            )}
          </motion.div>

          {/* Infos */}
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

              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Award size={16} className="text-primary" />
                  <span className="text-sm">N°{candidat.numero}</span>
                </div>
              </div>
            </div>

            {/* Catégorie badge */}
            <div className="bg-secondary/50 border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Crown size={18} className="text-yellow-400" />
                <span className="text-sm font-semibold uppercase tracking-wider text-foreground">Catégorie</span>
              </div>
              <p className="text-lg text-primary font-bold uppercase">
                {candidat.categorie === "miss" ? "Miss Golden Vibes" : "Master Golden Vibes"}
              </p>
            </div>

            {/* Votes */}
            <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Heart size={24} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-sm text-muted-foreground">Votes</span>
                </div>
                <span className="text-sm text-primary font-semibold">
                  {Number(candidat.votes_count ?? 0).toLocaleString()} votes
                </span>
              </div>
              <p className="text-5xl font-bold text-primary font-display mb-2">
                {Number(candidat.votes_count ?? 0).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                
              </p>
            </div>

            {/* Bouton vote */}
            <Link
              to={`/vote?candidat=${candidat.id}`}
              className="gold-gradient text-primary-foreground py-4 rounded-xl font-semibold text-center uppercase tracking-wider flex items-center justify-center gap-2 text-lg hover:opacity-90 transition-opacity shadow-lg"
            >
              <Heart size={22} /> Voter pour {candidat.nom.split(" ")[0]}
            </Link>
            <p className="text-xs text-muted-foreground text-center">1 vote = 100 FCFA · Votes illimités</p>
          </motion.div>
        </div>

        {/* Vidéo de présentation */}
        {embedUrl && (
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
                src={embedUrl}
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