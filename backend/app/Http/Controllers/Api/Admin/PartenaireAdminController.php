<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Partenaire;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PartenaireAdminController extends Controller
{
    // GET /api/admin/partenaires
    public function index()
    {
        $partenaires = Partenaire::orderBy('ordre')->get();

        return response()->json([
            'success' => true,
            'data' => $partenaires
        ]);
    }

    // POST /api/admin/partenaires
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string',
            'logo' => 'required|image|max:2048',
            'description' => 'nullable|string',
            'categorie' => 'required|in:platine,or,argent,bronze',
            'site_web' => 'nullable|url',
            'statut' => 'required|in:actif,inactif',
            'ordre' => 'nullable|integer'
        ]);

        $logoPath = $request->file('logo')->store('partenaires', 'public');

        $partenaire = Partenaire::create([
            'nom' => $request->nom,
            'logo' => $logoPath,
            'description' => $request->description,
            'categorie' => $request->categorie,
            'site_web' => $request->site_web,
            'statut' => $request->statut,
            'ordre' => $request->ordre ?? 0
        ]);

        return response()->json([
            'success' => true,
            'data' => $partenaire,
            'message' => 'Partenaire ajouté avec succès'
        ], 201);
    }

    // PUT /api/admin/partenaires/{id}
    public function update(Request $request, $id)
    {
        $partenaire = Partenaire::find($id);

        if (!$partenaire) {
            return response()->json([
                'success' => false,
                'message' => 'Partenaire non trouvé'
            ], 404);
        }

        $request->validate([
            'nom' => 'required|string',
            'logo' => 'nullable|image|max:2048',
            'description' => 'nullable|string',
            'categorie' => 'required|in:platine,or,argent,bronze',
            'site_web' => 'nullable|url',
            'statut' => 'required|in:actif,inactif',
            'ordre' => 'nullable|integer'
        ]);

        // Update logo si fourni
        if ($request->hasFile('logo')) {
            Storage::disk('public')->delete($partenaire->logo);
            $partenaire->logo = $request->file('logo')->store('partenaires', 'public');
        }

        $partenaire->update([
            'nom' => $request->nom,
            'description' => $request->description,
            'categorie' => $request->categorie,
            'site_web' => $request->site_web,
            'statut' => $request->statut,
            'ordre' => $request->ordre ?? $partenaire->ordre
        ]);

        return response()->json([
            'success' => true,
            'data' => $partenaire,
            'message' => 'Partenaire modifié avec succès'
        ]);
    }

    // DELETE /api/admin/partenaires/{id}
    public function destroy($id)
    {
        $partenaire = Partenaire::find($id);

        if (!$partenaire) {
            return response()->json([
                'success' => false,
                'message' => 'Partenaire non trouvé'
            ], 404);
        }

        Storage::disk('public')->delete($partenaire->logo);
        $partenaire->delete();

        return response()->json([
            'success' => true,
            'message' => 'Partenaire supprimé avec succès'
        ]);
    }

    /**
     * Afficher un partenaire spécifique
     * GET /api/admin/partenaires/{id}
     */
    public function show($id)
    {
        $partenaire = Partenaire::findOrFail($id);
        
        return response()->json([
            'success' => true,
            'data' => $partenaire
        ]);
    }

    /**
     * Changer le statut d'un partenaire
     * PATCH /api/admin/partenaires/{id}/statut
     */
    public function toggleStatut($id)
    {
        $partenaire = Partenaire::findOrFail($id);
        
        $nouveauStatut = $partenaire->statut === 'actif' ? 'inactif' : 'actif';
        
        $partenaire->update([
            'statut' => $nouveauStatut
        ]);
        
        return response()->json([
            'success' => true,
            'data' => $partenaire,
            'message' => "Partenaire {$nouveauStatut}"
        ]);
    }
}
