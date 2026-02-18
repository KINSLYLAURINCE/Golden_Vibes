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
            ],
            [
                'nom' => 'MTN Cameroun',
                'logo' => 'partenaires/mtn-logo.png',
                'description' => 'Partenaire mobile money',
                'categorie' => 'platine',
                'site_web' => 'https://www.mtn.cm',
                'statut' => 'actif',
                'ordre' => 2
            ],

            // Or
            [
                'nom' => 'Beauté Cameroun',
                'logo' => 'partenaires/beaute-logo.png',
                'description' => 'Produits de beauté et cosmétiques',
                'categorie' => 'or',
                'site_web' => 'https://www.beaute-cameroun.com',
                'statut' => 'actif',
                'ordre' => 3
            ],
            [
                'nom' => 'Fashion House Douala',
                'logo' => 'partenaires/fashion-logo.png',
                'description' => 'Mode et habillement haut de gamme',
                'categorie' => 'or',
                'site_web' => null,
                'statut' => 'actif',
                'ordre' => 4
            ],

            // Argent
            [
                'nom' => 'Restaurant Le Palais',
                'logo' => 'partenaires/palais-logo.png',
                'description' => 'Gastronomie et événementiel',
                'categorie' => 'argent',
                'site_web' => null,
                'statut' => 'actif',
                'ordre' => 5
            ],
            [
                'nom' => 'Photo Studio Pro',
                'logo' => 'partenaires/photo-logo.png',
                'description' => 'Photographie professionnelle',
                'categorie' => 'argent',
                'site_web' => 'https://www.photostudiopro.cm',
                'statut' => 'actif',
                'ordre' => 6
            ],

            // Bronze
            [
                'nom' => 'Event Décor CM',
                'logo' => 'partenaires/decor-logo.png',
                'description' => 'Décoration événementielle',
                'categorie' => 'bronze',
                'site_web' => null,
                'statut' => 'actif',
                'ordre' => 7
            ],
            [
                'nom' => 'Sound & Light CM',
                'logo' => 'partenaires/sound-logo.png',
                'description' => 'Sonorisation et éclairage',
                'categorie' => 'bronze',
                'site_web' => null,
                'statut' => 'actif',
                'ordre' => 8
            ]
        ];

        foreach ($partenaires as $partenaire) {
            Partenaire::create($partenaire);
        }

        echo "✅ 8 partenaires créés\n";
    }
}
