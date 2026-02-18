<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    // POST /api/contact
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string',
            'email' => 'required|email',
            'telephone' => 'required|string',
            'objet' => 'required|in:candidature,partenariat,info,reclamation,autre',
            'message' => 'required|string'
        ]);

        Message::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Message envoyé avec succès'
        ], 201);
    }
}
