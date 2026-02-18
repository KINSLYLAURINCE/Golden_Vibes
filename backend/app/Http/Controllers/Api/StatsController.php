<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Candidat;
use App\Models\Vote;

class StatsController extends Controller
{
    // GET /api/stats
    public function index()
    {
        $totalVotes = Vote::where('statut', 'valide')->sum('nombre_votes');
        $totalCandidats = Candidat::where('statut', 'actif')->count();

        return response()->json([
            'success' => true,
            'data' => [
                'total_votes' => $totalVotes,
                'total_candidats' => $totalCandidats
            ]
        ]);
    }
}
