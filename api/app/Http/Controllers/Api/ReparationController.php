<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

use App\Models\Reparation;
use App\Models\ReparationDetail;
use App\Models\ReparationReparationStatut;
use Illuminate\Http\Request;

class ReparationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // return Reparation::with(['utilisateur', 'details.typeReparation', 'statusHistory.statut'])->get();
        return Reparation::with(['details.typeReparation', 'statusHistory.statut'])->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_utilisateur_firebase' => 'required',
        ]);

        return Reparation::create($validated);
    }

    /**
     * Display the specified resource.
     */
    public function show(Reparation $reparation)
    {
        // return $reparation->load(['utilisateur', 'details.typeReparation', 'statusHistory.statut']);
        return $reparation->load(['details.typeReparation', 'statusHistory.statut']);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Reparation $reparation)
    {
        $validated = $request->validate([
            'id_utilisateur' => 'exists:t_utilisateur,id',
        ]);

        $reparation->update($validated);

        return $reparation;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reparation $reparation)
    {
        $reparation->delete();

        return response()->noContent();
    }

    // public function loadDataFromFirebase()
    // {
    //     // $reparationsLaravel = Reparation::all();
    //     $reparationsLaravel =  Reparation::with(['details.typeReparation', 'statusHistory.statut'])->get();

    //     $collectionRef = app('firebase.firestore')->database()->collection('reparations');
    //     $documents = $collectionRef->documents();

    //     $firebaseData = [];

    //     foreach ($documents as $document) {
    //         if ($document->exists()) {
    //             $firebaseData[] = array_merge(
    //                 ['id' => $document->id()],
    //                 $document->data()
    //             );
    //             // $data[] = array_merge(
    //             //     [
    //             //         "reparation" => [
    //             //             array_merge(
    //             //                 ['id' => $document->id()],
    //             //                 // $document->data()
    //             //                 ['id_utilisateur_firebase' => $document->data()['id_utilisateur_firebase']]
    //             //             )
    //             //         ]
    //             //     ],
    //             //     ["details" => $document->data()['details']]
    //             // );
    //         }
    //     }

    //     foreach ($firebaseData as $key => $data) {
    //         // if (!in_array($data, $reparationsLaravel->toArray())) {
    //         if (!Reparation::where('id', $data['id'])->exists()) {

    //             Reparation::create($data);

    //             foreach ($data["details"] as $key => $detail) {
    //                 ReparationDetail::create($detail);
    //             }

    //             foreach ($data["status_history"] as $key => $reparationReparationStatut) {
    //                 ReparationReparationStatut::create($reparationReparationStatut);
    //             }
    //         } else {
    //             if (!empty(array_diff($data, Reparation::where('id', $data['id'])))) {
    //                 # code...
    //             }
    //         }
    //     }

    //     // foreach ($reparationsLaravel as $index => $type) {
    //     //     if (!in_array($type, $data)) {
    //     //         $newDocumentRef = $collectionRef->document($type["id"]);
    //     //         $newDocumentRef->set([
    //     //             'nom' => $type["nom"],
    //     //             'duree' => $type["duree"],
    //     //             'prix' => (double) $type["prix"]
    //     //         ]);
    //     //     } else {
    //     //         if (!empty(array_diff($type, $data[$index]))) {
    //     //             $documentRef = $collectionRef->document($type["id"]);
    //     //             foreach (array_diff($type, $data[$index]) as $key => $value) {
    //     //                 $documentRef->set([
    //     //                     $key => $value,
    //     //                 ]);
    //     //             }
    //     //         }
    //     //     }
    //     //     $data[] = $type;
    //     // }

    //     // return response()->noContent();
    //     // return $firebaseData[0];
    //     // return $reparationsLaravel->toArray();
    //     $reparationsLaravel =  Reparation::with(['details.typeReparation', 'statusHistory.statut'])->get();
    //     return $reparationsLaravel;
    // }

    public function loadDataFromFirebase()
    {
        $collectionRef = app('firebase.firestore')->database()->collection('reparations');
        $documents = $collectionRef->documents();

        foreach ($documents as $document) {
            if (!$document->exists())
                continue;

            $data = $document->data();
            $idFirebase = $document->id();

            // On utilise une transaction pour s'assurer que si un détail plante, 
            // rien n'est enregistré pour cette réparation.
            DB::transaction(function () use ($idFirebase, $data) {

                // 1. Gérer la Réparation (Parent)
                // On sépare l'ID et les relations (details/status_history) des colonnes réelles
                $reparationData = [
                    'id' => $idFirebase,
                    'id_utilisateur_firebase' => $data['id_utilisateur_firebase'] ?? null, // Ajuste selon tes clés
                ];

                // UpdateOrCreate est parfait ici : il crée si absent, met à jour si présent
                $reparation = Reparation::updateOrCreate(
                    ['id' => $idFirebase],
                    $reparationData
                );

                // 2. Gérer les Détails
                if (isset($data['details']) && is_array($data['details'])) {
                    // Optionnel : supprimer les anciens détails pour repartir sur du propre
                    $reparation->details()->delete();

                    foreach ($data['details'] as $detail) {
                        $reparation->details()->create([
                            'id_type_reparation' => $detail['id_type_reparation'],
                            'est_termine' => $detail['est_termine'] ?? false,
                            'prix' => $detail['prix'] ?? 0,
                        ]);
                    }
                }

                // 3. Gérer l'historique des statuts
                if (isset($data['status_history']) && is_array($data['status_history'])) {
                    $reparation->statusHistory()->delete();

                    foreach ($data['status_history'] as $status) {
                        $reparation->statusHistory()->create([
                            'id_reparation_statut' => $status['id_reparation_statut'],
                            'date' => $status['date'], // Firebase Timestamp ou String
                        ]);
                    }
                }
            });
        }

        // Retourner les données fraîches avec les relations
        return Reparation::with(['details.typeReparation', 'statusHistory.statut'])->get();
    }

}
