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

        // Événement 2
        $event2 = Evenement::create([
            'nom' => 'Bootcamp Formation & Coaching',
            'date' => '2026-03-20',
            'heure' => '09:00:00',
            'lieu' => 'Hôtel Sawa',
            'ville' => 'Douala',
            'theme' => 'Excellence et Leadership',
            'description' => 'Journée de formation intensive pour les candidats : coaching en communication, défilé, maintien et prise de parole en public.',
            'statut' => 'a_venir'
        ]);

        EvenementPhoto::create([
            'evenement_id' => $event2->id,
            'photo' => 'evenements/event2-photo1.jpg'
        ]);
        EvenementPhoto::create([
            'evenement_id' => $event2->id,
            'photo' => 'evenements/event2-photo2.jpg'
        ]);
        EvenementPhoto::create([
            'evenement_id' => $event2->id,
            'photo' => 'evenements/event2-photo3.jpg'
        ]);

        // Événement 3
        $event3 = Evenement::create([
            'nom' => 'Soirée Caritative',
            'date' => '2026-03-30',
            'heure' => '19:00:00',
            'lieu' => 'Centre Culturel',
            'ville' => 'Yaoundé',
            'theme' => 'Solidarité et Partage',
            'description' => 'Soirée dédiée à une cause sociale. Les candidats participent à une levée de fonds pour soutenir des œuvres caritatives.',
            'statut' => 'a_venir'
        ]);

        EvenementPhoto::create([
            'evenement_id' => $event3->id,
            'photo' => 'evenements/event3-photo1.jpg'
        ]);

        echo "✅ 3 événements créés avec leurs photos\n";
    }
}
