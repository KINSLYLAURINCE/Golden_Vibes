<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Billet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class BilletValidationController extends Controller
{
    /**
     * Valider un billet par son code
     * 
     * POST /api/admin/billets/valider
     */
    public function valider(Request $request)
    {
        $request->validate([
            'code' => 'required|string'
        ]);

        // Nettoyer le code (majuscules, sans espaces)
        $code = strtoupper(trim($request->code));

        // Chercher le billet
        $billet = Billet::with('pack')
            ->where('qr_code', $code)
            ->first();

        if (!$billet) {
            return response()->json([
                'success' => false,
                'message' => '❌ CODE INVALIDE',
                'details' => 'Aucun billet trouvé avec ce code'
            ], 404);
        }

        // VÉRIFIER PAIEMENT
        if ($billet->statut_paiement !== 'valide') {
            return response()->json([
                'success' => false,
                'message' => '❌ PAIEMENT NON VALIDÉ',
                'details' => "Statut: {$billet->statut_paiement}"
            ], 400);
        }

        // VÉRIFIER PAS DÉJÀ UTILISÉ
        if ($billet->statut_billet === 'utilise') {
            return response()->json([
                'success' => false,
                'message' => '⚠️ DÉJÀ ENTRÉ',
                'data' => [
                    'nom' => $billet->nom_client,
                    'pack' => $billet->pack->nom,
                    'entre_le' => $billet->validated_at 
                        ? $billet->validated_at->format('d/m/Y à H:i:s')
                        : $billet->updated_at->format('d/m/Y à H:i:s')
                ],
                'warning' => true
            ], 409);
        }

        // VÉRIFIER PAS ANNULÉ
        if ($billet->statut_billet === 'annule') {
            return response()->json([
                'success' => false,
                'message' => '❌ BILLET ANNULÉ'
            ], 400);
        }

        // ✅ TOUT OK - MARQUER COMME UTILISÉ
        $billet->update([
            'statut_billet' => 'utilise',
            'validated_by' => auth()->id(),      // ← QUI a validé
            'validated_at' => now()              // ← QUAND validé
        ]);

        Log::info('Billet validé à l\'entrée', [
            'billet_id' => $billet->id,
            'code' => $code,
            'nom' => $billet->nom_client,
            'agent' => auth()->user()->name,
            'validated_at' => now()
        ]);

        return response()->json([
            'success' => true,
            'message' => '✅ ACCÈS AUTORISÉ',
            'data' => [
                'code' => $billet->qr_code,
                'nom' => $billet->nom_client,
                'email' => $billet->email,
                'telephone' => $billet->telephone,
                'pack' => $billet->pack->nom,
                'quantite' => $billet->quantite,
                'montant' => number_format($billet->montant_total, 0, '', ' ') . ' FCFA',
                'date_achat' => $billet->created_at->format('d/m/Y à H:i'),
                'validé_par' => auth()->user()->name,
                'validé_le' => now()->format('d/m/Y à H:i:s')
            ]
        ]);
    }

    /**
     * Stats temps réel entrées
     * 
     * GET /api/admin/billets/stats-entrees
     */
    public function statsEntrees()
    {
        $total_vendus = Billet::where('statut_paiement', 'valide')->sum('quantite');
        $total_entres = Billet::where('statut_billet', 'utilise')->sum('quantite');

        return response()->json([
            'success' => true,
            'data' => [
                'total_vendus' => $total_vendus,
                'total_entres' => $total_entres,
                'en_attente' => $total_vendus - $total_entres,
                'taux' => $total_vendus > 0 ? round(($total_entres / $total_vendus) * 100, 1) : 0
            ]
        ]);
    }

    /**
     * Liste des billets validés (entrées)
     * 
     * GET /api/admin/billets/valides
     */
    public function listeValides()
    {
        $billets = Billet::where('statut_billet', 'utilise')
            ->with(['pack', 'validator'])
            ->orderBy('validated_at', 'desc')
            ->get()
            ->map(function($billet) {
                return [
                    'id' => $billet->id,
                    'code' => $billet->qr_code,
                    'nom' => $billet->nom_client,
                    'pack' => $billet->pack->nom,
                    'quantite' => $billet->quantite,
                    'validé_par' => $billet->validator->name ?? 'N/A',
                    'validé_le' => $billet->validated_at 
                        ? $billet->validated_at->format('d/m/Y H:i:s')
                        : 'N/A'
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $billets,
            'total' => $billets->count()
        ]);
    }
}