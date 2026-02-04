<?php

namespace Database\Seeders;

use App\Models\Reparation;
use App\Models\ReparationDetail;
use App\Models\ReparationReparationStatut;
use App\Models\ReparationStatut;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ReparationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // reparation 1

        Reparation::create([
            'id' => 'test001',
            'id_utilisateur_firebase' => 'U001'
        ]);

        // details de reparation 1

        ReparationDetail::create([
            'id_reparation' => 'test001',
            'id_type_reparation' => 1,
            'est_termine' => false,
            'prix' => 100
        ]);

        ReparationDetail::create([
            'id_reparation' => 'test001',
            'id_type_reparation' => 2,
            'est_termine' => false,
            'prix' => 100
        ]);

        ReparationDetail::create([
            'id_reparation' => 'test001',
            'id_type_reparation' => 3,
            'est_termine' => false,
            'prix' => 100
        ]);

        ReparationDetail::create([
            'id_reparation' => 'test001',
            'id_type_reparation' => 4,
            'est_termine' => false,
            'prix' => 100
        ]);

        ReparationDetail::create([
            'id_reparation' => 'test001',
            'id_type_reparation' => 5,
            'est_termine' => false,
            'prix' => 100
        ]);

        // statut de reparation 1

        ReparationReparationStatut::create([
            'id_reparation' => 'test001',
            'id_reparation_statut' => 1,
            'date' => now(),
        ]);

        // reparation 2

        Reparation::create([
            'id' => 'test002',
            'id_utilisateur_firebase' => 'U001'
        ]);

        // details de reparation 2

        ReparationDetail::create([
            'id_reparation' => 'test002',
            'id_type_reparation' => 1,
            'est_termine' => true,
            'prix' => 100
        ]);

        ReparationDetail::create([
            'id_reparation' => 'test002',
            'id_type_reparation' => 2,
            'est_termine' => false,
            'prix' => 100
        ]);

        ReparationDetail::create([
            'id_reparation' => 'test002',
            'id_type_reparation' => 3,
            'est_termine' => true,
            'prix' => 100
        ]);

        // statut de reparation 2

        ReparationReparationStatut::create([
            'id_reparation' => 'test002',
            'id_reparation_statut' => 1,
            'date' => now(),
        ]);
    }
}
