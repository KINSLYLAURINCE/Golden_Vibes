import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Phone, ChevronUp, Mail, MapPin } from "lucide-react";
import logo from "@/assets/logo-golden-vibes.png";
import { useState, useEffect } from "react";

const Footer = () => {
  const [showButton, setShowButton] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => setShowButton(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer className="bg-card border-t border-border w-full">

      {showButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-4 md:bottom-8 md:right-8 bg-yellow-400 text-black w-12 h-12 rounded-full shadow-lg hover:bg-yellow-300 transition-all duration-300 flex items-center justify-center hover:scale-110 z-50"
          aria-label="Remonter en haut"
        >
          <ChevronUp size={24} />
        </button>
      )}

      <div className="w-full px-4 sm:px-6 py-10">
        <div className="max-w-6xl mx-auto">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

            {/* Colonne 1 : Logo */}
            <div className="flex flex-col items-center sm:items-start gap-4">
              <img src={logo} alt="Golden Vibes" className="h-16 w-auto object-contain" />
              <p className="text-muted-foreground text-sm leading-relaxed text-center sm:text-left">
                Votre destination premium pour des moments inoubliables.
                Découvrez une expérience unique et authentique.
              </p>
            </div>

            {/* Colonne 2 : Liens rapides */}
            <div className="flex flex-col items-center sm:items-start">
              <h3 className="font-semibold text-base text-foreground mb-4 pb-2 border-b-2 border-yellow-400/30 w-full text-center sm:text-left">
                Liens rapides
              </h3>
              <ul className="space-y-3 text-sm w-full text-center sm:text-left">
                {[
                  { to: "/", label: "Accueil" },
                  { to: "/candidats", label: "Candidats" },
                  { to: "/evenements", label: "Événements" },
                  { to: "/billetterie", label: "Billetterie" },
                  { to: "/vote", label: "Voter" },
                  { to: "/contact", label: "Contact" },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to} className="text-muted-foreground hover:text-yellow-400 transition-colors py-1 block">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Colonne 3 : Contact */}
            <div className="flex flex-col items-center sm:items-start">
              <h3 className="font-semibold text-base text-foreground mb-4 pb-2 border-b-2 border-yellow-400/30 w-full text-center sm:text-left">
                Contact
              </h3>
              <ul className="space-y-4 text-sm w-full">
                <li className="flex items-start justify-center sm:justify-start gap-3">
                  <Phone size={18} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">+237 6XX XXX XXX</span>
                </li>
                <li className="flex items-start justify-center sm:justify-start gap-3">
                  <Mail size={18} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground break-all">contact@goldenvibes-event.com</span>
                </li>
                <li className="flex items-start justify-center sm:justify-start gap-3">
                  <MapPin size={18} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">
                    Mbouo Star Palace<br />Dschang, Cameroun
                  </span>
                </li>
              </ul>
            </div>

            {/* Colonne 4 : Réseaux sociaux */}
            <div className="flex flex-col items-center sm:items-start">
              <h3 className="font-semibold text-base text-foreground mb-4 pb-2 border-b-2 border-yellow-400/30 w-full text-center sm:text-left">
                Suivez-nous
              </h3>

              <div className="flex justify-center sm:justify-start gap-5 mb-6">
                <a href="#" aria-label="Facebook" className="text-muted-foreground hover:text-yellow-400 transition-all hover:scale-110">
                  <Facebook size={22} />
                </a>
                <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-yellow-400 transition-all hover:scale-110">
                  <Instagram size={22} />
                </a>
                <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-yellow-400 transition-all hover:scale-110">
                  <Twitter size={22} />
                </a>
              </div>

              <div className="border-t border-border/50 pt-4 w-full text-center sm:text-left">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground block mb-1">Horaires :</span>
                  Lun–Ven : 9h – 19h<br />
                  Sam : 10h – 17h
                </p>
              </div>
            </div>

          </div>

          {/* Bas de footer */}
          <div className="border-t border-border pt-8 flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground text-center">
              © {new Date().getFullYear()} Golden Vibes. Tous droits réservés.
            </p>
            <p className="text-sm text-muted-foreground text-center">
              Powered by{" "}
              <span
                className="font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 text-base tracking-wider"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                SIR-TECH
              </span>
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
              <Link to="/mentions-legales" className="hover:text-yellow-400 transition-colors">Mentions légales</Link>
              <Link to="/confidentialite" className="hover:text-yellow-400 transition-colors">Politique de confidentialité</Link>
              <Link to="/cookies" className="hover:text-yellow-400 transition-colors">Cookies</Link>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;