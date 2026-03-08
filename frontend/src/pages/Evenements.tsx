/**
 * Page Événements annexes - Golden Vibes Events
 * -----------------------------------------
 * Affiche la liste des événements depuis l'API.
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Star, X, ChevronLeft, ChevronRight, Image, Loader2 } from "lucide-react";
import axios from "axios";


import { API_URL, getImageUrl } from "@/services/api";

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });
};

interface Evenement {
  id: number;
  nom: string;
  date: string;
  heure?: string;
  lieu?: string;
  ville?: string;
  theme?: string;
  description?: string;
  statut?: string;
  photos: string[];
}

const Evenements = () => {
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Evenement | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    const fetchEvenements = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/evenements`);
        const data = response.data.data || response.data;

        // Construire les URLs des photos avec getImageUrl
        const formatted = data.map((ev: any) => ({
          ...ev,
          photos: (ev.photos || [])
            .map((p: any) =>
              typeof p === "string" ? getImageUrl(p) : getImageUrl(p?.photo)
            )
            .filter(Boolean),
        }));

        setEvenements(formatted);
      } catch (err) {
        console.error("Erreur chargement événements:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvenements();
  }, []);

  const openGallery = (event: Evenement, photoIndex = 0) => {
    setSelectedEvent(event);
    setCurrentPhotoIndex(photoIndex);
  };

  const closeGallery = () => {
    setSelectedEvent(null);
    setCurrentPhotoIndex(0);
  };

  const nextPhoto = () => {
    if (selectedEvent) {
      setCurrentPhotoIndex((prev) =>
        prev === selectedEvent.photos.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevPhoto = () => {
    if (selectedEvent) {
      setCurrentPhotoIndex((prev) =>
        prev === 0 ? selectedEvent.photos.length - 1 : prev - 1
      );
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!selectedEvent) return;
      if (e.key === "ArrowRight") nextPhoto();
      if (e.key === "ArrowLeft") prevPhoto();
      if (e.key === "Escape") closeGallery();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedEvent, currentPhotoIndex]);

  return (
    <div className="py-12 bg-background min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-4xl gold-text text-center mb-2">Événements</h1>
        <p className="text-center text-muted-foreground mb-12">
          Tous les événements autour de Golden Vibes 2026
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={40} className="animate-spin text-primary" />
          </div>
        ) : evenements.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            Aucun événement disponible pour le moment.
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-8">
            {evenements.map((ev, i) => (
              <motion.div
                key={ev.id}
                className="bg-card rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-all"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {/* Image principale */}
                {ev.photos.length > 0 && (
                  <div
                    className="relative h-48 sm:h-56 overflow-hidden cursor-pointer group"
                    onClick={() => openGallery(ev, 0)}
                  >
                    <img
                      src={ev.photos[0]}
                      alt={ev.nom}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e: any) => { e.target.style.display = "none"; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm">
                      <Image size={14} />
                      <span>{ev.photos.length} photo{ev.photos.length > 1 ? "s" : ""}</span>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="bg-primary/80 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium backdrop-blur-sm">
                        Voir les photos
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    {/* Date badge */}
                    <div className="flex-shrink-0 w-16 h-16 gold-gradient rounded-xl flex flex-col items-center justify-center text-primary-foreground">
                      <span className="text-xl font-bold font-display">
                        {new Date(ev.date).getDate()}
                      </span>
                      <span className="text-[10px] uppercase font-semibold">
                        {new Date(ev.date).toLocaleDateString("fr-FR", { month: "short" })}
                      </span>
                    </div>

                    {/* Contenu */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-display text-xl text-foreground">{ev.nom}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                          ev.statut === "a_venir"
                            ? "bg-blue-500/20 text-blue-400"
                            : ev.statut === "en_cours"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {ev.statut === "a_venir" ? "À venir" : ev.statut === "en_cours" ? "En cours" : "Terminé"}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-primary" /> {formatDate(ev.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} className="text-primary" /> {ev.heure?.slice(0, 5) || "—"}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={12} className="text-primary" />
                          {ev.ville ? `${ev.lieu}, ${ev.ville}` : ev.lieu}
                        </span>
                      </div>

                      {ev.theme && (
                        <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full mb-3">
                          <Star size={10} /> {ev.theme}
                        </span>
                      )}

                      {ev.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed">{ev.description}</p>
                      )}

                      {/* Mini galerie */}
                      {ev.photos.length > 1 && (
                        <div className="flex gap-2 mt-4">
                          {ev.photos.slice(1, 4).map((photo, idx) => (
                            <button
                              key={idx}
                              onClick={() => openGallery(ev, idx + 1)}
                              className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-colors"
                            >
                              <img
                                src={photo}
                                alt={`${ev.nom} - photo ${idx + 2}`}
                                className="w-full h-full object-cover"
                                onError={(e: any) => { e.target.style.display = "none"; }}
                              />
                              {idx === 2 && ev.photos.length > 4 && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-bold">
                                  +{ev.photos.length - 4}
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal galerie photos */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeGallery}
        >
          <button
            onClick={closeGallery}
            className="absolute top-4 right-4 text-white hover:text-yellow-400 transition-colors z-10"
          >
            <X size={24} />
          </button>

          {selectedEvent.photos.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-yellow-400 transition-colors z-10 bg-black/50 rounded-full p-2"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-yellow-400 transition-colors z-10 bg-black/50 rounded-full p-2"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <div
            className="max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={selectedEvent.photos[currentPhotoIndex]}
                alt={`${selectedEvent.nom} - photo ${currentPhotoIndex + 1}`}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 rounded-b-lg">
                <h3 className="text-white font-display text-xl mb-1">{selectedEvent.nom}</h3>
                {selectedEvent.theme && (
                  <p className="text-white/80 text-sm mb-2">{selectedEvent.theme}</p>
                )}
                <div className="flex items-center gap-4 text-white/60 text-xs">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> {formatDate(selectedEvent.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {selectedEvent.heure?.slice(0, 5)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={12} /> {selectedEvent.lieu}
                  </span>
                </div>
              </div>

              <div className="absolute top-4 left-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
                {currentPhotoIndex + 1} / {selectedEvent.photos.length}
              </div>

              {selectedEvent.photos.length > 1 && (
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/50 rounded-full backdrop-blur-sm">
                  {selectedEvent.photos.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPhotoIndex(idx)}
                      className={`h-2 rounded-full transition-all ${
                        idx === currentPhotoIndex ? "w-4 bg-yellow-400" : "w-2 bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Evenements;