<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Candidat;
use Illuminate\Http\Request;

class CandidatController extends Controller
{
    // GET /api/candidats
    public function index(Request $request)
    {
        // Charger les candidats avec le comptage des votes validés uniquement
        $query = Candidat::where('statut', 'actif')
            ->withCount(['votes' => function($q) {
                $q->where('statut', 'valide');
            }]);

        // Filtre par catégorie
        if ($request->has('categorie')) {
            $query->where('categorie', $request->categorie);
        }

        // Recherche
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                  ->orWhere('numero', 'like', "%{$search}%");
            });
        }

        // Tri
        $sortBy = $request->get('sort', 'numero');
        $order = $request->get('order', 'asc');
        
        // Si on trie par votes, utiliser votes_count
        if ($sortBy === 'votes') {
            $query->orderBy('votes_count', $order);
        } else {
            $query->orderBy($sortBy, $order);
        }

        $candidats = $query->get();

        return response()->json([
            'success' => true,
            'data' => $candidats
        ]);
    }

    // GET /api/candidats/{id}
    public function show($id)
    {
        $candidat = Candidat::withCount(['votes' => function($q) {
            $q->where('statut', 'valide');
        }])->find($id);

        if (!$candidat) {
            return response()->json([
                'success' => false,
                'message' => 'Candidat non trouvé'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $candidat
        ]);
    }

    // GET /api/candidats/{id}/votes
    public function votes($id)
    {
        $candidat = Candidat::with(['votes' => function($q) {
            $q->where('statut', 'valide')
              ->orderBy('created_at', 'desc');
        }])
        ->withCount(['votes' => function($q) {
            $q->where('statut', 'valide');
        }])
        ->find($id);

        if (!$candidat) {
            return response()->json([
                'success' => false,
                'message' => 'Candidat non trouvé'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'total_votes' => $candidat->votes_count,
                'montant_total' => $candidat->votes_count * 100, // 100 FCFA par vote
                'historique' => $candidat->votes
            ]
        ]);
    }
}