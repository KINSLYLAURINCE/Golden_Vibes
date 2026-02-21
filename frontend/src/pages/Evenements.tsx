/**
 * Page Événements annexes - Golden Vibes Events
 * -----------------------------------------
 * Affiche la liste des événements annexes avec
 * dates, lieux, thèmes et descriptions.
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Star } from "lucide-react";

/* Données mock (viendront de GET /evenements) */
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
  },
];

const Evenements = () => {
  const [evenements] = useState(evenementsMock);

  /* Formater la date en français */
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  };

  return (
    <div className="py-12 bg-background min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-4xl gold-text text-center mb-2">Événements</h1>
        <p className="text-center text-muted-foreground mb-12">
          Tous les événements autour de Golden Vibes 2026
        </p>

        <div className="max-w-3xl mx-auto space-y-6">
          {evenements.map((ev, i) => (
            <motion.div
              key={ev.id}
              className="bg-card rounded-xl border border-border p-6 hover:border-primary/50 transition-all gold-glow"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
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
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Evenements;
