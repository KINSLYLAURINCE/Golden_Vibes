<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vote;
use App\Models\Candidat;
use App\Services\NotchPayService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class VoteController extends Controller
{
    protected $notchpay;

    public function __construct(NotchPayService $notchpay)
    {
        $this->notchpay = $notchpay;
    }

    public function store(Request $request)
    {
        $request->validate([
            'candidat_id' => 'required|exists:candidats,id',
            'nombre_votes' => 'required|integer|min:1|max:1000',
            'telephone' => 'required|string|regex:/^237[0-9]{9}$/|size:12',
        ]);

        $telephone = preg_replace('/[^0-9]/', '', $request->telephone);

        if (!preg_match('/^237[0-9]{9}$/', $telephone)) {
            return response()->json([
                'success' => false,
                'message' => 'Format de téléphone invalide'
            ], 400);
        }

        $montant = $request->nombre_votes * 100; // ← Remettre à 100 en production !
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

        $payment = $this->notchpay->initiatePayment([
            'transaction_id' => $transactionId,
            'amount' => $montant,
            'phone' => $request->telephone,
            'description' => "Vote pour {$candidat->nom} (N°{$candidat->numero})",
        ]);

        if ($payment && $payment['success']) {
            // ✅ Stocker la référence NotchPay pour vérification ultérieure
            $vote->update(['notchpay_reference' => $payment['reference']]);
            
            return response()->json([
                'success' => true,
                'data' => [
                    'payment_url' => $payment['payment_url'],
                    'transaction_id' => $transactionId,
                    'notchpay_reference' => $payment['reference'],
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
     * ✅ NOUVELLE MÉTHODE : Vérifier le statut d'un vote
     */
    public function checkVote($transaction_id)
    {
        $vote = Vote::where('transaction_id', $transaction_id)->first();

        if (!$vote) {
            return response()->json([
                'success' => false,
                'message' => 'Vote non trouvé'
            ], 404);
        }

        // Si déjà validé, retourner directement
        if ($vote->statut === 'valide') {
            return response()->json([
                'success' => true,
                'data' => [
                    'transaction_id' => $vote->transaction_id,
                    'statut' => $vote->statut,
                    'nombre_votes' => $vote->nombre_votes,
                    'montant' => $vote->montant,
                    'candidat' => $vote->candidat ? [
                        'id' => $vote->candidat->id,
                        'nom' => $vote->candidat->nom,
                        'numero' => $vote->candidat->numero,
                    ] : null
                ]
            ]);
        }

        // ✅ Sinon, vérifier activement auprès de NotchPay
        if ($vote->notchpay_reference) {
            $verification = $this->notchpay->verifyPayment($vote->notchpay_reference);

            Log::info('Vérification active NotchPay', [
                'transaction_id' => $transaction_id,
                'reference' => $vote->notchpay_reference,
                'result' => $verification
            ]);

            if ($verification['success'] && $verification['status'] === 'complete') {
                // ✅ Paiement confirmé ! Mettre à jour
                $vote->update(['statut' => 'valide']);

                $candidat = Candidat::find($vote->candidat_id);
                $candidat->increment('votes_count', $vote->nombre_votes);

                Log::info('✅ Vote validé via vérification active', [
                    'transaction_id' => $transaction_id,
                    'candidat' => $candidat->nom,
                    'votes' => $vote->nombre_votes
                ]);

                return response()->json([
                    'success' => true,
                    'data' => [
                        'transaction_id' => $vote->transaction_id,
                        'statut' => 'valide',
                        'nombre_votes' => $vote->nombre_votes,
                        'montant' => $vote->montant,
                        'candidat' => [
                            'id' => $candidat->id,
                            'nom' => $candidat->nom,
                            'numero' => $candidat->numero,
                        ]
                    ]
                ]);
            }
        }

        // Toujours en attente
        return response()->json([
            'success' => true,
            'data' => [
                'transaction_id' => $vote->transaction_id,
                'statut' => $vote->statut,
                'nombre_votes' => $vote->nombre_votes,
                'montant' => $vote->montant,
            ]
        ]);
    }

    /**
     * Webhook NotchPay (garde quand même pour sécurité)
     */
    public function callbackNotchPay(Request $request)
    {
        Log::info('NotchPay Webhook Vote COMPLET', $request->all());

        $data = $request->input('data');
        
        if (!$data) {
            Log::error('Webhook NotchPay Vote - Pas de données');
            return response()->json(['error' => 'Pas de données'], 400);
        }

        $transactionId = $data['merchant_reference'] ?? $data['trxref'];
        $notchpayRef = $data['reference'];
        $status = $data['status'];
        $event = $request->input('event');

        Log::info('NotchPay Webhook Vote Parsed', [
            'event' => $event,
            'transaction_id' => $transactionId,
            'notchpay_ref' => $notchpayRef,
            'status' => $status
        ]);

        if ($event !== 'payment.complete') {
            return response()->json(['success' => true, 'ignored' => true], 200);
        }

        $vote = Vote::where('transaction_id', $transactionId)->first();

        if (!$vote) {
            Log::error('Vote non trouvé', ['transaction_id' => $transactionId]);
            return response()->json(['error' => 'Vote non trouvé'], 404);
        }

        if ($vote->statut === 'valide') {
            return response()->json(['success' => true, 'already_processed' => true], 200);
        }

        if ($status === 'complete') {
            $vote->update(['statut' => 'valide']);

            $candidat = Candidat::find($vote->candidat_id);
            $candidat->increment('votes_count', $vote->nombre_votes);

            Log::info('✅ Vote validé via WEBHOOK', [
                'transaction_id' => $transactionId,
                'candidat' => $candidat->nom
            ]);

            return response()->json(['success' => true, 'message' => 'Vote validé'], 200);
        }

        return response()->json(['success' => false, 'status' => $status], 200);
    }
}