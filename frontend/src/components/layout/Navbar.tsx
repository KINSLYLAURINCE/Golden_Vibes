/**
 * Barre de navigation desktop
 * -----------------------------------------
 * Affichée uniquement sur desktop (md+).
 * Sur mobile, c'est la barre du bas + sidebar qui prennent le relais.
 */

import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/logo-golden-vibes.png";

/* Liens de navigation desktop */
const navItems = [
  { label: "Accueil", path: "/" },
  { label: "Candidats", path: "/candidats" },
  { label: "Voter", path: "/vote" },
  { label: "Billetterie", path: "/billetterie" },
  { label: "Événements", path: "/evenements" },
  { label: "Partenaires", path: "/partenaires" },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Golden Vibes" className="h-10 w-auto" />
          <span className="font-display text-lg gold-text">Golden Vibes</span>
        </Link>

        {/* Liens desktop - cachés sur mobile */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium tracking-wide uppercase transition-colors hover:text-primary ${
                location.pathname === item.path ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Bouton de connexion or - visible sur tous les écrans */}
        <Link to="/admin/login">
          <button className="bg-gold text-black px-4 py-2 rounded-md text-sm font-medium tracking-wide uppercase transition-colors hover:bg-gold/80">
            Connexion
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;