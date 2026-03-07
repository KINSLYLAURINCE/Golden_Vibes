<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Billet;
use App\Models\Pack;
use App\Services\NotchPayService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\BilletConfirmation;

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
        Log::info('NotchPay Webhook Billet COMPLET', $request->all());

        // NotchPay envoie directement dans "data"
        $data = $request->input('data');
        
        if (!$data) {
            Log::error('Webhook NotchPay Billet - Pas de données');
            return response()->json(['error' => 'Pas de données'], 400);
        }

        // Récupérer les infos
        $transactionId = $data['merchant_reference'] ?? $data['trxref'];
        $notchpayRef = $data['reference'];
        $status = $data['status'];
        $event = $request->input('event');

        Log::info('NotchPay Webhook Billet Parsed', [
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

        // Chercher le billet
        $billet = Billet::where('transaction_id', $transactionId)->first();

        if (!$billet) {
            Log::error('Billet non trouvé', ['transaction_id' => $transactionId]);
            return response()->json(['error' => 'Billet non trouvé'], 404);
        }

        // Vérifier si déjà validé
        if ($billet->statut_paiement === 'valide') {
            Log::warning('Billet déjà validé', ['transaction_id' => $transactionId]);
            return response()->json(['success' => true, 'already_processed' => true], 200);
        }

        // Vérifier le statut
        if ($status === 'complete') {
            // ✅ PAIEMENT VALIDÉ

            
            $billet->update([
                'statut_paiement' => 'valide',
                'statut_billet' => 'valide'
            ]);

            // Envoyer email
            $this->sendBilletEmailSimple($billet);

            // Incrémenter places vendues
            $pack = Pack::find($billet->pack_id);
            $pack->increment('places_vendues', $billet->quantite);

            Log::info('✅ Billet validé PRODUCTION', [
                'transaction_id' => $transactionId,
                'pack' => $pack->nom
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Billet validé'
            ], 200);
        }

        return response()->json(['success' => false, 'status' => $status], 200);
    }

    /**
     * Envoyer email avec code billet
     */
    private function sendBilletEmailSimple($billet)
    {
        try {
            // Charger la relation pack
            $billet->load('pack');

            // Envoyer l'email
            Mail::to($billet->email)->send(new BilletConfirmation($billet));

            Log::info('Email billet envoyé', [
                'email' => $billet->email,
                'code' => $billet->qr_code,
                'pack' => $billet->pack->nom,
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur envoi email billet', [
                'billet_id' => $billet->id,
                'email' => $billet->email,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Envoyer email avec code billet
     */
    private function sendBilletEmailSimple($billet)
    {
        try {
            // Charger la relation pack
            $billet->load('pack');

            // Envoyer l'email
            Mail::to($billet->email)->send(new BilletConfirmation($billet));

            Log::info('Email billet envoyé', [
                'email' => $billet->email,
                'code' => $billet->qr_code,
                'pack' => $billet->pack->nom,
            ]);

        } catch (\Exception $e) {
            Log::error('Erreur envoi email billet', [
                'billet_id' => $billet->id,
                'email' => $billet->email,
                'error' => $e->getMessage()
            ]);
        }
    }
}