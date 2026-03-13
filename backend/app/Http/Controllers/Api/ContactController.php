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
            'nom' => 'required|string|min:2|max:100',
            'email' => 'required|email|max:150',
            'telephone' => 'required|string|regex:/^237[0-9]{9}$/|size:12',
            'objet' => 'required|in:candidature,partenariat,info,reclamation,autre',
            'message' => 'required|string|min:10|max:2000', // Entre 10 et 2000 caractères
        ]);

        // Nettoyer le téléphone
        $telephone = preg_replace('/[^0-9]/', '', $request->telephone);

        // Nettoyer le message (enlever balises HTML pour éviter XSS)
        $message = strip_tags($request->message);

        Message::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Message envoyé avec succès'
        ], 201);
    }
}
