<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vote;
use App\Models\Candidat;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class VoteController extends Controller
{
    // POST /api/votes
    public function store(Request $request)
    {
        $request->validate([
            'candidat_id' => 'required|exists:candidats,id',
            'nombre_votes' => 'required|integer|min:1',
            'telephone' => 'required|string',
            'mode_paiement' => 'required|in:orange,mtn'
        ]);

        $montant = $request->nombre_votes * 100;
        $transactionId = 'TXN-' . strtoupper(Str::random(10));

        // Créer le vote
        $vote = Vote::create([
            'candidat_id' => $request->candidat_id,
            'nombre_votes' => $request->nombre_votes,
            'montant' => $montant,
            'telephone' => $request->telephone,
            'mode_paiement' => $request->mode_paiement,
            'transaction_id' => $transactionId,
            'statut' => 'en_attente'
        ]);

        // TODO: Intégrer API Orange/MTN Money ici
        // Pour l'instant, on simule une URL de paiement
        $paymentUrl = "https://paiement-{$request->mode_paiement}.com/pay?txn={$transactionId}";

        return response()->json([
            'success' => true,
            'data' => [
                'payment_url' => $paymentUrl,
                'transaction_id' => $transactionId
            ],
            'message' => 'Redirection vers paiement'
        ], 201);
    }

    // Webhook pour callback paiement (à implémenter plus tard)
    public function callback(Request $request)
    {
        // TODO: Vérifier signature paiement
        // TODO: Mettre à jour statut vote
        // TODO: Incrémenter votes_count du candidat

        return response()->json(['success' => true]);
    }
}
