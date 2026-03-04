<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pack;
use App\Models\Billet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PackAdminController extends Controller
{
    // GET /api/admin/packs
    public function index()
    {
        $packs = Pack::all();
        return response()->json(['success' => true, 'data' => $packs]);
    }

    // POST /api/admin/packs
    public function store(Request $request)
    {
        $request->validate([
            'nom'               => 'required|string',
            'prix'              => 'required|integer|min:0',
            'places_disponibles'=> 'required|integer|min:1',
            'avantages'         => 'required|array',
            'statut'            => 'required|in:en_vente,epuise,inactif',
            'image'             => 'nullable|image|mimes:jpeg,jpg,png,webp|max:5120',
        ]);

        $data = $request->except('image');

        //  Upload image si présente
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('packs', 'public');
        }

        $pack = Pack::create($data);

        return response()->json([
            'success' => true,
            'data'    => $pack,
            'message' => 'Pack créé avec succès'
        ], 201);
    }

    // POST /api/admin/packs/{id} (avec _method=PUT)
    public function update(Request $request, $id)
    {
        $pack = Pack::find($id);
        if (!$pack) {
            return response()->json(['success' => false, 'message' => 'Pack non trouvé'], 404);
        }

        $request->validate([
            'nom'               => 'required|string',
            'prix'              => 'required|integer|min:0',
            'places_disponibles'=> 'required|integer|min:1',
            'avantages'         => 'required|array',
            'statut'            => 'required|in:en_vente,epuise,inactif',
            'image'             => 'nullable|image|mimes:jpeg,jpg,png,webp|max:5120',
        ]);

        $data = $request->except(['image', '_method']);

        //  Upload nouvelle image si présente
        if ($request->hasFile('image')) {
            // Supprimer l'ancienne image
            if ($pack->image) {
                Storage::disk('public')->delete($pack->image);
            }
            $data['image'] = $request->file('image')->store('packs', 'public');
        }

        $pack->update($data);

        return response()->json([
            'success' => true,
            'data'    => $pack,
            'message' => 'Pack modifié avec succès'
        ]);
    }

    // DELETE /api/admin/packs/{id}
    public function destroy($id)
    {
        $pack = Pack::find($id);
        if (!$pack) {
            return response()->json(['success' => false, 'message' => 'Pack non trouvé'], 404);
        }

        if ($pack->places_vendues > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer un pack avec des billets vendus'
            ], 400);
        }

        //  Supprimer l'image du storage
        if ($pack->image) {
            Storage::disk('public')->delete($pack->image);
        }

        $pack->delete();
        return response()->json(['success' => true, 'message' => 'Pack supprimé avec succès']);
    }

    // GET /api/admin/billets
    public function billets()
    {
        $billets = Billet::with('pack')->orderBy('created_at', 'desc')->get();
        return response()->json(['success' => true, 'data' => $billets]);
    }
}