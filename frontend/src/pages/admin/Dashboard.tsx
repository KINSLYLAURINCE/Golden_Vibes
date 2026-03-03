/**
 * Tableau de bord administrateur
 * -----------------------------------------
 * Vue d'ensemble avec statistiques en temps réel :
 * candidats, votes, billetterie, messages.
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Crown, Ticket, MessageSquare, TrendingUp, DollarSign, Loader2 } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import axios from "axios";

const API_URL = "http://localhost:8000/api";

const COLORS_PIE = ["#FFD700", "#B8860B", "#666", "#444", "#333"];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [statsVotes, setStatsVotes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [periode, setPeriode] = useState("7j");

  const token = localStorage.getItem("token");
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };

  /* Charger les stats principales */
  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/stats`, axiosConfig);
      setStats(response.data.data || response.data);
    } catch (err) {
      console.error("Erreur stats:", err);
    }
  };

  /* Charger les stats votes */
  const fetchStatsVotes = async (p = periode) => {
    try {
      const response = await axios.get(`${API_URL}/admin/stats/votes?periode=${p}`, axiosConfig);
      setStatsVotes(response.data.data || response.data);
    } catch (err) {
      console.error("Erreur stats votes:", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchStatsVotes()]);
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    fetchStatsVotes(periode);
  }, [periode]);

  /* Formatter l'évolution pour le graphique */
  const evolutionData = statsVotes?.evolution?.map((e) => ({
    jour: new Date(e.date).toLocaleDateString("fr-FR", { weekday: "short" }),
    votes: e.votes,
  })) || [];

  /* Formatter les packs pour le camembert */
  const ventesPackData = statsVotes?.par_candidat?.slice(0, 5).map((c, i) => ({
    nom: c.nom,
    valeur: c.total_votes || 0,
    couleur: COLORS_PIE[i],
  })) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={40} className="animate-spin text-primary" />
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
      couleur: stats?.messages_non_lus > 0 ? "text-destructive" : "text-primary",
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
    <div>
      <h1 className="font-display text-3xl gold-text mb-2">Tableau de Bord</h1>
      <p className="text-muted-foreground mb-8">Vue d'ensemble de Golden Vibes Events</p>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statsCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="bg-card border border-border rounded-xl p-5 flex items-start gap-4"
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
              {["7j", "30j", "all"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriode(p)}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                    periode === p
                      ? "border-primary bg-primary/20 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {p === "all" ? "Tout" : p}
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
                <XAxis dataKey="jour" stroke="hsl(0 0% 60%)" fontSize={12} />
                <YAxis stroke="hsl(0 0% 60%)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(0 0% 8%)",
                    border: "1px solid hsl(43 30% 20%)",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "hsl(0 0% 95%)" }}
                />
                <Bar dataKey="votes" fill="hsl(43 72% 55%)" radius={[4, 4, 0, 0]} />
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
                  label={({ nom, valeur }) => `${nom.split(" ")[0]}: ${valeur}`}
                >
                  {ventesPackData.map((entry, index) => (
                    <Cell key={index} fill={entry.couleur} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Top 5 Candidats */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-display text-lg text-foreground mb-4">🏆 Top 5 Candidats</h3>
        {!stats?.top_candidats || stats.top_candidats.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-6">Aucun candidat pour l'instant.</p>
        ) : (
          <div className="space-y-3">
            {stats.top_candidats.map((c, i) => (
              <div key={c.id} className="flex items-center gap-4 p-3 bg-secondary rounded-lg">
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;