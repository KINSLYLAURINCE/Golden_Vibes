import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, AlertCircle, Ticket } from "lucide-react";
import axios from "axios";
import { API_URL } from "@/services/api";

interface BilletData {
  transaction_id: string;
  statut: string;
  qr_code: string;
  quantite: number;
  montant_total: number;
  pack?: {
    id: number;
    nom: string;
    prix: number;
  };
}

const BilletSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const transactionId = searchParams.get("transaction");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Vérification du paiement en cours...");
  const [billetData, setBilletData] = useState<BilletData | null>(null);
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 30;

  useEffect(() => {
    if (!transactionId) {
      setStatus("error");
      setMessage("Transaction introuvable");
      return;
    }

    let interval: NodeJS.Timeout;

    const checkBillet = async () => {
      try {
        console.log(`Tentative ${attempts + 1}/${maxAttempts} - Vérification billet:`, transactionId);

        const response = await axios.get(`${API_URL}/billets/check/${transactionId}`);
        
        if (response.data.success) {
          const data = response.data.data;
          
          if (data.statut === "valide") {
            setStatus("success");
            setBilletData(data);
            setMessage("Votre billet a été validé avec succès !");
            if (interval) clearInterval(interval);
          } else {
            setAttempts(prev => prev + 1);
            
            if (attempts >= maxAttempts - 1) {
              setStatus("error");
              setMessage("La vérification prend plus de temps que prévu. Votre billet sera confirmé sous peu.");
              if (interval) clearInterval(interval);
            }
          }
        }
      } catch (error: any) {
        console.error("Erreur vérification billet:", error);
        setAttempts(prev => prev + 1);
        
        if (attempts >= maxAttempts - 1) {
          setStatus("error");
          setMessage("Impossible de vérifier le paiement.");
          if (interval) clearInterval(interval);
        }
      }
    };

    checkBillet();
    interval = setInterval(checkBillet, 2000);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [transactionId, attempts]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        {status === "loading" && (
          <div className="text-center">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 size={40} className="text-primary animate-spin" />
            </div>
            <h2 className="font-display text-2xl text-foreground mb-2">
              Vérification en cours...
            </h2>
            <p className="text-muted-foreground">{message}</p>
          </div>
        )}

        {status === "success" && billetData && (
          <div className="text-center">
            <div className="w-20 h-20 gold-gradient rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-primary-foreground" />
            </div>
            <h2 className="font-display text-2xl text-foreground mb-2">
              Billet validé !
            </h2>
            <p className="text-muted-foreground mb-6">{message}</p>

            <div className="bg-card border border-border rounded-xl p-6 text-left space-y-4 mb-6">
              {billetData.pack && (
                <div className="flex items-center gap-3 pb-4 border-b border-border">
                  <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                    <Ticket size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-primary uppercase">Pack</p>
                    <p className="font-display text-lg text-foreground">
                      {billetData.pack.nom}
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-secondary/50 rounded-lg p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Code QR</p>
                <p className="text-xl font-mono font-bold text-primary">
                  {billetData.qr_code}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Conservez ce code pour accéder à l'événement
                </p>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Quantité</span>
                <span className="text-sm font-bold text-primary">
                  {billetData.quantite}
                </span>
              </div>

              <div className="flex justify-between pt-3 border-t border-border">
                <span className="text-sm font-medium text-foreground">Montant payé</span>
                <span className="text-lg font-bold text-primary">
                  {billetData.montant_total.toLocaleString()} FCFA
                </span>
              </div>

              <p className="text-xs text-center text-muted-foreground pt-3 border-t border-border">
                📧 Un email de confirmation a été envoyé avec votre code QR
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate("/billetterie")}
                className="w-full gold-gradient text-primary-foreground px-8 py-3 rounded-lg font-semibold uppercase tracking-wider"
              >
                Acheter d'autres billets
              </button>
              <button
                onClick={() => navigate("/")}
                className="w-full border border-border text-muted-foreground px-8 py-3 rounded-lg font-medium hover:bg-secondary transition-colors"
              >
                Retour à l'accueil
              </button>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="text-center">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={40} className="text-red-500" />
            </div>
            <h2 className="font-display text-2xl text-foreground mb-2">
              Erreur
            </h2>
            <p className="text-muted-foreground mb-8">{message}</p>
            <button
              onClick={() => navigate("/billetterie")}
              className="w-full gold-gradient text-primary-foreground px-8 py-3 rounded-lg font-semibold uppercase tracking-wider"
              >
              Réessayer
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default BilletSuccess;