<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

use App\Models\Reparation;
use App\Models\ReparationDetail;
use App\Models\ReparationReparationStatut;
use Illuminate\Http\Request;
use Carbon\CarbonPeriod;
use Carbon\Carbon;

class InterventionsStatsController extends Controller
{

    public function getMontantTotalInterventionsPayees()
    {
        $reparationsPayees = Reparation::with(['details.typeReparation', 'statusHistory.statut'])
            ->whereHas('statusHistory', function ($query) {
                $query->where('date', function ($subQuery) {
                    $subQuery->selectRaw('max(date)')
                        ->from('t_reparation_reparation_statut')
                        ->whereColumn('id_reparation', 't_reparation.id');
                })
                    ->whereHas('statut', function ($q) {
                        $q->where('nom', 'Payé');
                    });
            })->get();

        $montantTotal = $reparationsPayees->sum(function ($reparation) {
            return $reparation->details->sum('prix');
        });

        return response()->json([
            'total' => $montantTotal,
            'count' => $reparationsPayees->count()
        ]);

        // return $reparationsPayees;
    }

    public function getMontantTotalInterventionsEnCours()
    {
        $reparationsPayees = Reparation::with(['details.typeReparation', 'statusHistory.statut'])
            ->whereHas('statusHistory', function ($query) {
                $query->where('date', function ($subQuery) {
                    $subQuery->selectRaw('max(date)')
                        ->from('t_reparation_reparation_statut')
                        ->whereColumn('id_reparation', 't_reparation.id');
                })
                    ->whereHas('statut', function ($q) {
                        $q->where('nom', 'En cours');
                    });
            })->get();

        $montantTotal = $reparationsPayees->sum(function ($reparation) {
            return $reparation->details->sum('prix');
        });

        return response()->json([
            'total' => $montantTotal,
            'count' => $reparationsPayees->count()
        ]);

        // return $reparationsPayees;
    }

    public function getMontantTotalInterventionsCreees()
    {
        $reparationsPayees = Reparation::with(['details.typeReparation', 'statusHistory.statut'])
            ->whereHas('statusHistory', function ($query) {
                $query->where('date', function ($subQuery) {
                    $subQuery->selectRaw('max(date)')
                        ->from('t_reparation_reparation_statut')
                        ->whereColumn('id_reparation', 't_reparation.id');
                })
                    ->whereHas('statut', function ($q) {
                        $q->where('nom', 'Créé');
                    });
            })->get();

        $montantTotal = $reparationsPayees->sum(function ($reparation) {
            return $reparation->details->sum('prix');
        });

        return response()->json([
            'total' => $montantTotal,
            'count' => $reparationsPayees->count()
        ]);

        // return $reparationsPayees;
    }

    public function getMontantTotalInterventionsTerminees()
    {
        $reparationsPayees = Reparation::with(['details.typeReparation', 'statusHistory.statut'])
            ->whereHas('statusHistory', function ($query) {
                $query->where('date', function ($subQuery) {
                    $subQuery->selectRaw('max(date)')
                        ->from('t_reparation_reparation_statut')
                        ->whereColumn('id_reparation', 't_reparation.id');
                })
                    ->whereHas('statut', function ($q) {
                        $q->where('nom', 'Terminé');
                    });
            })->get();

        $montantTotal = $reparationsPayees->sum(function ($reparation) {
            return $reparation->details->sum('prix');
        });

        return response()->json([
            'total' => $montantTotal,
            'count' => $reparationsPayees->count()
        ]);

        // return $reparationsPayees;
    }

    public function getMontantTotalInterventions(Request $request)
    {
        $validated = $request->validate([
            'statut' => 'required|string|max:255',
        ]);

        $reparations = Reparation::with(['details.typeReparation', 'statusHistory.statut'])
            ->whereHas('statusHistory', function ($query) use ($validated) {
                $query->where('date', function ($subQuery) {
                    $subQuery->selectRaw('max(date)')
                        ->from('t_reparation_reparation_statut')
                        ->whereColumn('id_reparation', 't_reparation.id');
                })
                    ->whereHas('statut', function ($q) use ($validated) {
                        $q->where('nom', $validated['statut']);
                    });
            })->get();

        $montantTotal = $reparations->sum(function ($reparation) {
            return $reparation->details->sum('prix');
        });

        return response()->json([
            'statut_recherche' => $validated['statut'],
            'total' => $montantTotal,
            'count' => $reparations->count()
        ]);
    }

