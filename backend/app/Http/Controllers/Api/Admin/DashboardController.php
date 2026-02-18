<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Candidat;
use App\Models\Vote;
use App\Models\Billet;
use App\Models\Message;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    // GET /api/admin/stats
    public function stats()
    {
        $totalCandidats = Candidat::count();
        $totalCandidatsMiss = Candidat::where('categorie', 'miss')->count();
        $totalCandidatsMaster = Candidat::where('categorie', 'master')->count();

        $totalVotes = Vote::where('statut', 'valide')->sum('nombre_votes');
        $montantVotes = Vote::where('statut', 'valide')->sum('montant');

        $billetsVendus = Billet::where('statut_paiement', 'valide')->sum('quantite');
        $revenusBillets = Billet::where('statut_paiement', 'valide')->sum('montant_total');

        $messagesNonLus = Message::where('statut', 'non_lu')->count();

        // Top 5 candidats
        $topCandidats = Candidat::orderBy('votes_count', 'desc')
            ->take(5)
            ->get(['id', 'nom', 'numero', 'votes_count']);

        return response()->json([
            'success' => true,
            'data' => [
                'total_candidats' => $totalCandidats,
                'total_candidats_miss' => $totalCandidatsMiss,
                'total_candidats_master' => $totalCandidatsMaster,
                'total_votes' => $totalVotes,
                'montant_votes' => $montantVotes,
                'billets_vendus' => $billetsVendus,
                'revenus_billets' => $revenusBillets,
                'messages_non_lus' => $messagesNonLus,
                'top_candidats' => $topCandidats
            ]
        ]);
    }

    // GET /api/admin/stats/votes?periode=7j|30j|all
    public function statsVotes(Request $request)
    {
        $periode = $request->get('periode', '7j');

        $query = Vote::where('statut', 'valide');

        // Filtre par période
        if ($periode == '7j') {
            $query->where('created_at', '>=', now()->subDays(7));
        } elseif ($periode == '30j') {
            $query->where('created_at', '>=', now()->subDays(30));
        }

        // Évolution par jour
        $evolution = $query->selectRaw('DATE(created_at) as date, SUM(nombre_votes) as votes')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Par candidat
        $parCandidat = Candidat::withCount(['votes as total_votes' => function($q) {
            $q->where('statut', 'valide');
        }])
        ->orderBy('total_votes', 'desc')
        ->get(['id', 'nom', 'numero', 'total_votes']);

        return response()->json([
            'success' => true,
            'data' => [
                'evolution' => $evolution,
                'par_candidat' => $parCandidat
            ]
        ]);
    }
}
