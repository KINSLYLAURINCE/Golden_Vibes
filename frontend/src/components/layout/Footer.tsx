import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Phone, ChevronUp } from "lucide-react";
import logo from "@/assets/logo-golden-vibes.png";
import { useState, useEffect } from "react";

const Footer = () => {
  const [showButton, setShowButton] = useState(false);

  // Fonction pour remonter en haut de la page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Détecter le défilement pour afficher/masquer le bouton
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer className="bg-card border-t border-border relative">
      {/* Bouton ascenseur or avec apparition conditionnelle */}
      {showButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-4 md:bottom-8 md:right-8 bg-gold text-black w-12 h-12 rounded-full shadow-lg hover:bg-gold/80 transition-all duration-300 flex items-center justify-center group hover:scale-110 z-50"
          aria-label="Remonter en haut"
        >
          <ChevronUp size={24} className="group-hover:-translate-y-1 transition-transform duration-300" />
        </button>
      )}

      <div className="container mx-auto px-4 py-12">
        {/* ... reste du contenu du footer ... */}
      </div>
    </footer>
  );
};

export default Footer;