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
        'statut_billet'
    ];

    // Relation : Un billet appartient à un pack
    public function pack()
    {
        return $this->belongsTo(Pack::class);
    }
}
