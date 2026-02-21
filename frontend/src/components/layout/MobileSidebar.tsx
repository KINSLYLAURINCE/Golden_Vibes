/**
 * Sidebar mobile (drawer latéral)
 * -----------------------------------------
 * S'ouvre depuis le bouton toggle de la barre du bas.
 * Contient tous les liens de navigation supplémentaires.
 */

import { Link, useLocation } from "react-router-dom";
import { X, Home, Users, Vote, Ticket, Handshake, Phone, Calendar, Crown, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo-golden-vibes.png";

/* Tous les liens de navigation */
const sidebarLinks = [
  { label: "Accueil", path: "/", icon: Home },
  { label: "Candidats", path: "/candidats", icon: Users },
  { label: "Voter", path: "/vote", icon: Vote },
  { label: "Billetterie", path: "/billetterie", icon: Ticket },
  { label: "Événements", path: "/evenements", icon: Calendar },
  { label: "Partenaires", path: "/partenaires", icon: Handshake },
  { label: "Contact", path: "/contact", icon: Phone },
];

const MobileSidebar = ({ open, onClose }) => {
  const location = useLocation();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay sombre */}
          <motion.div
            className="fixed inset-0 z-[60] bg-background/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panneau latéral */}
          <motion.aside
            className="fixed top-0 left-0 bottom-0 z-[70] w-72 bg-card border-r border-border flex flex-col"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* En-tête avec logo */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <img src={logo} alt="Golden Vibes" className="h-10 w-auto" />
                <span className="font-display text-lg gold-text">Golden Vibes</span>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X size={24} />
              </button>
            </div>

            {/* Liens de navigation */}
            <nav className="flex-1 overflow-y-auto py-4">
              {sidebarLinks.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-6 py-3.5 text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? "text-primary bg-primary/10 border-r-2 border-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <item.icon size={20} />
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Pied de la sidebar */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Crown size={14} className="text-primary" />
                <span>© 2026 Golden Vibes Events</span>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;
