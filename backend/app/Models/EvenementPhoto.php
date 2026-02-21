<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EvenementPhoto extends Model
{
    protected $fillable = [
        'evenement_id',
        'photo'
    ];

    // Relation : Une photo appartient à un événement
    public function evenement()
    {
        return $this->belongsTo(Evenement::class);
    }
}
