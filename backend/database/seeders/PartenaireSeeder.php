<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Partenaire;

/**
 * Seeder pour créer des partenaires de test
 *
 * Crée 8 partenaires dans différentes catégories
 */
class PartenaireSeeder extends Seeder
{
    public function run(): void
    {
        $partenaires = [
            // Platine
            [
                'nom' => 'Orange Cameroun',
                'logo' => 'partenaires/orange-logo.png',
                'description' => 'Opérateur télécom principal',
                'categorie' => 'platine',
                'site_web' => 'https://www.orange.cm',
                'statut' => 'actif',
                'ordre' => 1
            ]
        ];

        foreach ($partenaires as $partenaire) {
            Partenaire::create($partenaire);
        }

        echo "✅ 1 partenaires créés\n";
    }
}
