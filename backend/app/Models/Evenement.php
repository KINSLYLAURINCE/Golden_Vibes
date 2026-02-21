<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Evenement extends Model
{
    protected $fillable = [
        'nom',
        'date',
        'heure',
        'lieu',
        'ville',
        'theme',
        'description',
        'statut'
    ];

    // Relation : Un événement a plusieurs photos
    public function photos()
    {
        return $this->hasMany(EvenementPhoto::class);
    }
}
