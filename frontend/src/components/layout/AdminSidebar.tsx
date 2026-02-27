/**
 * Barre latérale de l'administration
 * -----------------------------------------
 * Menu de navigation pour l'espace admin avec
 * liens vers toutes les sections de gestion.
 */

import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Calendar, Handshake, Ticket, MessageSquare, BarChart3, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import logo from "@/assets/logo-golden-vibes.png";

/* Éléments du menu admin */
const menuItems = [
  { label: "Tableau de bord", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Candidats", path: "/admin/candidats", icon: Users },
  { label: "Événements", path: "/admin/evenements", icon: Calendar },
  { label: "Partenaires", path: "/admin/partenaires", icon: Handshake },
  { label: "Billetterie", path: "/admin/billetterie", icon: Ticket },
  { label: "Messages", path: "/admin/messages", icon: MessageSquare },
  { label: "Statistiques", path: "/admin/statistiques", icon: BarChart3 },
];

const AdminSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link to="/admin/dashboard" className="flex items-center gap-3">
          <img src={logo} alt="Golden Vibes" className="h-10 w-auto" />
          <div>
            <p className="font-display text-sm gold-text">Golden Vibes</p>
            <p className="text-xs text-muted-foreground">Administration</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const actif = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
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
        <Link to="/" className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2">
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
    </aside>
  );
};

export default AdminSidebar;
