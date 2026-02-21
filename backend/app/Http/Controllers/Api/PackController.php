<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pack;

class PackController extends Controller
{
    // GET /api/packs
    public function index()
    {
        $packs = Pack::where('statut', '!=', 'inactif')->get();

        return response()->json([
            'success' => true,
            'data' => $packs
        ]);
    }
}
