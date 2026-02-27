/**
 * Tableau de bord administrateur
 * -----------------------------------------
 * Vue d'ensemble avec statistiques en temps réel :
 * candidats, votes, billetterie, messages.
 * Graphiques d'évolution et top candidats.
 */

import { motion } from "framer-motion";
import { Users, Crown, Ticket, MessageSquare, TrendingUp, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

/* Données simulées pour le tableau de bord */
const statsCards = [
  { label: "Total Candidats", value: "8", detail: "5 Miss · 3 Master", icon: Users, couleur: "text-primary" },
  { label: "Total Votes", value: "1 768", detail: "176 800 FCFA collectés", icon: Crown, couleur: "text-primary" },
  { label: "Billets Vendus", value: "237", detail: "1 890 000 FCFA revenus", icon: Ticket, couleur: "text-primary" },
  { label: "Messages", value: "12", detail: "3 non lus", icon: MessageSquare, couleur: "text-destructive" },
  { label: "Votes Aujourd'hui", value: "45", detail: "4 500 FCFA", icon: TrendingUp, couleur: "text-primary" },
  { label: "Revenus Totaux", value: "2 066 800", detail: "Votes + Billets", icon: DollarSign, couleur: "text-primary" },
];

/* Top 5 des candidats */
const topCandidats = [
  { nom: "Fotso Mireille", votes: 312, categorie: "Miss" },
  { nom: "Tchamba Kevin", votes: 278, categorie: "Master" },
  { nom: "Nguemo Tatiana", votes: 245, categorie: "Miss" },
  { nom: "Djomo Patrick", votes: 223, categorie: "Master" },
  { nom: "Nkwenti Divine", votes: 198, categorie: "Miss" },
];

/* Données pour le graphique d'évolution des votes */
const evolutionVotes = [
  { jour: "Lun", votes: 45 },
  { jour: "Mar", votes: 78 },
  { jour: "Mer", votes: 62 },
  { jour: "Jeu", votes: 95 },
  { jour: "Ven", votes: 120 },
  { jour: "Sam", votes: 88 },
  { jour: "Dim", votes: 56 },
];

/* Données pour le camembert des packs */
const ventesParPack = [
  { nom: "VIP", valeur: 38, couleur: "#FFD700" },
  { nom: "Gold", valeur: 67, couleur: "#B8860B" },
  { nom: "Standard", valeur: 120, couleur: "#666" },
  { nom: "Groupe", valeur: 12, couleur: "#444" },
];

const Dashboard = () => {
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
          <h3 className="font-display text-lg text-foreground mb-4">Évolution des Votes (7 jours)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={evolutionVotes}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 20%)" />
              <XAxis dataKey="jour" stroke="hsl(0 0% 60%)" fontSize={12} />
              <YAxis stroke="hsl(0 0% 60%)" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(0 0% 8%)", border: "1px solid hsl(43 30% 20%)", borderRadius: "8px" }}
                labelStyle={{ color: "hsl(0 0% 95%)" }}
              />
              <Bar dataKey="votes" fill="hsl(43 72% 55%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Ventes par pack */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-display text-lg text-foreground mb-4">Ventes par Pack</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={ventesParPack}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="valeur"
                nameKey="nom"
                label={({ nom, valeur }) => `${nom}: ${valeur}`}
              >
                {ventesParPack.map((entry, index) => (
                  <Cell key={index} fill={entry.couleur} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top 5 Candidats */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-display text-lg text-foreground mb-4">🏆 Top 5 Candidats</h3>
        <div className="space-y-3">
          {topCandidats.map((c, i) => (
            <div key={c.nom} className="flex items-center gap-4 p-3 bg-secondary rounded-lg">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                i === 0 ? "gold-gradient text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {i + 1}
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{c.nom}</p>
                <p className="text-xs text-muted-foreground">{c.categorie}</p>
              </div>
              <span className="text-primary font-bold">{c.votes} votes</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
