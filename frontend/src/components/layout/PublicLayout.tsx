/**
 * Layout public
 * -----------------------------------------
 * Structure commune à toutes les pages publiques :
 * - Navbar en haut (desktop uniquement)
 * - Barre du bas fixe (mobile uniquement, style WhatsApp)
 * - Sidebar mobile (drawer)
 * - Pied de page
 */

import { useState, ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import MobileBottomBar from "./MobileBottomBar";
import MobileSidebar from "./MobileSidebar";

const PublicLayout = ({ children }: { children: ReactNode }) => {
  /* État de la sidebar mobile */
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Barre de navigation desktop (cachée sur mobile) */}
      <Navbar />

      {/* Contenu principal - padding top pour navbar desktop, padding bottom pour bottom bar mobile */}
      <main className="flex-1 pt-16 md:pt-16 pb-20 md:pb-0">{children}</main>

      {/* Pied de page (caché sur mobile pour éviter conflit avec bottom bar) */}
      <div className="hidden md:block">
        <Footer />
      </div>

      {/* Barre du bas mobile (style WhatsApp) */}
      <MobileBottomBar onToggleSidebar={() => setSidebarOpen(true)} />

      {/* Sidebar mobile (drawer) */}
      <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
};

export default PublicLayout;
