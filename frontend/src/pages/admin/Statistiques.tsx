/**
 * Page Statistiques (Admin)
 * -----------------------------------------
 * Graphiques détaillés : évolution des votes,
 * répartition des ventes, heures de pic, revenus.
 */

import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import { Loader2 } from "lucide-react";
import axios from "axios";

// ✅ Import depuis @/services/api
import { API_URL } from "@/services/api";

const COLORS_PIE = ["#FFD700", "#B8860B", "#888888", "#555555", "#333333"];

const tooltipStyle = {
  backgroundColor: "hsl(0 0% 8%)",
  border: "1px solid hsl(43 30% 20%)",
  borderRadius: "8px",
};

const Statistiques = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [periode, setPeriode] = useState("15j");

  const token = localStorage.getItem("token");
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };

  const fetchStats = async (p = periode) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/stats?periode=${p}`,
        axiosConfig
      );
      setData(response.data.data || response.data);
    } catch (err) {
      console.error("Erreur stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchStats(periode);
  }, [periode]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={40} className="animate-spin text-primary" />
      </div>
    );
  }

  const evolutionVotes   = data?.evolution_votes   || [];
  const heuresPic        = data?.heures_pic        || [];
  const repartitionPacks = data?.repartition_packs || [];
  const revenusParJour   = data?.revenus_par_jour  || [];
  const totaux           = data?.totaux            || {};

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-display text-3xl gold-text">Statistiques</h1>
        {/* Filtre période */}
        <div className="flex gap-1">
          {["7j", "15j", "30j", "all"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriode(p)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
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
      <p className="text-muted-foreground text-sm mb-6">Analyses détaillées de l'événement</p>

      {/* Cartes totaux */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Votes", value: Number(totaux.votes ?? 0).toLocaleString() },
          { label: "Candidats Actifs", value: totaux.candidats ?? 0 },
          { label: "Billets Vendus", value: Number(totaux.billets ?? 0).toLocaleString() },
          { label: "Revenus Totaux", value: `${Number(totaux.revenus ?? 0).toLocaleString()} FCFA` },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{s.label}</p>
            <p className="text-xl font-bold text-primary">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Évolution des votes */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-display text-lg text-foreground mb-4">
            📊 Évolution des Votes
          </h3>
          {evolutionVotes.length === 0 ? (
            <div className="flex items-center justify-center h-[280px] text-muted-foreground text-sm">
              Aucune donnée disponible
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={evolutionVotes}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 20%)" />
                <XAxis dataKey="jour" stroke="hsl(0 0% 60%)" fontSize={11} />
                <YAxis stroke="hsl(0 0% 60%)" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="votes"
                  stroke="hsl(43 72% 55%)"
                  fill="hsl(43 72% 55% / 0.2)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Heures de pic */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-display text-lg text-foreground mb-4">
            🕐 Heures de Pic
          </h3>
          {heuresPic.length === 0 ? (
            <div className="flex items-center justify-center h-[280px] text-muted-foreground text-sm">
              Aucune donnée disponible
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={heuresPic}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 20%)" />
                <XAxis dataKey="heure" stroke="hsl(0 0% 60%)" fontSize={11} />
                <YAxis stroke="hsl(0 0% 60%)" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="votes" fill="hsl(43 72% 55%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Répartition des ventes par pack */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-display text-lg text-foreground mb-4">
            🎫 Répartition des Ventes par Pack
          </h3>
          {repartitionPacks.length === 0 ? (
            <div className="flex items-center justify-center h-[280px] text-muted-foreground text-sm">
              Aucune donnée disponible
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={repartitionPacks}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="valeur"
                  nameKey="nom"
                  label={({ nom, valeur }) => `${nom}: ${valeur}`}
                >
                  {repartitionPacks.map((entry, i) => (
                    <Cell key={i} fill={COLORS_PIE[i % COLORS_PIE.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Revenus par jour */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-display text-lg text-foreground mb-4">
            💰 Revenus (7 derniers jours)
          </h3>
          {revenusParJour.length === 0 ? (
            <div className="flex items-center justify-center h-[280px] text-muted-foreground text-sm">
              Aucune donnée disponible
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={revenusParJour}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 20%)" />
                <XAxis dataKey="jour" stroke="hsl(0 0% 60%)" fontSize={11} />
                <YAxis
                  stroke="hsl(0 0% 60%)"
                  fontSize={11}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => [`${Number(value).toLocaleString()} FCFA`, "Revenus"]}
                />
                <Line
                  type="monotone"
                  dataKey="revenus"
                  stroke="hsl(43 72% 55%)"
                  strokeWidth={2}
                  dot={{ fill: "hsl(43 72% 55%)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

      </div>
    </div>
  );
};

export default Statistiques;