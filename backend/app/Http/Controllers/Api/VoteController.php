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

        $montant = $request->nombre_votes * 105;
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
     * Webhook NotchPay pour votes
     */
    public function callbackNotchPay(Request $request)
    {
        Log::info('NotchPay Webhook Vote COMPLET', $request->all());

        // NotchPay envoie directement dans "data", pas "payload.data"
        $data = $request->input('data');
        
        if (!$data) {
            Log::error('Webhook NotchPay Vote - Pas de données');
            return response()->json(['error' => 'Pas de données'], 400);
        }

        // Récupérer les infos
        $transactionId = $data['merchant_reference'] ?? $data['trxref'];
        $notchpayRef = $data['reference'];
        $status = $data['status'];
        $event = $request->input('event'); // payment.complete, payment.created, etc

        Log::info('NotchPay Webhook Vote Parsed', [
            'event' => $event,
            'transaction_id' => $transactionId,
            'notchpay_ref' => $notchpayRef,
            'status' => $status
        ]);

        // On traite UNIQUEMENT les événements "complete"
        if ($event !== 'payment.complete') {
            Log::info('Event ignoré (pas complete)', ['event' => $event]);
            return response()->json(['success' => true, 'ignored' => true], 200);
        }

        // Chercher le vote
        $vote = Vote::where('transaction_id', $transactionId)->first();

        if (!$vote) {
            Log::error('Vote non trouvé', ['transaction_id' => $transactionId]);
            return response()->json(['error' => 'Vote non trouvé'], 404);
        }

        // Vérifier si déjà validé (éviter double traitement)
        if ($vote->statut === 'valide') {
            Log::warning('Vote déjà validé', ['transaction_id' => $transactionId]);
            return response()->json(['success' => true, 'already_processed' => true], 200);
        }

        // Vérifier le statut
        if ($status === 'complete') {
            // ✅ PAIEMENT VALIDÉ
            
            $vote->update(['statut' => 'valide']);

            $candidat = Candidat::find($vote->candidat_id);
            $candidat->increment('votes_count', $vote->nombre_votes);

            Log::info('✅ Vote validé PRODUCTION', [
                'transaction_id' => $transactionId,
                'candidat' => $candidat->nom,
                'votes' => $vote->nombre_votes,
                'nouveau_total' => $candidat->votes_count
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Vote validé'
            ], 200);
        }

        return response()->json(['success' => false, 'status' => $status], 200);
    }
    
}