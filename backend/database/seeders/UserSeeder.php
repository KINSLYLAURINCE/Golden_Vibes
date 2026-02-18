<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

/**
 * Seeder pour créer les utilisateurs administrateurs
 *
 * Crée :
 * - 1 Super Admin
 * - 1 Admin normal
 */
class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Super Administrateur
        User::create([
            'name' => 'Super Admin',
            'email' => 'admin@goldenvibes.com',
            'password' => Hash::make('password'), // À changer en production !
            'role' => 'super_admin'
        ]);

        // Administrateur normal
        User::create([
            'name' => 'Admin Golden Vibes',
            'email' => 'admin2@goldenvibes.com',
            'password' => Hash::make('password'),
            'role' => 'admin'
        ]);

        echo "✅ 2 utilisateurs créés\n";
    }
}
