/**
 * Constantes globales de l'application
 * -----------------------------------------
 * Couleurs, tarifs, catégories et autres valeurs fixes.
 */

/* Tarification */
export const PRIX_VOTE = 100; // 1 vote = 100 FCFA

/* Catégories de candidats */
export const CATEGORIES = ["miss", "master"];

/* Modes de paiement */
export const MODES_PAIEMENT = [
  { value: "orange", label: "Orange Money", emoji: "🟠" },
  { value: "mtn", label: "MTN MoMo", emoji: "🟡" },
];

/* Catégories de partenaires */
export const CATEGORIES_PARTENAIRES = ["Platine", "Or", "Argent", "Bronze"];

/* Objets de contact */
export const OBJETS_CONTACT = [
  "Candidature",
  "Partenariat",
  "Information",
  "Réclamation",
  "Autre",
];

/* Informations de l'événement */
export const EVENEMENT = {
  nom: "Golden Vibes Event 2026",
  date: "2026-04-11T20:00:00",
  lieu: "Mbouoh Night Club, Dschang",
  cagnotte: 500000,
};
