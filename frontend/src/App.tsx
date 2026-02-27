/**
 * Application principale - Golden Vibes Events
 * -----------------------------------------
 * Configuration des routes publiques et administratives.
 * Intègre le contexte d'authentification et les layouts.
 */

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/utils/ProtectedRoute";

/* Layouts */
import PublicLayout from "@/components/layout/PublicLayout";
import AdminLayout from "@/components/layout/AdminLayout";

/* Pages publiques */
import Home from "@/pages/Home";
import Candidats from "@/pages/Candidats";
import CandidatDetail from "@/pages/CandidatDetail";
import Vote from "@/pages/Vote";
import Billetterie from "@/pages/Billetterie";
import Partenaires from "@/pages/Partenaires";
import Contact from "@/pages/Contact";
import Evenements from "@/pages/Evenements";
import NotFound from "@/pages/NotFound";

/* Pages administration */
import Login from "@/pages/admin/Login";
import Dashboard from "@/pages/admin/Dashboard";
import ListeCandidats from "@/pages/admin/candidats/ListeCandidats";
import AjouterCandidat from "@/pages/admin/candidats/AjouterCandidat";
import ModifierCandidat from "@/pages/admin/candidats/ModifierCandidat";
import ListeEvenements from "@/pages/admin/evenements/ListeEvenements";
import ListePartenaires from "@/pages/admin/partenaires/ListePartenaires";
import GestionBilletterie from "@/pages/admin/billetterie/GestionBilletterie";
import Messages from "@/pages/admin/Messages";
import Statistiques from "@/pages/admin/Statistiques";

/* Client React Query */
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* ===== Routes publiques ===== */}
            <Route element={<PublicLayout><Home /></PublicLayout>} path="/" />
            <Route element={<PublicLayout><Candidats /></PublicLayout>} path="/candidats" />
            <Route element={<PublicLayout><CandidatDetail /></PublicLayout>} path="/candidats/:id" />
            <Route element={<PublicLayout><Vote /></PublicLayout>} path="/vote" />
            <Route element={<PublicLayout><Billetterie /></PublicLayout>} path="/billetterie" />
            <Route element={<PublicLayout><Partenaires /></PublicLayout>} path="/partenaires" />
            <Route element={<PublicLayout><Evenements /></PublicLayout>} path="/evenements" />
            <Route element={<PublicLayout><Contact /></PublicLayout>} path="/contact" />

            {/* ===== Connexion admin ===== */}
            <Route path="/admin/login" element={<Login />} />

            {/* ===== Routes administration protégées ===== */}
            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminLayout><Dashboard /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/candidats" element={<ProtectedRoute><AdminLayout><ListeCandidats /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/candidats/ajouter" element={<ProtectedRoute><AdminLayout><AjouterCandidat /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/candidats/modifier/:id" element={<ProtectedRoute><AdminLayout><ModifierCandidat /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/evenements" element={<ProtectedRoute><AdminLayout><ListeEvenements /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/partenaires" element={<ProtectedRoute><AdminLayout><ListePartenaires /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/billetterie" element={<ProtectedRoute><AdminLayout><GestionBilletterie /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/messages" element={<ProtectedRoute><AdminLayout><Messages /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/statistiques" element={<ProtectedRoute><AdminLayout><Statistiques /></AdminLayout></ProtectedRoute>} />

            {/* ===== Page 404 ===== */}
            <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
