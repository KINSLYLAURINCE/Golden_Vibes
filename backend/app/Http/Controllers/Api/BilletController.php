<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Billet;
use App\Models\Pack;
use App\Services\NotchPayService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class BilletController extends Controller
{
    protected $notchpay;

    public function __construct(NotchPayService $notchpay)
    {
        $this->notchpay = $notchpay;
    }

    /**
     * Acheter un billet
     * POST /api/billets
     */
    public function store(Request $request)
    {
        $request->validate([
            'pack_id' => 'required|exists:packs,id',
            'quantite' => 'required|integer|min:1',
            'nom' => 'required|string',
            'email' => 'required|email',
            'telephone' => 'required|string|regex:/^237[0-9]{9}$/',
        ]);

        $pack = Pack::findOrFail($request->pack_id);

        // Vérifier disponibilité
        $placesRestantes = $pack->places_disponibles - $pack->places_vendues;
        if ($request->quantite > $placesRestantes) {
            return response()->json([
                'success' => false,
                'message' => "Seulement {$placesRestantes} places disponibles"
            ], 400);
        }

        $montantTotal = $pack->prix * $request->quantite;
        $transactionId = 'BILLET-' . strtoupper(Str::random(12));
        $qrCode = 'QR-' . strtoupper(Str::random(15));

        // Créer le billet
        $billet = Billet::create([
            'pack_id' => $request->pack_id,
            'nom_client' => $request->nom,
            'email' => $request->email,
            'telephone' => $request->telephone,
            'quantite' => $request->quantite,
            'montant_total' => $montantTotal,
            'mode_paiement' => 'notchpay',
            'transaction_id' => $transactionId,
            'qr_code' => $qrCode,
            'statut_paiement' => 'en_attente'
        ]);

        // Initier paiement NotchPay
        $payment = $this->notchpay->initiatePayment([
            'transaction_id' => $transactionId,
            'amount' => $montantTotal,
            'phone' => $request->telephone,
            'email' => $request->email,
            'description' => "Billet {$pack->nom} x{$request->quantite}",
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

        $billet->update(['statut_paiement' => 'echoue']);

        return response()->json([
            'success' => false,
            'message' => 'Erreur initialisation paiement'
        ], 500);
    }

    /**
     * Webhook NotchPay pour billets
     * POST /api/billets/callback/notchpay
     */
    public function callbackNotchPay(Request $request)
    {
        Log::info('NotchPay Webhook Billet', $request->all());

        $reference = $request->input('reference');
        $transactionId = $request->input('transaction.reference');

        $verification = $this->notchpay->verifyPayment($reference);

        if (!$verification) {
            return response()->json(['error' => 'Vérification impossible'], 500);
        }

        $billet = Billet::where('transaction_id', $transactionId)->first();

        if (!$billet) {
            return response()->json(['error' => 'Billet non trouvé'], 404);
        }

        if ($verification['status'] === 'complete') {
            // ✅ PAIEMENT VALIDÉ
            $billet->update([
                'statut_paiement' => 'valide',
                'statut_billet' => 'valide'
            ]);

            // Incrémenter places vendues
            $pack = Pack::find($billet->pack_id);
            $pack->increment('places_vendues', $billet->quantite);

            // TODO: Envoyer email avec QR code

            Log::info('Billet validé', ['transaction' => $transactionId]);

            return response()->json(['success' => true]);
        }

        if ($verification['status'] === 'failed') {
            $billet->update(['statut_paiement' => 'echoue']);
        }

        return response()->json(['success' => false]);
    }
}