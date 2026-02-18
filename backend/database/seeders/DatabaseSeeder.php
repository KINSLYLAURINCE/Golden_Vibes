<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

/**
 * Seeder principal qui appelle tous les autres seeders
 *
 * Pour lancer tous les seeders :
 * php artisan db:seed
 *
 * Pour tout réinitialiser et reseed :
 * php artisan migrate:fresh --seed
 */
class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        echo "🌱 Démarrage du seeding...\n\n";

        // Appeler tous les seeders dans l'ordre
        $this->call([
            UserSeeder::class,        // 1. Créer les admins
            CandidatSeeder::class,    // 2. Créer les candidats
            PackSeeder::class,        // 3. Créer les packs de billets
            PartenaireSeeder::class,  // 4. Créer les partenaires
            EvenementSeeder::class,   // 5. Créer les événements
        ]);

        echo "\n✨ Seeding terminé avec succès !\n";
        echo "📧 Login admin : admin@goldenvibes.com\n";
        echo "🔑 Password : password\n";
    }
}
