<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use App\Models\ReparationReparationStatut;
use Illuminate\Http\Request;

class ReparationReparationStatutController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return ReparationReparationStatut::with(['reparation', 'statut'])->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_reparation' => 'required|exists:t_reparation,id',
            'id_reparation_statut' => 'required|exists:t_reparation_statut,id',
            'date' => 'required|date',
        ]);

        return ReparationReparationStatut::create($validated);
    }

    /**
     * Display the specified resource.
     */
    public function show(ReparationReparationStatut $reparationReparationStatut)
    {
        return $reparationReparationStatut->load(['reparation', 'statut']);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ReparationReparationStatut $reparationReparationStatut)
    {
        $validated = $request->validate([
            'id_reparation' => 'exists:t_reparation,id',
            'id_reparation_statut' => 'exists:t_reparation_statut,id',
            'date' => 'date',
        ]);

        $reparationReparationStatut->update($validated);

        return $reparationReparationStatut;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ReparationReparationStatut $reparationReparationStatut)
    {
        $reparationReparationStatut->delete();

        return response()->noContent();
    }
}
