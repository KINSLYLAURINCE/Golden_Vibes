/**
 * Barre de navigation mobile fixe en bas (style WhatsApp)
 * -----------------------------------------
 * Icônes : Accueil, Billets, Candidats (centre), Contact, Menu (toggle droite).
 * Fixe en bas de l'écran, non-scrollable.
 */

import { Link, useLocation } from "react-router-dom";
import { Home, Ticket, Users, Phone, Menu } from "lucide-react";

/* Éléments de la barre du bas */
const bottomItems = [
  { label: "Accueil", path: "/", icon: Home },
  { label: "Billets", path: "/billetterie", icon: Ticket },
  { label: "Candidats", path: "/candidats", icon: Users },
  { label: "Contact", path: "/contact", icon: Phone },
];

const MobileBottomBar = ({ onToggleSidebar }) => {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border">
      <div className="flex items-center justify-around h-16 px-2">
        {/* Quatre icônes principales */}
        {bottomItems.map((item) => {
          const isActive = location.pathname === item.path;
          const isCandidats = item.path === "/candidats";
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors relative ${
                isActive 
                  ? isCandidats 
                    ? "text-gold" // Candidats actif en doré
                    : "text-primary" // Autres liens actifs en couleur primaire
                  : "text-muted-foreground"
              }`}
            >
              {/* Badge spécial pour Candidats (toujours visible) */}
              {isCandidats && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-gold rounded-full animate-pulse"></div>
              )}
              
              <item.icon 
                size={22} 
                className={isCandidats && !isActive ? "text-gold/70" : ""} 
              />
              <span className={`text-[10px] font-medium ${
                isCandidats && !isActive ? "text-gold/70" : ""
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Bouton toggle sidebar à l'extrême droite - SANS COULEUR JAUNE */}
        <button
          onClick={onToggleSidebar}
          className="flex flex-col items-center gap-0.5 px-3 py-1 group"
        >
          <div className="w-10 h-10 rounded-full bg-muted/80 border border-border flex items-center justify-center shadow-sm group-hover:bg-muted transition-colors">
            <Menu size={20} className="text-muted-foreground group-hover:text-foreground" />
          </div>
          <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground">
            Menu
          </span>
        </button>
      </div>
    </nav>
  );
};

export default MobileBottomBar;