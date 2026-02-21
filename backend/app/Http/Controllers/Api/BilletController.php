<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Billet;
use App\Models\Pack;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BilletController extends Controller
{
    // POST /api/billets
    public function store(Request $request)
    {
        $request->validate([
            'pack_id' => 'required|exists:packs,id',
            'quantite' => 'required|integer|min:1',
            'nom' => 'required|string',
            'email' => 'required|email',
            'telephone' => 'required|string',
            'mode_paiement' => 'required|in:orange,mtn'
        ]);

        $pack = Pack::find($request->pack_id);

        // Vérifier disponibilité
        $placesRestantes = $pack->places_disponibles - $pack->places_vendues;
        if ($request->quantite > $placesRestantes) {
            return response()->json([
                'success' => false,
                'message' => 'Pas assez de places disponibles'
            ], 400);
        }

        $montantTotal = $pack->prix * $request->quantite;
        $transactionId = 'TXN-' . strtoupper(Str::random(10));
        $qrCode = 'QR-' . strtoupper(Str::random(12));

        // Créer le billet
        $billet = Billet::create([
            'pack_id' => $request->pack_id,
            'nom_client' => $request->nom,
            'email' => $request->email,
            'telephone' => $request->telephone,
            'quantite' => $request->quantite,
            'montant_total' => $montantTotal,
            'mode_paiement' => $request->mode_paiement,
            'transaction_id' => $transactionId,
            'qr_code' => $qrCode,
            'statut_paiement' => 'en_attente'
        ]);

        // TODO: Intégrer API paiement
        $paymentUrl = "https://paiement-{$request->mode_paiement}.com/pay?txn={$transactionId}";

        return response()->json([
            'success' => true,
            'data' => [
                'payment_url' => $paymentUrl,
                'transaction_id' => $transactionId
            ]
        ], 201);
    }
}
