<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pack extends Model
{
    protected $fillable = [
        'nom',
        'image',
        'prix',
        'places_disponibles',
        'places_vendues',
        'avantages',
        'statut'
    ];

    protected $casts = [
        'avantages' => 'array' // JSON → array automatique
    ];

        // Accessor pour obtenir l'URL complète de l'image
    public function getImageUrlAttribute()
    {
        if (!$this->image) {
            return null;
        }
        
        return asset("images/billets/{$this->image}");
    }

    // Relation : Un pack a plusieurs billets
    public function billets()
    {
        return $this->hasMany(Billet::class);
    }
}
