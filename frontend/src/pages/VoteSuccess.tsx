import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, AlertCircle, Crown } from "lucide-react";
import axios from "axios";
import { API_URL } from "@/services/api";

interface VoteData {
  transaction_id: string;
  statut: string;
  nombre_votes: number;
  montant: number;
  candidat?: {
    id: number;
    nom: string;
    numero: number;
  };
}

const VoteSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const transactionId = searchParams.get("transaction");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Vérification du paiement en cours...");
  const [voteData, setVoteData] = useState<VoteData | null>(null);
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 30; // 30 tentatives × 2 secondes = 1 minute max

  useEffect(() => {
    if (!transactionId) {
      setStatus("error");
      setMessage("Transaction introuvable");
      return;
    }

    let interval: NodeJS.Timeout;

    const checkVote = async () => {
      try {
        console.log(`Tentative ${attempts + 1}/${maxAttempts} - Vérification transaction:`, transactionId);

        const response = await axios.get(`${API_URL}/votes/check/${transactionId}`);
        
        console.log("Réponse vérification:", response.data);

        if (response.data.success) {
          const data = response.data.data;
          
          if (data.statut === "valide") {
            // ✅ Vote validé !
            setStatus("success");
            setVoteData(data);
            setMessage("Votre vote a été validé avec succès !");
            
            // Arrêter les vérifications
            if (interval) clearInterval(interval);
          } else {
            // Toujours en attente
            setAttempts(prev => prev + 1);
            
            if (attempts >= maxAttempts - 1) {
              // Timeout après 1 minute
              setStatus("error");
              setMessage("La vérification du paiement prend plus de temps que prévu. Votre vote sera confirmé sous peu.");
              if (interval) clearInterval(interval);
            } else {
              setMessage(`Vérification en cours... (${attempts + 1}/${maxAttempts})`);
            }
          }
        } else {
          setStatus("error");
          setMessage(response.data.message || "Erreur lors de la vérification");
          if (interval) clearInterval(interval);
        }
      } catch (error: any) {
        console.error("Erreur vérification vote:", error);
        setAttempts(prev => prev + 1);
        
        if (attempts >= maxAttempts - 1) {
          setStatus("error");
          setMessage("Impossible de vérifier le paiement. Veuillez contacter le support.");
          if (interval) clearInterval(interval);
        }
      }
    };

    // Première vérification immédiate
    checkVote();

    // Puis vérifier toutes les 2 secondes
    interval = setInterval(checkVote, 2000);

    // Nettoyer l'intervalle au démontage
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
        {/* ── LOADING ── */}
        {status === "loading" && (
          <div className="text-center">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 size={40} className="text-primary animate-spin" />
            </div>
            <h2 className="font-display text-2xl text-foreground mb-2">
              Vérification en cours...
            </h2>
            <p className="text-muted-foreground mb-4">{message}</p>
            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full gold-gradient"
                initial={{ width: "0%" }}
                animate={{ width: `${(attempts / maxAttempts) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Cela peut prendre quelques secondes...
            </p>
          </div>
        )}

        {/* ── SUCCESS ── */}
        {status === "success" && voteData && (
          <div className="text-center">
            <div className="w-20 h-20 gold-gradient rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-primary-foreground" />
            </div>
            <h2 className="font-display text-2xl text-foreground mb-2">
              Vote validé !
            </h2>
            <p className="text-muted-foreground mb-6">{message}</p>

            {/* Détails du vote */}
            <div className="bg-card border border-border rounded-xl p-6 text-left space-y-4 mb-6">
              {voteData.candidat && (
                <div className="flex items-center gap-3 pb-4 border-b border-border">
                  <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                    <Crown size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-primary uppercase">
                      N°{voteData.candidat.numero}
                    </p>
                    <p className="font-display text-lg text-foreground">
                      {voteData.candidat.nom}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Transaction</span>
                <span className="text-sm text-foreground font-mono">
                  {transactionId?.substring(0, 12)}...
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Nombre de votes</span>
                <span className="text-sm font-bold text-primary">
                  {voteData.nombre_votes}
                </span>
              </div>

              <div className="flex justify-between pt-3 border-t border-border">
                <span className="text-sm font-medium text-foreground">Montant payé</span>
                <span className="text-lg font-bold text-primary">
                  {voteData.montant.toLocaleString()} FCFA
                </span>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="space-y-3">
              <button
                onClick={() => navigate("/vote")}
                className="w-full gold-gradient text-primary-foreground px-8 py-3 rounded-lg font-semibold uppercase tracking-wider"
              >
                Voter à nouveau
              </button>
              <button
                onClick={() => navigate("/candidats")}
                className="w-full border border-border text-muted-foreground px-8 py-3 rounded-lg font-medium hover:bg-secondary transition-colors"
              >
                Voir les candidats
              </button>
            </div>
          </div>
        )}

        {/* ── ERROR ── */}
        {status === "error" && (
          <div className="text-center">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={40} className="text-red-500" />
            </div>
            <h2 className="font-display text-2xl text-foreground mb-2">
              {attempts >= maxAttempts ? "Vérification en cours" : "Erreur"}
            </h2>
            <p className="text-muted-foreground mb-8">{message}</p>

            {attempts >= maxAttempts && (
              <div className="bg-card border border-border rounded-lg p-4 mb-6">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Note :</strong> Si vous avez bien effectué le paiement, 
                  votre vote sera automatiquement validé dans les prochaines minutes. 
                  Vous pouvez fermer cette page en toute sécurité.
                </p>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={() => navigate("/vote")}
                className="w-full gold-gradient text-primary-foreground px-8 py-3 rounded-lg font-semibold uppercase tracking-wider"
              >
                Réessayer
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
      </motion.div>
    </div>
  );
};

export default VoteSuccess;