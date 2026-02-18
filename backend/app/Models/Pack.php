<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pack extends Model
{
    protected $fillable = [
        'nom',
        'prix',
        'places_disponibles',
        'places_vendues',
        'avantages',
        'statut'
    ];

    protected $casts = [
        'avantages' => 'array' // JSON → array automatique
    ];

    // Relation : Un pack a plusieurs billets
    public function billets()
    {
        return $this->hasMany(Billet::class);
    }
}
