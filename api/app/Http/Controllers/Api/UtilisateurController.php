<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UtilisateurController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Utilisateur::with('role')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'identifiant' => 'required|string|max:255',
            'mdp' => 'required|string|max:255',
            'id_utilisateur_role' => 'required|exists:t_utilisateur_role,id',
        ]);

        $validated['mdp'] = Hash::make($validated['mdp']); // Assuming hashing, though SQL script didn't imply it, it's best practice.

        return Utilisateur::create($validated);
    }

    /**
     * Display the specified resource.
     */
    public function show(Utilisateur $utilisateur)
    {
        return $utilisateur->load('role');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Utilisateur $utilisateur)
    {
        $validated = $request->validate([
            'identifiant' => 'string|max:255',
            'mdp' => 'string|max:255',
            'id_utilisateur_role' => 'exists:t_utilisateur_role,id',
        ]);

        if (isset($validated['mdp'])) {
            $validated['mdp'] = Hash::make($validated['mdp']);
        }

        $utilisateur->update($validated);

        return $utilisateur;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Utilisateur $utilisateur)
    {
        $utilisateur->delete();

        return response()->noContent();
    }
}
