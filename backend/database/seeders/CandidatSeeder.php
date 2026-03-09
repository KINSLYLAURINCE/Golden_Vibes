<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Candidat;

/**
 * Seeder pour créer des candidats de test
 *
 * Crée :
 * - 10 Miss (numéros 001-010)
 * - 10 Master (numéros 011-020)
 */
class CandidatSeeder extends Seeder
{
    public function run(): void
    {
        // Créer 10 Miss
        for ($i = 1; $i <= 2; $i++) {
            Candidat::create([
                'numero' => str_pad($i, 3, '0', STR_PAD_LEFT), // 001, 002, ...
                'nom' => 'Miss Candidate ' . $i,
                'categorie' => 'miss',
                'photo1' => 'candidats/default-miss-1.jpg', // Photo par défaut
                'photo2' => 'candidats/default-miss-2.jpg',
                'video' => 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Vidéo test
                'votes_count' => rand(100, 2000), // Votes aléatoires
                'statut' => 'actif'
            ]);
        }

        // Créer 10 Master
        for ($i = 3; $i <= 4; $i++) {
            Candidat::create([
                'numero' => str_pad($i, 3, '0', STR_PAD_LEFT), // 011, 012, ...
                'nom' => 'Master Candidate ' . $i,
                'categorie' => 'master',
                'photo1' => 'candidats/default-master-1.jpg',
                'photo2' => 'candidats/default-master-2.jpg',
                'video' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                'votes_count' => rand(100, 2000),
                'statut' => 'actif'
            ]);
        }

        echo "✅ 4 candidats créés (2 Miss + 2 Master)\n";
    }
}
