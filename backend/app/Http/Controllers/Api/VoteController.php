<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vote;
use App\Models\Candidat;
use App\Services\NotchPayService; // ← CHANGÉ
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class VoteController extends Controller
{
    protected $notchpay; // ← CHANGÉ

    public function __construct(NotchPayService $notchpay) // ← CHANGÉ
    {
        $this->notchpay = $notchpay; // ← CHANGÉ
    }

    public function store(Request $request)
    {
        $request->validate([
            'candidat_id' => 'required|exists:candidats,id',
            'nombre_votes' => 'required|integer|min:1',
            'telephone' => 'required|string|regex:/^237[0-9]{9}$/',
        ]);

        $montant = $request->nombre_votes * 100;
        $transactionId = 'VOTE-' . strtoupper(Str::random(12));
        $candidat = Candidat::findOrFail($request->candidat_id);

        $vote = Vote::create([
            'candidat_id' => $request->candidat_id,
            'nombre_votes' => $request->nombre_votes,
            'montant' => $montant,
            'telephone' => $request->telephone,
            'mode_paiement' => 'notchpay',
            'transaction_id' => $transactionId,
            'statut' => 'en_attente'
        ]);

        // Initier paiement NotchPay
        $payment = $this->notchpay->initiatePayment([
            'transaction_id' => $transactionId,
            'amount' => $montant,
            'phone' => $request->telephone,
            'description' => "Vote pour {$candidat->nom} (N°{$candidat->numero})",
        ]);

        if ($payment && $payment['success']) {
            return response()->json([
                'success' => true,
                'data' => [
                    'payment_url' => $payment['payment_url'],
                    'transaction_id' => $transactionId,
                ],
                'message' => 'Redirection vers paiement'
            ], 201);
        }

        $vote->update(['statut' => 'echoue']);

        return response()->json([
            'success' => false,
            'message' => 'Erreur initialisation paiement',
            'error' => $payment['error'] ?? 'Erreur inconnue'
        ], 500);
    }

    /**
     * Webhook NotchPay
     */
    public function callbackNotchPay(Request $request)
    {
        Log::info('NotchPay Webhook', $request->all());

        $reference = $request->input('reference');
        $status = $request->input('status'); // complete, failed, pending
        $transactionId = $request->input('transaction.reference'); // Notre ID

        // Vérifier avec l'API NotchPay (double check sécurité)
        $verification = $this->notchpay->verifyPayment($reference);

        if (!$verification) {
            return response()->json(['error' => 'Vérification impossible'], 500);
        }

        $vote = Vote::where('transaction_id', $transactionId)->first();

        if (!$vote) {
            return response()->json(['error' => 'Vote non trouvé'], 404);
        }

        if ($verification['status'] === 'complete') {
            // ✅ PAIEMENT VALIDÉ
            $vote->update(['statut' => 'valide']);

            $candidat = Candidat::find($vote->candidat_id);
            $candidat->increment('votes_count', $vote->nombre_votes);

            Log::info('Vote validé', ['transaction' => $transactionId]);

            return response()->json(['success' => true]);
        }

        if ($verification['status'] === 'failed') {
            // ❌ PAIEMENT ÉCHOUÉ
            $vote->update(['statut' => 'echoue']);
        }

        return response()->json(['success' => false]);
    }
}