<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use App\Models\TypeReparation;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TypeReparationController extends Controller
{
    // public function index()
    // {
    //     return response()->json(TypeReparation::all(), Response::HTTP_OK);
    // }

    public function index()
    {
        // Récupère 10 éléments par page
        // $types = TypeReparation::paginate(6);

        // return response()->json($types, Response::HTTP_OK);
        return response()->json(TypeReparation::all(), Response::HTTP_OK);
        // return TypeReparation::with(['reparation', 'typeReparation'])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'duree' => 'required|integer|min:1',
            'prix' => 'required|numeric|min:0',
        ]);

        $typeReparation = TypeReparation::create($validated);

        return response()->json($typeReparation, Response::HTTP_CREATED);
    }

    public function show(TypeReparation $typeReparation)
    {
        return response()->json($typeReparation, Response::HTTP_OK);
    }

    public function update(Request $request, TypeReparation $typeReparation)
    {
        $validated = $request->validate([
            'nom' => 'sometimes|required|string|max:255',
            'duree' => 'sometimes|required|integer|min:1',
            'prix' => 'sometimes|required|numeric|min:0',
        ]);

        $typeReparation->update($validated);

        return response()->json($typeReparation, Response::HTTP_OK);
    }

    public function destroy(TypeReparation $typeReparation)
    {
        $typeReparation->delete();
        return response()->noContent();
    }

    // public function sendDataToFirebase()
    // {
    //     $typesReparationLaravel = TypeReparation::all();

    //     $collectionRef = app('firebase.firestore')->database()->collection('types_reparation');
    //     $documents = $collectionRef->documents();

    //     $data = [];

    //     foreach ($documents as $document) {
    //         if ($document->exists()) {
    //             $data[] = array_merge(
    //                 ['id' => $document->id()],
    //                 $document->data()
    //             );
    //         }
    //     }

    //     foreach ($typesReparationLaravel as $index => $type) {
    //         if (!in_array($type, $data)) {
    //             $newDocumentRef = $collectionRef->document($type["id"]);
    //             $newDocumentRef->set([
    //                 'nom' => $type["nom"],
    //                 'duree' => $type["duree"],
    //                 'prix' => (double) $type["prix"]
    //             ]);
    //         } else {
    //             if (!empty(array_diff($type, $data[$index]))) {
    //                 $documentRef = $collectionRef->document($type["id"]);
    //                 foreach (array_diff($type, $data[$index]) as $key => $value) {
    //                     $documentRef->set([
    //                         $key => $value,
    //                     ]);
    //                 }
    //             }
    //         }
    //         $data[] = $type;
    //     }

    //     return response()->noContent();
    // }

    public function sendDataToFirebase()
    {
        // 1. Récupérer les données locales
        $typesLaravel = TypeReparation::all();

        // 2. Récupérer les données Firebase et les indexer par ID pour une recherche rapide
        $collectionRef = app('firebase.firestore')->database()->collection('types_reparation');
        $documents = $collectionRef->documents();

        $firebaseExisting = [];
        foreach ($documents as $doc) {
            if ($doc->exists()) {
                $firebaseExisting[$doc->id()] = $doc->data();
            }
        }

        foreach ($typesLaravel as $type) {
            $idStr = (string) $type->id;

            // Préparation des données à envoyer (formatage propre)
            $newData = [
                'nom' => $type->nom,
                'duree' => (int) $type->duree,
                'prix' => (double) $type->prix,
            ];

            // 3. Vérifier si le document existe déjà dans Firebase
            if (!isset($firebaseExisting[$idStr])) {
                // Création si absent
                $collectionRef->document($idStr)->set($newData);
            } else {
                // 4. Comparaison pour mise à jour uniquement si changement
                // On compare uniquement les champs qui nous intéressent
                $currentFirebaseData = $firebaseExisting[$idStr];

                // On ne garde que les clés présentes dans newData pour la comparaison
                $filteredFirebase = array_intersect_key($currentFirebaseData, $newData);

                if ($newData != $filteredFirebase) {
                    // Mise à jour (merge pour ne pas écraser d'autres champs potentiels dans Firebase)
                    $collectionRef->document($idStr)->set($newData, ['merge' => true]);
                }
            }
        }

        return response()->noContent();
    }

}
