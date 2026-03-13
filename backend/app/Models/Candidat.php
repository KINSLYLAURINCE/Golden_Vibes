<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Candidat extends Model
{
    protected $fillable = [
        'numero',
        'nom',
        'categorie',
        'photo1',
        'photo2',
        'video',
        'votes_count',
        'statut'
    ];

    // Relation : Un candidat a plusieurs votes
    public function votes()
    {
        return $this->hasMany(Vote::class);
    }

    // Accesseur pour obtenir facilement le total de votes validés
    public function getVotesValideCountAttribute()
    {
        return $this->votes()->where('statut', 'valide')->count();
    }
}
