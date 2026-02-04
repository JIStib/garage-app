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

    public function sendDataToFirebase()
    {
        $typesLaravel = TypeReparation::all();

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

            $newData = [
                'nom' => $type->nom,
                'duree' => (int) $type->duree,
                'prix' => (double) $type->prix,
            ];

            if (!isset($firebaseExisting[$idStr])) {
                $collectionRef->document($idStr)->set($newData);
            } else {
                $currentFirebaseData = $firebaseExisting[$idStr];

                $filteredFirebase = array_intersect_key($currentFirebaseData, $newData);

                if ($newData != $filteredFirebase) {
                    $collectionRef->document($idStr)->set($newData, ['merge' => true]);
                }
            }
        }

        return response()->noContent();
    }

}
