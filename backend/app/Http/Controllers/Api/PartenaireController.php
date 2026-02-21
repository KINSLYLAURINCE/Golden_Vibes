<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Partenaire;

class PartenaireController extends Controller
{
    // GET /api/partenaires
    public function index()
    {
        $partenaires = Partenaire::where('statut', 'actif')
            ->orderBy('ordre')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $partenaires
        ]);
    }
}
