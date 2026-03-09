<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Evenement;
use App\Models\EvenementPhoto;

/**
 * Seeder pour créer des événements annexes
 *
 * Crée 3 événements avec photos
 */
class EvenementSeeder extends Seeder
{
    public function run(): void
    {
        // Événement 1
        $event1 = Evenement::create([
            'nom' => 'Soirée de Présentation des Candidats',
            'date' => '2026-03-10',
            'heure' => '18:00:00',
            'lieu' => 'Palais des Congrès',
            'ville' => 'Douala',
            'theme' => 'Élégance Africaine',
            'description' => 'Première rencontre officielle avec tous les candidats. Soirée élégante avec défilé de présentation en tenue traditionnelle africaine.',
            'statut' => 'a_venir'
        ]);

        // Photos événement 1
        EvenementPhoto::create([
            'evenement_id' => $event1->id,
            'photo' => 'evenements/event1-photo1.jpg'
        ]);
        EvenementPhoto::create([
            'evenement_id' => $event1->id,
            'photo' => 'evenements/event1-photo2.jpg'
        ]);


        echo "✅ 1 événements créés avec leurs photos\n";
    }
}
