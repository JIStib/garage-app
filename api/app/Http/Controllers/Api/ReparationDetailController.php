<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use App\Models\ReparationDetail;
use Illuminate\Http\Request;

class ReparationDetailController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return ReparationDetail::with(['reparation', 'typeReparation'])->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_reparation' => 'required|exists:t_reparation,id',
            'id_type_reparation' => 'required|exists:t_type_reparation,id',
            'est_termine' => 'boolean',
        ]);

        return ReparationDetail::create($validated);
    }

    /**
     * Display the specified resource.
     */
    public function show(ReparationDetail $reparationDetail)
    {
        return $reparationDetail->load(['reparation', 'typeReparation']);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ReparationDetail $reparationDetail)
    {
        $validated = $request->validate([
            'id_reparation' => 'exists:t_reparation,id',
            'id_type_reparation' => 'exists:t_type_reparation,id',
            'est_termine' => 'boolean',
        ]);

        $reparationDetail->update($validated);

        return $reparationDetail;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ReparationDetail $reparationDetail)
    {
        $reparationDetail->delete();

        return response()->noContent();
    }
}
