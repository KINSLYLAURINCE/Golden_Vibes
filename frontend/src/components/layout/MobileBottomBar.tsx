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
        {bottomItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
              location.pathname === item.path ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <item.icon size={22} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}

        {/* Bouton toggle sidebar à l'extrême droite */}
        <button
          onClick={onToggleSidebar}
          className="flex flex-col items-center gap-0.5 px-3 py-1"
        >
          <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center shadow-lg">
            <Menu size={20} className="text-primary-foreground" />
          </div>
          <span className="text-[10px] font-medium text-primary">Menu</span>
        </button>
      </div>
    </nav>
  );
};

export default MobileBottomBar;
