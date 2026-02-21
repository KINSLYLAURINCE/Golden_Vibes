<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Evenement;
use App\Models\EvenementPhoto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EvenementAdminController extends Controller
{
    // GET /api/admin/evenements
    public function index()
    {
        $evenements = Evenement::with('photos')->orderBy('date')->get();

        return response()->json([
            'success' => true,
            'data' => $evenements
        ]);
    }

    // POST /api/admin/evenements
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string',
            'date' => 'required|date',
            'heure' => 'required',
            'lieu' => 'required|string',
            'ville' => 'required|string',
            'theme' => 'required|string',
            'description' => 'required|string',
            'photos' => 'required|array',
            'photos.*' => 'image|max:5120',
            'statut' => 'required|in:a_venir,en_cours,termine'
        ]);

        $evenement = Evenement::create([
            'nom' => $request->nom,
            'date' => $request->date,
            'heure' => $request->heure,
            'lieu' => $request->lieu,
            'ville' => $request->ville,
            'theme' => $request->theme,
            'description' => $request->description,
            'statut' => $request->statut
        ]);

        // Upload photos
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $photo) {
                $path = $photo->store('evenements', 'public');

                EvenementPhoto::create([
                    'evenement_id' => $evenement->id,
                    'photo' => $path
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'data' => $evenement->load('photos'),
            'message' => 'Événement créé avec succès'
        ], 201);
    }

    // PUT /api/admin/evenements/{id}
    public function update(Request $request, $id)
    {
        $evenement = Evenement::find($id);

        if (!$evenement) {
            return response()->json([
                'success' => false,
                'message' => 'Événement non trouvé'
            ], 404);
        }

        $request->validate([
            'nom' => 'required|string',
            'date' => 'required|date',
            'heure' => 'required',
            'lieu' => 'required|string',
            'ville' => 'required|string',
            'theme' => 'required|string',
            'description' => 'required|string',
            'photos' => 'nullable|array',
            'photos.*' => 'image|max:5120',
            'statut' => 'required|in:a_venir,en_cours,termine'
        ]);

        $evenement->update([
            'nom' => $request->nom,
            'date' => $request->date,
            'heure' => $request->heure,
            'lieu' => $request->lieu,
            'ville' => $request->ville,
            'theme' => $request->theme,
            'description' => $request->description,
            'statut' => $request->statut
        ]);

        // Ajouter nouvelles photos si fournies
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $photo) {
                $path = $photo->store('evenements', 'public');

                EvenementPhoto::create([
                    'evenement_id' => $evenement->id,
                    'photo' => $path
                ]);
            }
        }

        return response()->json([
            'success' => true,
            'data' => $evenement->load('photos'),
            'message' => 'Événement modifié avec succès'
        ]);
    }

    // DELETE /api/admin/evenements/{id}
    public function destroy($id)
    {
        $evenement = Evenement::find($id);

        if (!$evenement) {
            return response()->json([
                'success' => false,
                'message' => 'Événement non trouvé'
            ], 404);
        }

        // Supprimer les photos
        foreach ($evenement->photos as $photo) {
            Storage::disk('public')->delete($photo->photo);
        }

        $evenement->delete();

        return response()->json([
            'success' => true,
            'message' => 'Événement supprimé avec succès'
        ]);
    }
}
