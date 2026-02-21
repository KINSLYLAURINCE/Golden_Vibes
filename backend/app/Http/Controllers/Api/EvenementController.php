<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Evenement;

class EvenementController extends Controller
{
    // GET /api/evenements
    public function index()
    {
        $evenements = Evenement::with('photos')
            ->orderBy('date')
            ->get();

        // Formatter les photos en tableau
        $evenements->map(function($event) {
            $event->photos = $event->photos->pluck('photo')->toArray();
            return $event;
        });

        return response()->json([
            'success' => true,
            'data' => $evenements
        ]);
    }
}
