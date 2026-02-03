<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use App\Models\ReparationStatut;
use Illuminate\Http\Request;

class ReparationStatutController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return ReparationStatut::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
        ]);

        return ReparationStatut::create($validated);
    }

    /**
     * Display the specified resource.
     */
    public function show(ReparationStatut $reparationStatut)
    {
        return $reparationStatut;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ReparationStatut $reparationStatut)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
        ]);

        $reparationStatut->update($validated);

        return $reparationStatut;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ReparationStatut $reparationStatut)
    {
        $reparationStatut->delete();

        return response()->noContent();
    }
}
