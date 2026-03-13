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
            'quantite' => 'required|integer|min:1|max:10',
            'nom' => 'required|string|min:2|max:100',
            'email' => 'required|email|max:150',
            'telephone' => 'required|string|regex:/^237[0-9]{9}$/|size:12',
        ]);

        // Nettoyer le téléphone
        $telephone = preg_replace('/[^0-9]/', '', $request->telephone);

        if (!preg_match('/^237[0-9]{9}$/', $telephone)) {
            return response()->json([
                'success' => false,
                'message' => 'Format de téléphone invalide. Utilisez : 237XXXXXXXXX'
            ], 400);
        }

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
            // ✅ Stocker la référence NotchPay pour vérification ultérieure
            $billet->update(['notchpay_reference' => $payment['reference']]);

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

        $billet->update(['statut_paiement' => 'echoue']);

        return response()->json([
            'success' => false,
            'message' => 'Erreur initialisation paiement',
            'error' => $payment['error'] ?? 'Erreur inconnue'
        ], 500);
    }

    /**
     * ✅ NOUVELLE MÉTHODE : Vérifier le statut d'un billet
     */
    public function checkBillet($transaction_id)
    {
        $billet = Billet::where('transaction_id', $transaction_id)->first();

        if (!$billet) {
            return response()->json([
                'success' => false,
                'message' => 'Billet non trouvé'
            ], 404);
        }

        // Si déjà validé, retourner directement
        if ($billet->statut_paiement === 'valide') {
            return response()->json([
                'success' => true,
                'data' => [
                    'transaction_id' => $billet->transaction_id,
                    'statut' => $billet->statut_paiement,
                    'qr_code' => $billet->qr_code,
                    'quantite' => $billet->quantite,
                    'montant_total' => $billet->montant_total,
                    'pack' => $billet->pack ? [
                        'id' => $billet->pack->id,
                        'nom' => $billet->pack->nom,
                        'prix' => $billet->pack->prix,
                    ] : null
                ]
            ]);
        }

        // ✅ Sinon, vérifier activement auprès de NotchPay
        if ($billet->notchpay_reference) {
            $verification = $this->notchpay->verifyPayment($billet->notchpay_reference);

            Log::info('Vérification active NotchPay Billet', [
                'transaction_id' => $transaction_id,
                'reference' => $billet->notchpay_reference,
                'result' => $verification
            ]);

            if ($verification['success'] && $verification['status'] === 'complete') {
                // ✅ Paiement confirmé ! Mettre à jour
                $billet->update([
                    'statut_paiement' => 'valide',
                    'statut_billet' => 'valide'
                ]);

                // Envoyer email
                $this->sendBilletEmailSimple($billet);

                // Incrémenter places vendues
                $pack = Pack::find($billet->pack_id);
                $pack->increment('places_vendues', $billet->quantite);

                Log::info('✅ Billet validé via vérification active', [
                    'transaction_id' => $transaction_id,
                    'pack' => $pack->nom,
                    'qr_code' => $billet->qr_code
                ]);

                return response()->json([
                    'success' => true,
                    'data' => [
                        'transaction_id' => $billet->transaction_id,
                        'statut' => 'valide',
                        'qr_code' => $billet->qr_code,
                        'quantite' => $billet->quantite,
                        'montant_total' => $billet->montant_total,
                        'pack' => [
                            'id' => $pack->id,
                            'nom' => $pack->nom,
                            'prix' => $pack->prix,
                        ]
                    ]
                ]);
            }
        }

        // Toujours en attente
        return response()->json([
            'success' => true,
            'data' => [
                'transaction_id' => $billet->transaction_id,
                'statut' => $billet->statut_paiement,
                'quantite' => $billet->quantite,
                'montant_total' => $billet->montant_total,
            ]
        ]);
    }

    /**
     * Webhook NotchPay pour billets
     * POST /api/billets/callback/notchpay
     */
    public function callbackNotchPay(Request $request)
    {
        Log::info('NotchPay Webhook Billet COMPLET', $request->all());

        $data = $request->input('data');
        
        if (!$data) {
            Log::error('Webhook NotchPay Billet - Pas de données');
            return response()->json(['error' => 'Pas de données'], 400);
        }

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

        if ($event !== 'payment.complete') {
            Log::info('Event ignoré (pas complete)', ['event' => $event]);
            return response()->json(['success' => true, 'ignored' => true], 200);
        }

        $billet = Billet::where('transaction_id', $transactionId)->first();

        if (!$billet) {
            Log::error('Billet non trouvé', ['transaction_id' => $transactionId]);
            return response()->json(['error' => 'Billet non trouvé'], 404);
        }

        if ($billet->statut_paiement === 'valide') {
            Log::warning('Billet déjà validé', ['transaction_id' => $transactionId]);
            return response()->json(['success' => true, 'already_processed' => true], 200);
        }

        if ($status === 'complete') {
            $billet->update([
                'statut_paiement' => 'valide',
                'statut_billet' => 'valide'
            ]);

            // Envoyer email
            $this->sendBilletEmailSimple($billet);

            // Incrémenter places vendues
            $pack = Pack::find($billet->pack_id);
            $pack->increment('places_vendues', $billet->quantite);

            Log::info('✅ Billet validé via WEBHOOK', [
                'transaction_id' => $transactionId,
                'pack' => $pack->nom,
                'qr_code' => $billet->qr_code
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
            $billet->load('pack');
            Mail::to($billet->email)->send(new BilletConfirmation($billet));

            Log::info('✅ Email billet envoyé', [
                'email' => $billet->email,
                'code' => $billet->qr_code,
                'pack' => $billet->pack->nom,
            ]);

        } catch (\Exception $e) {
            Log::error('❌ Erreur envoi email billet', [
                'billet_id' => $billet->id,
                'email' => $billet->email,
                'error' => $e->getMessage()
            ]);
        }
    }
}