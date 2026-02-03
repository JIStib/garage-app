<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProduitController;

use Kreait\Laravel\Firebase\Facades\Firebase;
use Kreait\Firebase\Factory;
use Kreait\Firebase\ServiceAccount;
use Kreait\Firebase\Database;
use Google\Cloud\Firestore\FirestoreClient;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/gg', function () {
    return 'gg!!';
});

Route::get('/test', function () {
    // $factory = (new Factory)->withServiceAccount(__DIR__ . '/../test.json');
    $factory = (new Factory)->withServiceAccount(__DIR__ . '/../storage/app/firebase/firebase-credential.json');
    // dd($factory);
    $firestore = $factory->createFirestore();
    $database = $firestore->database();
    $testRef = $database->collection("produits")->newDocument();

    $testRef->set(
        [
            'nom' => 'iPhone 15',
            'prix' => 999,
            'categorie' => [
                'id' => 'cat_001',
                'nom' => 'Électronique' // Dénormalisation ici
            ],
            'created_at' => now()
        ]
    );

    return 'store!';
});

Route::get('/test2', function () {
    $d = app('firebase.firestore')->database()->collection('produits')->newDocument();

    $d->set(
        [
            'nom' => 'jlxifjiu',
            'prix' => 999,
            'categorie' => [
                'id' => 'cat_001',
                'nom' => 'Électronique' // Dénormalisation ici
            ],
            'created_at' => now()
        ]
    );

    return 'gg!';
});

// Route::get('/add-type-reparation', function () {
//     $d = app('firebase.firestore')->database()->collection('types_reparation')->newDocument();

//     $d->set(
//         [
//             'nom' => 'gg',
//             'duree' => 10,
//             'prix' => 49.99
//         ]
//     );

//     return 'gg!';
// });

Route::get('/add-type-reparation', function () {
    $customId = 1;

    $d = app('firebase.firestore')->database()->collection('types_reparation')->document($customId);

    $d->set([
        'nom' => 'ggggg',
        'duree' => 10,
        'prix' => 49.99
    ]);

    return "Document avec l'ID '{$customId}' ajouté avec succès !";
});

Route::get('/add-reparation', function () {
    // $d = app('firebase.firestore')->database()->collection('types_reparation')->document($customId);
    $newDocRef = app('firebase.firestore')->database()->collection('reparations')->newDocument();

    $newDocRef->set([
        "id_utilisateur_firebase" => "U001",
        "details" => [
            [
                "id" => 1,
                "id_reparation" => $newDocRef->id(),
                "id_type_reparation" => 1,
                "est_termine" => true,
                "prix" => 100.00,
                "type_reparation" => [
                    "id" => 1,
                    "nom" => "Freins",
                    "duree" => 5,
                    "prix" => 100.00
                ]
            ],
            [
                "id" => 2,
                "id_reparation" => $newDocRef->id(),
                "id_type_reparation" => 2,
                "est_termine" => false,
                "prix" => 100.00,
                "type_reparation" => [
                    "id" => 2,
                    "nom" => "Vidange",
                    "duree" => 5,
                    "prix" => 100.00
                ]
            ],
            [
                "id" => 3,
                "id_reparation" => $newDocRef->id(),
                "id_type_reparation" => 3,
                "est_termine" => true,
                "prix" => 100.00,
                "type_reparation" => [
                    "id" => 3,
                    "nom" => "Filtre",
                    "duree" => 5,
                    "prix" => 100.00
                ]
            ],
        ],
        "status_history" => [
            [
                "id" => 1,
                "id_reparation" => $newDocRef->id(),
                "id_reparation_statut" => 1,
                "date" => now(),
                "statut" => [
                    "id" => 1,
                    "nom" => "Créé"
                ]
            ]
        ]
    ]);

    return "gg!";
});

// Route::get('/store', [ProduitController::class, 'store']);
// Route::get('/produits/{id}', [ProduitController::class, 'show']);
