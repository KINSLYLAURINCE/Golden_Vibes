/**
 * Page Statistiques (Admin)
 * -----------------------------------------
 * Graphiques détaillés : évolution des votes,
 * répartition des ventes, heures de pic, etc.
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts";

/* Données simulées */
const votesParJour = [
  { jour: "01/03", votes: 23 }, { jour: "02/03", votes: 45 }, { jour: "03/03", votes: 38 },
  { jour: "04/03", votes: 67 }, { jour: "05/03", votes: 89 }, { jour: "06/03", votes: 72 },
  { jour: "07/03", votes: 95 }, { jour: "08/03", votes: 110 }, { jour: "09/03", votes: 85 },
  { jour: "10/03", votes: 130 }, { jour: "11/03", votes: 98 }, { jour: "12/03", votes: 145 },
  { jour: "13/03", votes: 112 }, { jour: "14/03", votes: 158 }, { jour: "15/03", votes: 101 },
];

const heuresPic = [
  { heure: "8h", votes: 12 }, { heure: "10h", votes: 35 }, { heure: "12h", votes: 78 },
  { heure: "14h", votes: 45 }, { heure: "16h", votes: 56 }, { heure: "18h", votes: 89 },
  { heure: "20h", votes: 120 }, { heure: "22h", votes: 95 },
];

const repartitionPacks = [
  { nom: "VIP", valeur: 38, couleur: "#FFD700" },
  { nom: "Gold", valeur: 67, couleur: "#B8860B" },
  { nom: "Standard", valeur: 120, couleur: "#888" },
  { nom: "Groupe", valeur: 12, couleur: "#555" },
];

const revenusParJour = [
  { jour: "01/03", revenus: 45000 }, { jour: "02/03", revenus: 78000 }, { jour: "03/03", revenus: 56000 },
  { jour: "04/03", revenus: 120000 }, { jour: "05/03", revenus: 89000 }, { jour: "06/03", revenus: 145000 },
  { jour: "07/03", revenus: 110000 },
];

const tooltipStyle = {
  backgroundColor: "hsl(0 0% 8%)",
  border: "1px solid hsl(43 30% 20%)",
  borderRadius: "8px",
};

const Statistiques = () => (
  <div>
    <h1 className="font-display text-3xl gold-text mb-2">Statistiques</h1>
    <p className="text-muted-foreground text-sm mb-8">Analyses détaillées de l'événement</p>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Évolution des votes */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-display text-lg text-foreground mb-4">📊 Évolution des Votes (15 jours)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={votesParJour}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 20%)" />
            <XAxis dataKey="jour" stroke="hsl(0 0% 60%)" fontSize={11} />
            <YAxis stroke="hsl(0 0% 60%)" fontSize={11} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="votes" stroke="hsl(43 72% 55%)" fill="hsl(43 72% 55% / 0.2)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Heures de pic */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-display text-lg text-foreground mb-4">🕐 Heures de Pic</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={heuresPic}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 20%)" />
            <XAxis dataKey="heure" stroke="hsl(0 0% 60%)" fontSize={11} />
            <YAxis stroke="hsl(0 0% 60%)" fontSize={11} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="votes" fill="hsl(43 72% 55%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Répartition des ventes par pack */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-display text-lg text-foreground mb-4">🎫 Répartition des Ventes</h3>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={repartitionPacks} cx="50%" cy="50%" outerRadius={100} dataKey="valeur" nameKey="nom" label={({ nom, valeur }) => `${nom}: ${valeur}`}>
              {repartitionPacks.map((entry, i) => <Cell key={i} fill={entry.couleur} />)}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Revenus */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-display text-lg text-foreground mb-4">💰 Revenus (7 jours)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={revenusParJour}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 20%)" />
            <XAxis dataKey="jour" stroke="hsl(0 0% 60%)" fontSize={11} />
            <YAxis stroke="hsl(0 0% 60%)" fontSize={11} tickFormatter={(v) => `${v / 1000}k`} />
            <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value.toLocaleString()} FCFA`, "Revenus"]} />
            <Line type="monotone" dataKey="revenus" stroke="hsl(43 72% 55%)" strokeWidth={2} dot={{ fill: "hsl(43 72% 55%)" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

export default Statistiques;
