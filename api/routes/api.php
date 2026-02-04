<?php

use App\Http\Controllers\Api\InterventionsStatsController;
use App\Http\Controllers\Api\UtilisateurRoleController;
use App\Http\Controllers\Api\UtilisateurController;
use App\Http\Controllers\Api\TypeReparationController;
use App\Http\Controllers\Api\ReparationController;
use App\Http\Controllers\Api\ReparationDetailController;
use App\Http\Controllers\Api\ReparationStatutController;
use App\Http\Controllers\Api\ReparationReparationStatutController;

Route::get('/test', function () {
    return response()->json(['GG!' => true]);
});

Route::apiResource('utilisateur-roles', UtilisateurRoleController::class);
Route::apiResource('reparation-details', ReparationDetailController::class);
Route::apiResource('reparation-statuts', ReparationStatutController::class);
Route::apiResource('reparations-reparations-statuts', ReparationReparationStatutController::class);


Route::apiResource('utilisateurs', UtilisateurController::class);
Route::post('login',  [UtilisateurController::class, 'login']);
Route::post('signin',  [UtilisateurController::class, 'signin']);

Route::get('types-reparation/sync', [TypeReparationController::class, 'sendDataToFirebase']);
Route::apiResource('types-reparation', TypeReparationController::class)->parameters([
    'types-reparation' => 'typeReparation'
]);

Route::get('reparations/sync', [ReparationController::class, 'loadDataFromFirebase']);
Route::apiResource('reparations', ReparationController::class)->parameters([
    'reparations' => 'reparation'
]);

Route::get('stats/montant-total-interventions-creees', [InterventionsStatsController::class, 'getMontantTotalInterventionsCreees']);
Route::get('stats/montant-total-interventions-payees', [InterventionsStatsController::class, 'getMontantTotalInterventionsPayees']);
Route::post('stats/stats-journalier', [InterventionsStatsController::class, 'getStatsInterventionsParJour']);