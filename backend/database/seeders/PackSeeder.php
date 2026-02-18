<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Pack;

/**
 * Seeder pour créer les packs de billets
 *
 * Crée 4 types de packs :
 * - VIP
 * - Gold
 * - Standard
 * - Étudiant
 */
class PackSeeder extends Seeder
{
    public function run(): void
    {
        // Pack VIP
        Pack::create([
            'nom' => 'VIP',
            'prix' => 50000, // 50 000 FCFA
            'places_disponibles' => 100,
            'places_vendues' => 0,
            'avantages' => [
                'Place assise premium',
                'Accès backstage',
                'Cocktail VIP inclus',
                'Photo avec les candidats',
                'Goodies exclusifs'
            ],
            'statut' => 'en_vente'
        ]);

        // Pack Gold
        Pack::create([
            'nom' => 'Gold',
            'prix' => 30000,
            'places_disponibles' => 200,
            'places_vendues' => 0,
            'avantages' => [
                'Place assise réservée',
                'Accès lounge',
                'Cocktail inclus',
                'Goodies'
            ],
            'statut' => 'en_vente'
        ]);

        // Pack Standard
        Pack::create([
            'nom' => 'Standard',
            'prix' => 15000,
            'places_disponibles' => 500,
            'places_vendues' => 0,
            'avantages' => [
                'Place assise',
                'Accès général'
            ],
            'statut' => 'en_vente'
        ]);

        // Pack Étudiant
        Pack::create([
            'nom' => 'Étudiant',
            'prix' => 10000,
            'places_disponibles' => 200,
            'places_vendues' => 0,
            'avantages' => [
                'Place debout',
                'Tarif réduit étudiant',
                'Carte étudiant requise'
            ],
            'statut' => 'en_vente'
        ]);

        echo "✅ 4 packs de billets créés\n";
    }
}
