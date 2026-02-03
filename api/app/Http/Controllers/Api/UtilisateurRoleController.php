<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use App\Models\UtilisateurRole;
use Illuminate\Http\Request;

class UtilisateurRoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return UtilisateurRole::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
        ]);

        return UtilisateurRole::create($validated);
    }

    /**
     * Display the specified resource.
     */
    public function show(UtilisateurRole $utilisateurRole)
    {
        return $utilisateurRole;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, UtilisateurRole $utilisateurRole)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
        ]);

        $utilisateurRole->update($validated);

        return $utilisateurRole;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UtilisateurRole $utilisateurRole)
    {
        $utilisateurRole->delete();

        return response()->noContent();
    }
}
