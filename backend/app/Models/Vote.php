<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vote extends Model
{
    protected $fillable = [
        'candidat_id',
        'nombre_votes',
        'montant',
        'telephone',
        'mode_paiement',
        'transaction_id',
        'statut'
    ];

    // Relation : Un vote appartient à un candidat
    public function candidat()
    {
        return $this->belongsTo(Candidat::class);
    }
}
