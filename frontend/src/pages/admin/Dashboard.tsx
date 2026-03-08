/**
 * Tableau de bord administrateur
 * -----------------------------------------
 * Vue d'ensemble avec statistiques en temps réel :
 * candidats, votes, billetterie, messages.
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, Crown, Ticket, MessageSquare, TrendingUp, 
  DollarSign, Loader2 
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

import { API_URL } from "@/services/api";  

const COLORS_PIE = ["#FFD700", "#B8860B", "#666", "#444", "#333"];

// Types
interface Stats {
  total_candidats?: number;
  total_candidats_miss?: number;
  total_candidats_master?: number;
  total_votes?: number;
  montant_votes?: number;
  billets_vendus?: number;
  revenus_billets?: number;
  messages_non_lus?: number;
  top_candidats?: Array<{
    id: number;
    nom: string;
    numero: number;
    votes_count: number;
  }>;
}

interface StatsVotesEvolution {
  date: string;
  votes: number;
}

interface StatsVotesParCandidat {
  id: number;
  nom: string;
  total_votes: number;
}

interface StatsVotes {
  evolution?: StatsVotesEvolution[];
  par_candidat?: StatsVotesParCandidat[];
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsVotes, setStatsVotes] = useState<StatsVotes | null>(null);
  const [loading, setLoading] = useState(true);
  const [periode, setPeriode] = useState<"7j" | "30j" | "all">("7j");

  const token = localStorage.getItem("token");

  // Helper function for API calls with auth headers
  const fetchWithAuth = async (endpoint: string) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized
        localStorage.removeItem("token");
        window.location.href = "/login";
        throw new Error("Session expirée");
      }
      throw new Error(`Erreur ${response.status}`);
    }
    
    const data = await response.json();
    return data.data || data;
  };

  // Charger les stats principales
  const fetchStats = async () => {
    try {
      const data = await fetchWithAuth('/admin/stats');
      setStats(data);
    } catch (err) {
      console.error("Erreur stats:", err);
    }
  };

  // Charger les stats votes
  const fetchStatsVotes = async (p: string = periode) => {
    try {
      const data = await fetchWithAuth(`/admin/stats/votes?periode=${p}`);
      setStatsVotes(data);
    } catch (err) {
      console.error("Erreur stats votes:", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchStats(), fetchStatsVotes()]);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    fetchStatsVotes(periode);
  }, [periode]);

  // Formatter l'évolution pour le graphique
  const evolutionData = statsVotes?.evolution?.map((e) => ({
    jour: new Date(e.date).toLocaleDateString("fr-FR", { weekday: "short" }),
    votes: e.votes,
  })) || [];

  // Formatter les packs pour le camembert
  const ventesPackData = statsVotes?.par_candidat?.slice(0, 5).map((c, i) => ({
    nom: c.nom,
    valeur: c.total_votes || 0,
    couleur: COLORS_PIE[i % COLORS_PIE.length],
  })) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 size={40} className="text-primary" />
        </motion.div>
      </div>
    );
  }

  const statsCards = [
    {
      label: "Total Candidats",
      value: stats?.total_candidats ?? "—",
      detail: `${stats?.total_candidats_miss ?? 0} Miss · ${stats?.total_candidats_master ?? 0} Master`,
      icon: Users,
      couleur: "text-primary",
    },
    {
      label: "Total Votes",
      value: Number(stats?.total_votes ?? 0).toLocaleString(),
      detail: `${Number(stats?.montant_votes ?? 0).toLocaleString()} FCFA collectés`,
      icon: Crown,
      couleur: "text-primary",
    },
    {
      label: "Billets Vendus",
      value: Number(stats?.billets_vendus ?? 0).toLocaleString(),
      detail: `${Number(stats?.revenus_billets ?? 0).toLocaleString()} FCFA revenus`,
      icon: Ticket,
      couleur: "text-primary",
    },
    {
      label: "Messages",
      value: stats?.messages_non_lus ?? "—",
      detail: `${stats?.messages_non_lus ?? 0} non lu(s)`,
      icon: MessageSquare,
      couleur: stats?.messages_non_lus && stats.messages_non_lus > 0 
        ? "text-destructive" 
        : "text-primary",
    },
    {
      label: "Revenus Votes",
      value: Number(stats?.montant_votes ?? 0).toLocaleString(),
      detail: "FCFA",
      icon: TrendingUp,
      couleur: "text-primary",
    },
    {
      label: "Revenus Totaux",
      value: Number((stats?.montant_votes ?? 0) + (stats?.revenus_billets ?? 0)).toLocaleString(),
      detail: "Votes + Billets",
      icon: DollarSign,
      couleur: "text-primary",
    },
  ];

  return (
    <div className="py-6">
      <h1 className="font-display text-3xl gold-text mb-2">Tableau de Bord</h1>
      <p className="text-muted-foreground mb-8">Vue d'ensemble de Golden Vibes Events</p>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statsCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="bg-card border border-border rounded-xl p-5 flex items-start gap-4 hover:border-primary/50 transition-all"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center shrink-0">
              <stat.icon size={22} className={stat.couleur} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground font-display">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.detail}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

        {/* Évolution des votes */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg text-foreground">Évolution des Votes</h3>
            <div className="flex gap-1">
              {(["7j", "30j", "all"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriode(p)}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                    periode === p
                      ? "border-primary bg-primary/20 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {p === "all" ? "Tout" : p === "7j" ? "7 jours" : "30 jours"}
                </button>
              ))}
            </div>
          </div>

          {evolutionData.length === 0 ? (
            <div className="flex items-center justify-center h-[250px] text-muted-foreground text-sm">
              Aucune donnée disponible
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={evolutionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 20%)" />
                <XAxis 
                  dataKey="jour" 
                  stroke="hsl(0 0% 60%)" 
                  fontSize={12} 
                />
                <YAxis 
                  stroke="hsl(0 0% 60%)" 
                  fontSize={12} 
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(0 0% 8%)",
                    border: "1px solid hsl(43 30% 20%)",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "hsl(0 0% 95%)" }}
                />
                <Bar 
                  dataKey="votes" 
                  fill="hsl(43 72% 55%)" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Votes par candidat (camembert) */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-display text-lg text-foreground mb-4">Votes par Candidat</h3>
          {ventesPackData.length === 0 ? (
            <div className="flex items-center justify-center h-[250px] text-muted-foreground text-sm">
              Aucune donnée disponible
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={ventesPackData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="valeur"
                  nameKey="nom"
                  label={({ nom, valeur }) => {
                    const shortName = nom.split(" ")[0] || nom;
                    return `${shortName}: ${valeur}`;
                  }}
                >
                  {ventesPackData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.couleur} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [`${value} votes`, 'Votes']}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Top 5 Candidats */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-display text-lg text-foreground mb-4">🏆 Top 5 Candidats</h3>
        {!stats?.top_candidats || stats.top_candidats.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-6">
            Aucun candidat pour l'instant.
          </p>
        ) : (
          <div className="space-y-3">
            {stats.top_candidats.slice(0, 5).map((c, i) => (
              <motion.div 
                key={c.id} 
                className="flex items-center gap-4 p-3 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                  i === 0 ? "gold-gradient text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{c.nom}</p>
                  <p className="text-xs text-muted-foreground">N° {c.numero}</p>
                </div>
                <span className="text-primary font-bold shrink-0">
                  {Number(c.votes_count ?? 0).toLocaleString()} votes
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;