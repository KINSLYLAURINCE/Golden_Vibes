<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Billet extends Model
{
    protected $fillable = [
        'pack_id',
        'nom_client',
        'email',
        'telephone',
        'quantite',
        'montant_total',
        'mode_paiement',
        'transaction_id',
        'qr_code',
        'statut_paiement',
        'statut_billet',
        'validated_by',      // ← AJOUTER
        'validated_at'       // ← AJOUTER
    ];

    protected $casts = [
        'validated_at' => 'datetime'  // ← AJOUTER
    ];

    public function pack()
    {
        return $this->belongsTo(Pack::class);
    }

    /**
     * Agent qui a validé le billet
     */
    public function validator()
    {
        return $this->belongsTo(User::class, 'validated_by');
    }
}