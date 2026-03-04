/**
 * Barre latérale de l'administration
 * -----------------------------------------
 * Desktop : sidebar fixe à gauche
 * Mobile  : drawer avec bouton burger toggle
 */

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, Calendar, Handshake,
  Ticket, MessageSquare, BarChart3, LogOut, Menu, X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import logo from "@/assets/logo-golden-vibes.png";

const menuItems = [
  { label: "Tableau de bord", path: "/admin/dashboard",    icon: LayoutDashboard },
  { label: "Candidats",       path: "/admin/candidats",    icon: Users           },
  { label: "Événements",      path: "/admin/evenements",   icon: Calendar        },
  { label: "Partenaires",     path: "/admin/partenaires",  icon: Handshake       },
  { label: "Billetterie",     path: "/admin/billetterie",  icon: Ticket          },
  { label: "Messages",        path: "/admin/messages",     icon: MessageSquare   },
  { label: "Statistiques",    path: "/admin/statistiques", icon: BarChart3       },
];

// ── Contenu partagé sidebar ───────────────────────────────────────────────────
const SidebarContent = ({ onClose }: { onClose?: () => void }) => {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-border flex items-center justify-between">
        <Link
          to="/admin/dashboard"
          onClick={onClose}
          className="flex items-center gap-3"
        >
          <img src={logo} alt="Golden Vibes" className="h-10 w-auto" />
          <div>
            <p className="font-display text-sm gold-text">Golden Vibes</p>
            <p className="text-xs text-muted-foreground">Administration</p>
          </div>
        </Link>
        {/* Bouton fermer — mobile uniquement */}
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors md:hidden"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const actif = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                actif
                  ? "gold-gradient text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Déconnexion */}
      <div className="p-4 border-t border-border">
        <Link
          to="/"
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
        >
          🌐 Voir le site
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>
    </div>
  );
};

// ── Composant principal ───────────────────────────────────────────────────────
const AdminSidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ── Desktop : sidebar fixe ── */}
      <aside className="hidden md:flex w-64 bg-card border-r border-border min-h-screen flex-col shrink-0">
        <SidebarContent />
      </aside>

      {/* ── Mobile : bouton burger fixe ── */}
      <button
        onClick={() => setMobileOpen(true)}
        aria-label="Ouvrir le menu"
        className="fixed top-4 left-4 z-[80] md:hidden w-10 h-10 rounded-xl bg-card border border-border shadow-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* ── Mobile : drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 z-[85] bg-black/60 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Panneau */}
            <motion.aside
              className="fixed top-0 left-0 bottom-0 z-[90] w-72 bg-card border-r border-border md:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
            >
              <SidebarContent onClose={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;