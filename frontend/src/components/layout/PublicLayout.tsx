/**
 * Layout public
 * -----------------------------------------
 * Structure commune à toutes les pages publiques :
 * - Navbar en haut (desktop uniquement)
 * - Barre du bas fixe (mobile uniquement)
 * - Sidebar mobile (drawer)
 * - Pied de page
 */

import { useState, ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import MobileBottomBar from "./MobileBottomBar";
import MobileSidebar from "./MobileSidebar";

const PublicLayout = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">

      {/* Navbar desktop */}
      <Navbar />

      {/* Contenu principal */}
      <main className="flex-1 pt-16 md:pt-16 pb-20 md:pb-0">
        {children}
      </main>

      {/* Footer visible sur tous les écrans */}
      <div className="pb-20 md:pb-0">
        <Footer />
      </div>

      {/* Bottom bar mobile */}
      <MobileBottomBar onToggleSidebar={() => setSidebarOpen(true)} />

      {/* Sidebar mobile */}
      <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

    </div>
  );
};

export default PublicLayout;