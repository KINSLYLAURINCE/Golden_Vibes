/**
 * Fonctions utilitaires de formatage
 * -----------------------------------------
 * Formatage des dates, prix et autres valeurs.
 */

/* Formater un prix en FCFA */
export const formatPrix = (montant) => {
  return new Intl.NumberFormat("fr-FR").format(montant) + " FCFA";
};

/* Formater une date en format français */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

/* Formater une date avec heure */
export const formatDateTime = (date) => {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
