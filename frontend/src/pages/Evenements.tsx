/**
 * Page Événements annexes - Golden Vibes Events
 * -----------------------------------------
 * Affiche la liste des événements annexes avec
 * dates, lieux, thèmes, descriptions et photos.
 * Possibilité de voir les images en cliquant.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Star, X, ChevronLeft, ChevronRight, Image } from "lucide-react";

/* Données mock avec images (viendront de GET /evenements) */
const evenementsMock = [
  {
    id: 1,
    nom: "Pré-soirée Golden Vibes",
    date: "2026-04-05",
    heure: "20:00",
    lieu: "Mbouo Star Palace, Dschang",
    theme: "Black & Gold",
    description: "Soirée de lancement officielle de la semaine Golden Vibes. Ambiance chic et décontractée pour chauffer l'atmosphère.",
    statut: "actif",
    photos: [
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop"
    ]
  },
  {
    id: 2,
    nom: "Séance photos candidat(e)s",
    date: "2026-04-08",
    heure: "10:00",
    lieu: "Studio First Class, Dschang",
    theme: "Élégance",
    description: "Shooting photo officiel des candidat(e)s Miss & Mister Golden Vibes 2026. Ouvert au public pour encourager vos favoris.",
    statut: "actif",
    photos: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&h=600&fit=crop"
    ]
  },
  {
    id: 3,
    nom: "Répétition Générale",
    date: "2026-04-10",
    heure: "14:00",
    lieu: "Mbouo Star Palace, Dschang",
    theme: "Préparation",
    description: "Dernière répétition avant la grande soirée. Les candidat(e)s finalisent leurs passages et chorégraphies.",
    statut: "actif",
    photos: [
      "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=600&fit=crop"
    ]
  },
  {
    id: 4,
    nom: "After Party Golden Vibes",
    date: "2026-04-12",
    heure: "22:00",
    lieu: "Mbouo Star Palace, Dschang",
    theme: "Celebration Night",
    description: "La fête continue ! After party exclusive pour célébrer les nouveaux Miss & Mister Golden Vibes.",
    statut: "actif",
    photos: [
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop"
    ]
  },
];

const Evenements = () => {
  const [evenements] = useState(evenementsMock);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  /* Formater la date en français */
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  };

  const openPhotoGallery = (event, photoIndex = 0) => {
    setSelectedEvent(event);
    setCurrentPhotoIndex(photoIndex);
  };

  const closePhotoGallery = () => {
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

  return (
    <div className="py-12 bg-background min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-4xl gold-text text-center mb-2">Événements</h1>
        <p className="text-center text-muted-foreground mb-12">
          Tous les événements autour de Golden Vibes 2026
        </p>

        <div className="max-w-3xl mx-auto space-y-8">
          {evenements.map((ev, i) => (
            <motion.div
              key={ev.id}
              className="bg-card rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-all gold-glow"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              {/* Image principale de l'événement */}
              {ev.photos && ev.photos.length > 0 && (
                <div 
                  className="relative h-48 sm:h-56 overflow-hidden cursor-pointer group"
                  onClick={() => openPhotoGallery(ev, 0)}
                >
                  <img 
                    src={ev.photos[0]} 
                    alt={ev.nom} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Badge nombre de photos */}
                  <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm">
                    <Image size={14} />
                    <span>{ev.photos.length} photos</span>
                  </div>

                  {/* Indicateur de clic */}
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
                    <span className="text-xl font-bold font-display">{new Date(ev.date).getDate()}</span>
                    <span className="text-[10px] uppercase font-semibold">
                      {new Date(ev.date).toLocaleDateString("fr-FR", { month: "short" })}
                    </span>
                  </div>

                  {/* Contenu */}
                  <div className="flex-1">
                    <h3 className="font-display text-xl text-foreground mb-1">{ev.nom}</h3>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} className="text-primary" /> {formatDate(ev.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} className="text-primary" /> {ev.heure}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={12} className="text-primary" /> {ev.lieu}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full mb-3">
                      <Star size={10} /> {ev.theme}
                    </span>
                    <p className="text-sm text-muted-foreground leading-relaxed">{ev.description}</p>
                    
                    {/* Mini galerie d'images */}
                    {ev.photos && ev.photos.length > 1 && (
                      <div className="flex gap-2 mt-4">
                        {ev.photos.slice(1, 4).map((photo, idx) => (
                          <button
                            key={idx}
                            onClick={() => openPhotoGallery(ev, idx + 1)}
                            className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-colors group"
                          >
                            <img 
                              src={photo} 
                              alt={`${ev.nom} - photo ${idx + 2}`}
                              className="w-full h-full object-cover"
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
      </div>

      {/* Modal de visualisation d'images */}
      {selectedEvent && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closePhotoGallery}
        >
          <button
            onClick={closePhotoGallery}
            className="absolute top-4 right-4 text-white hover:text-gold transition-colors z-10"
          >
            <X size={24} />
          </button>

          {selectedEvent.photos.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gold transition-colors z-10 bg-black/50 rounded-full p-2"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gold transition-colors z-10 bg-black/50 rounded-full p-2"
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

              {/* Informations de l'événement */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 rounded-b-lg">
                <h3 className="text-white font-display text-xl mb-1">{selectedEvent.nom}</h3>
                <p className="text-white/80 text-sm mb-2">{selectedEvent.theme}</p>
                <div className="flex items-center gap-4 text-white/60 text-xs">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> {formatDate(selectedEvent.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {selectedEvent.heure}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={12} /> {selectedEvent.lieu}
                  </span>
                </div>
              </div>

              {/* Indicateur de position */}
              <div className="absolute top-4 left-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
                {currentPhotoIndex + 1} / {selectedEvent.photos.length}
              </div>

              {/* Miniatures */}
              {selectedEvent.photos.length > 1 && (
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/50 rounded-full backdrop-blur-sm">
                  {selectedEvent.photos.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPhotoIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === currentPhotoIndex ? 'bg-gold w-4' : 'bg-white/50'
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