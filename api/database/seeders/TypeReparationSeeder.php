<?php

namespace Database\Seeders;

use App\Models\TypeReparation;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TypeReparationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TypeReparation::create([
            'nom' => 'Freins',
            'duree' => 5,
            'prix' => 100
        ]);
        TypeReparation::create([
            'nom' => 'Vidange',
            'duree' => 5,
            'prix' => 100
        ]);
        TypeReparation::create([
            'nom' => 'Filtre',
            'duree' => 5,
            'prix' => 100
        ]);
        TypeReparation::create([
            'nom' => 'Batterie',
            'duree' => 5,
            'prix' => 100
        ]);
        TypeReparation::create([
            'nom' => 'Amortisseurs',
            'duree' => 5,
            'prix' => 100
        ]);
        TypeReparation::create([
            'nom' => 'Embrayage',
            'duree' => 5,
            'prix' => 100
        ]);
        TypeReparation::create([
            'nom' => 'Pneus',
            'duree' => 5,
            'prix' => 100
        ]);
        TypeReparation::create([
            // 'nom' => 'Système de refroidissement',
            'nom' => 'Refroidissement',
            'duree' => 5,
            'prix' => 100
        ]);
    }
}
