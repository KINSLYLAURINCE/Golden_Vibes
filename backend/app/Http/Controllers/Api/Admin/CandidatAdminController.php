<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Candidat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CandidatAdminController extends Controller
{
    // GET /api/admin/candidats
    public function index()
    {
        $candidats = Candidat::orderBy('numero')->get();

        return response()->json([
            'success' => true,
            'data' => $candidats
        ]);
    }

    // POST /api/admin/candidats
    public function store(Request $request)
    {
        $request->validate([
            'numero' => 'required|unique:candidats',
            'nom' => 'required|string',
            'categorie' => 'required|in:miss,master',
            'photo1' => 'required|image|max:5120', // 5MB
            'photo2' => 'required|image|max:5120',
            'video' => 'nullable|string', // URL ou fichier
            'statut' => 'required|in:actif,inactif'
        ]);

        // Upload photo1
        $photo1Path = $request->file('photo1')->store('candidats', 'public');

        // Upload photo2
        $photo2Path = $request->file('photo2')->store('candidats', 'public');

        // Video (URL ou upload)
        $videoPath = null;
        if ($request->has('video') && filter_var($request->video, FILTER_VALIDATE_URL)) {
            $videoPath = $request->video; // C'est une URL
        } elseif ($request->hasFile('video')) {
            $videoPath = $request->file('video')->store('candidats/videos', 'public');
        }

        $candidat = Candidat::create([
            'numero' => $request->numero,
            'nom' => $request->nom,
            'categorie' => $request->categorie,
            'photo1' => $photo1Path,
            'photo2' => $photo2Path,
            'video' => $videoPath,
            'statut' => $request->statut
        ]);

        return response()->json([
            'success' => true,
            'data' => $candidat,
            'message' => 'Candidat ajouté avec succès'
        ], 201);
    }

    // PUT /api/admin/candidats/{id}
    public function update(Request $request, $id)
    {
        $candidat = Candidat::find($id);

        if (!$candidat) {
            return response()->json([
                'success' => false,
                'message' => 'Candidat non trouvé'
            ], 404);
        }

        $request->validate([
            'numero' => 'required|unique:candidats,numero,' . $id,
            'nom' => 'required|string',
            'categorie' => 'required|in:miss,master',
            'photo1' => 'nullable|image|max:5120',
            'photo2' => 'nullable|image|max:5120',
            'video' => 'nullable|string',
            'statut' => 'required|in:actif,inactif'
        ]);

        // Update photo1 si fournie
        if ($request->hasFile('photo1')) {
            Storage::disk('public')->delete($candidat->photo1);
            $candidat->photo1 = $request->file('photo1')->store('candidats', 'public');
        }

        // Update photo2 si fournie
        if ($request->hasFile('photo2')) {
            Storage::disk('public')->delete($candidat->photo2);
            $candidat->photo2 = $request->file('photo2')->store('candidats', 'public');
        }

        // Update video
        if ($request->has('video')) {
            if (filter_var($request->video, FILTER_VALIDATE_URL)) {
                $candidat->video = $request->video;
            } elseif ($request->hasFile('video')) {
                if ($candidat->video && !filter_var($candidat->video, FILTER_VALIDATE_URL)) {
                    Storage::disk('public')->delete($candidat->video);
                }
                $candidat->video = $request->file('video')->store('candidats/videos', 'public');
            }
        }

        $candidat->update([
            'numero' => $request->numero,
            'nom' => $request->nom,
            'categorie' => $request->categorie,
            'statut' => $request->statut
        ]);

        return response()->json([
            'success' => true,
            'data' => $candidat,
            'message' => 'Candidat modifié avec succès'
        ]);
    }

    /**
     * Afficher un candidat spécifique
     * GET /api/admin/candidats/{id}
     */
    public function show($id)
    {
        $candidat = Candidat::findOrFail($id);
        
        return response()->json([
            'success' => true,
            'data' => $candidat
        ]);
    }

    // DELETE /api/admin/candidats/{id}
    public function destroy($id)
    {
        $candidat = Candidat::find($id);

        if (!$candidat) {
            return response()->json([
                'success' => false,
                'message' => 'Candidat non trouvé'
            ], 404);
        }

        // Supprimer les fichiers
        Storage::disk('public')->delete($candidat->photo1);
        Storage::disk('public')->delete($candidat->photo2);
        if ($candidat->video && !filter_var($candidat->video, FILTER_VALIDATE_URL)) {
            Storage::disk('public')->delete($candidat->video);
        }

        $candidat->delete();

        return response()->json([
            'success' => true,
            'message' => 'Candidat supprimé avec succès'
        ]);
    }

    /**
     * Changer le statut d'un candidat (actif/inactif)
     * PATCH /api/admin/candidats/{id}/statut
     */
    public function toggleStatut($id)
    {
        $candidat = Candidat::findOrFail($id);
        
        // Inverser le statut
        $nouveauStatut = $candidat->statut === 'actif' ? 'inactif' : 'actif';
        
        $candidat->update([
            'statut' => $nouveauStatut
        ]);
        
        return response()->json([
            'success' => true,
            'data' => $candidat,
            'message' => "Candidat {$nouveauStatut}"
        ]);
    }
}
