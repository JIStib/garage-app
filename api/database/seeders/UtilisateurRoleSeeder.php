<?php

namespace Database\Seeders;

use App\Models\UtilisateurRole;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UtilisateurRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        UtilisateurRole::create([
            'nom' => 'admin'
        ]);
        UtilisateurRole::create([
            'nom' => 'client'
        ]);
    }
}
