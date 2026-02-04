<?php

namespace Database\Seeders;

use App\Models\Reparation;
use App\Models\ReparationDetail;
use App\Models\ReparationReparationStatut;
use App\Models\ReparationStatut;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ReparationStatutSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        // statuts reparation

        ReparationStatut::create(
            [
                'nom' => 'Créé'
            ]
        );

        ReparationStatut::create(
            [
                'nom' => 'En cours'
            ]
        );

        ReparationStatut::create(
            [
                'nom' => 'Terminé'
            ]
        );

        ReparationStatut::create(
            [
                'nom' => 'Payé'
            ]
        );
    }
}
