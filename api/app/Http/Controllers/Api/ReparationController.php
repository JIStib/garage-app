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

    public function loadDataFromFirebase()
    {
        $collectionRef = app('firebase.firestore')->database()->collection('reparations');
        $documents = $collectionRef->documents();

        foreach ($documents as $document) {
            if (!$document->exists())
                continue;

            $data = $document->data();
            $idFirebase = $document->id();

            DB::transaction(function () use ($idFirebase, $data) {

                $reparationData = [
                    'id' => $idFirebase,
                    'id_utilisateur_firebase' => $data['id_utilisateur_firebase'] ?? null,
                ];

                $reparation = Reparation::updateOrCreate(
                    ['id' => $idFirebase],
                    $reparationData
                );

                if (isset($data['details']) && is_array($data['details'])) {

                    $reparation->details()->delete();

                    foreach ($data['details'] as $detail) {
                        $reparation->details()->create([
                            'id_type_reparation' => $detail['id_type_reparation'],
                            'est_termine' => $detail['est_termine'] ?? false,
                            'prix' => $detail['prix'] ?? 0,
                        ]);
                    }
                }

                if (isset($data['status_history']) && is_array($data['status_history'])) {
                    $reparation->statusHistory()->delete();

                    foreach ($data['status_history'] as $status) {
                        $reparation->statusHistory()->create([
                            'id_reparation_statut' => $status['id_reparation_statut'],
                            'date' => $status['date'],
                        ]);
                    }
                }
            });
        }

        return Reparation::with(['details.typeReparation', 'statusHistory.statut'])->get();
    }

}