    // public function getStatsInterventionsParJour(Request $request)
    // {
    //     $validated = $request->validate([
    //         'statut' => 'required|string|max:255',
    //         'date_debut' => 'required|date',
    //         'date_fin' => 'required|date|after_or_equal:date_debut',
    //     ]);

    //     $reparations = Reparation::with(['details', 'statusHistory'])
    //         ->whereHas('statusHistory', function ($query) use ($validated) {
    //             $query->where('date', function ($subQuery) {
    //                 $subQuery->selectRaw('max(date)')
    //                     ->from('t_reparation_reparation_statut')
    //                     ->whereColumn('id_reparation', 't_reparation.id');
    //             })
    //                 ->whereBetween('date', [$validated['date_debut'], $validated['date_fin']])

    //                 ->whereHas('statut', function ($q) use ($validated) {
    //                     $q->where('nom', $validated['statut']);
    //                 });
    //         })->get();

    //     $stats = $reparations->groupBy(function ($item) {

    //         return \Carbon\Carbon::parse($item->statusHistory->max('date'))->format('Y-m-d');
    //     })->map(function ($group, $jour) {
    //         return [
    //             'jour' => $jour,
    //             'nb_reparations' => $group->count(),
    //             'montant_total' => $group->sum(function ($reparation) {
    //                 return $reparation->details->sum('prix');
    //             }),
    //         ];
    //     })->values();

    //     return response()->json([
    //         'statut_filtre' => $validated['statut'],
    //         'periode' => ['du' => $validated['date_debut'], 'au' => $validated['date_fin']],
    //         'stats' => $stats
    //     ]);
    // }use Carbon\Carbon;

public function getStatsInterventionsParJour(Request $request)
{
    $validated = $request->validate([
        'statut' => 'required|string|max:255',
        'date_debut' => 'required|date',
        'date_fin' => 'required|date|after_or_equal:date_debut',
    ]);

    // 1. Récupération des données réelles
    $reparations = Reparation::with(['details', 'statusHistory'])
        ->whereHas('statusHistory', function ($query) use ($validated) {
            $query->where('date', function ($subQuery) {
                $subQuery->selectRaw('max(date)')
                    ->from('t_reparation_reparation_statut')
                    ->whereColumn('id_reparation', 't_reparation.id');
            })
            ->whereBetween('date', [$validated['date_debut'], $validated['date_fin']])
            ->whereHas('statut', function ($q) use ($validated) {
                $q->where('nom', $validated['statut']);
            });
        })->get();

    // 2. Groupement des données existantes par jour
    $groupedData = $reparations->groupBy(function ($item) {
        return Carbon::parse($item->statusHistory->max('date'))->format('Y-m-d');
    });

    // 3. Génération de la période complète entre les deux dates
    $period = CarbonPeriod::create($validated['date_debut'], $validated['date_fin']);
    
    $stats = [];
    foreach ($period as $date) {
        $jour = $date->format('Y-m-d');
        
        // Si des données existent pour ce jour, on calcule, sinon on met 0
        if ($groupedData->has($jour)) {
            $group = $groupedData->get($jour);
            $stats[] = [
                'jour' => $jour,
                'nb_reparations' => $group->count(),
                'montant_total' => $group->sum(fn($r) => $r->details->sum('prix')),
            ];
        } else {
            $stats[] = [
                'jour' => $jour,
                'nb_reparations' => 0,
                'montant_total' => 0,
            ];
        }
    }

    return response()->json([
        'statut_filtre' => $validated['statut'],
        'periode' => ['du' => $validated['date_debut'], 'au' => $validated['date_fin']],
        'stats' => $stats
    ]);
}


}
