import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { XCircle } from "lucide-react";

const VoteCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle size={40} className="text-red-500" />
        </div>
        
        <h2 className="font-display text-2xl text-foreground mb-2">
          Paiement annulé
        </h2>
        
        <p className="text-muted-foreground mb-8">
          Vous avez annulé le paiement. Aucun montant n'a été débité de votre compte.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => navigate("/vote")}
            className="w-full gold-gradient text-primary-foreground px-8 py-3 rounded-lg font-semibold uppercase tracking-wider"
          >
            Réessayer le paiement
          </button>
          
          <button
            onClick={() => navigate("/")}
            className="w-full border border-border text-muted-foreground px-8 py-3 rounded-lg font-medium hover:bg-secondary transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default VoteCancel;