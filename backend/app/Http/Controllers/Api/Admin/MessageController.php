<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Message;

class MessageController extends Controller
{
    // GET /api/admin/messages
    public function index()
    {
        $messages = Message::orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $messages
        ]);
    }

    // PUT /api/admin/messages/{id}/lire
    public function markAsRead($id)
    {
        $message = Message::find($id);

        if (!$message) {
            return response()->json([
                'success' => false,
                'message' => 'Message non trouvé'
            ], 404);
        }

        $message->update(['statut' => 'lu']);

        return response()->json([
            'success' => true,
            'message' => 'Message marqué comme lu'
        ]);
    }
}
