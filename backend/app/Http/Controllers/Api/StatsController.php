<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Candidat;
use App\Models\Vote;
use App\Models\Billet;
use Illuminate\Http\Request;

class StatsController extends Controller
{
    // GET /api/stats
    public function index(Request $request)
    {
        $periode = $request->get('periode', '15j');

        // Filtre période
        $jours = match($periode) {
            '7j'  => 7,
            '30j' => 30,
            'all' => null,
            default => 15,
        };

        // ── Évolution des votes par jour ──────────────────────────
        $queryVotes = Vote::where('statut', 'valide');
        if ($jours) {
            $queryVotes->where('created_at', '>=', now()->subDays($jours));
        }
        $evolutionVotes = $queryVotes
            ->selectRaw('DATE(created_at) as date, SUM(nombre_votes) as votes')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn($e) => [
                'jour' => \Carbon\Carbon::parse($e->date)->format('d/m'),
                'votes' => (int) $e->votes,
            ]);

        // ── Heures de pic ─────────────────────────────────────────
        $heuresPic = Vote::where('statut', 'valide')
            ->selectRaw('HOUR(created_at) as heure, SUM(nombre_votes) as votes')
            ->groupBy('heure')
            ->orderBy('heure')
            ->get()
            ->map(fn($e) => [
                'heure' => $e->heure . 'h',
                'votes' => (int) $e->votes,
            ]);

        // ── Répartition des ventes par pack ──────────────────────
        $repartitionPacks = Billet::where('statut_paiement', 'valide')
            ->selectRaw('pack_id, SUM(quantite) as total')
            ->groupBy('pack_id')
            ->with('pack:id,nom')
            ->get()
            ->map(fn($b) => [
                'nom'    => $b->pack->nom ?? 'Inconnu',
                'valeur' => (int) $b->total,
            ]);

        // ── Revenus par jour ──────────────────────────────────────
        $queryRevenus = Billet::where('statut_paiement', 'valide');
        if ($jours) {
            $queryRevenus->where('created_at', '>=', now()->subDays(7));
        }
        $revenusParJour = $queryRevenus
            ->selectRaw('DATE(created_at) as date, SUM(montant_total) as revenus')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn($e) => [
                'jour'    => \Carbon\Carbon::parse($e->date)->format('d/m'),
                'revenus' => (int) $e->revenus,
            ]);

        // ── Totaux généraux ───────────────────────────────────────
        $totalVotes     = Vote::where('statut', 'valide')->sum('nombre_votes');
        $totalCandidats = Candidat::where('statut', 'actif')->count();
        $totalRevenus   = Billet::where('statut_paiement', 'valide')->sum('montant_total');
        $totalBillets   = Billet::where('statut_paiement', 'valide')->sum('quantite');

        return response()->json([
            'success' => true,
            'data' => [
                'totaux' => [
                    'votes'     => (int) $totalVotes,
                    'candidats' => (int) $totalCandidats,
                    'revenus'   => (int) $totalRevenus,
                    'billets'   => (int) $totalBillets,
                ],
                'evolution_votes'   => $evolutionVotes,
                'heures_pic'        => $heuresPic,
                'repartition_packs' => $repartitionPacks,
                'revenus_par_jour'  => $revenusParJour,
            ]
        ]);
    }
}