<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Controllers
use App\Http\Controllers\Api\CandidatController;
use App\Http\Controllers\Api\VoteController;
use App\Http\Controllers\Api\PackController;
use App\Http\Controllers\Api\BilletController;
use App\Http\Controllers\Api\PartenaireController;
use App\Http\Controllers\Api\EvenementController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\StatsController;

// Controllers Admin
use App\Http\Controllers\Api\Admin\AuthController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\CandidatAdminController;
use App\Http\Controllers\Api\Admin\EvenementAdminController;
use App\Http\Controllers\Api\Admin\PartenaireAdminController;
use App\Http\Controllers\Api\Admin\PackAdminController;
use App\Http\Controllers\Api\Admin\MessageController;

/*
|--------------------------------------------------------------------------
| ROUTES PUBLIQUES (sans authentification)
|--------------------------------------------------------------------------
*/

// Test API
Route::get('/test', function () {
    return response()->json(['message' => 'API Golden Vibes fonctionne !']);
});

// Statistiques publiques
Route::get('/stats', [StatsController::class, 'index']);

// Candidats
Route::get('/candidats', [CandidatController::class, 'index']);
Route::get('/candidats/{id}', [CandidatController::class, 'show']);
Route::get('/candidats/{id}/votes', [CandidatController::class, 'votes']);

// Votes
Route::post('/votes', [VoteController::class, 'store']);
Route::post('/votes/callback', [VoteController::class, 'callback']); // Webhook paiement

// Billetterie
Route::get('/packs', [PackController::class, 'index']);
Route::post('/billets', [BilletController::class, 'store']);

// Partenaires
Route::get('/partenaires', [PartenaireController::class, 'index']);

// Événements
Route::get('/evenements', [EvenementController::class, 'index']);

// Contact
Route::post('/contact', [ContactController::class, 'store']);

/*
|--------------------------------------------------------------------------
| AUTHENTIFICATION ADMIN
|--------------------------------------------------------------------------
*/

Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| ROUTES ADMIN (protégées par Sanctum)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // Dashboard & Stats
    Route::get('/admin/stats', [DashboardController::class, 'stats']);
    Route::get('/admin/stats/votes', [DashboardController::class, 'statsVotes']);

    // Gestion Candidats
    Route::get('/admin/candidats', [CandidatAdminController::class, 'index']);
    Route::post('/admin/candidats', [CandidatAdminController::class, 'store']);
    Route::post('/admin/candidats/{id}', [CandidatAdminController::class, 'update']); // POST car FormData
    Route::delete('/admin/candidats/{id}', [CandidatAdminController::class, 'destroy']);

    // Gestion Événements
    Route::get('/admin/evenements', [EvenementAdminController::class, 'index']);
    Route::post('/admin/evenements', [EvenementAdminController::class, 'store']);
    Route::post('/admin/evenements/{id}', [EvenementAdminController::class, 'update']);
    Route::delete('/admin/evenements/{id}', [EvenementAdminController::class, 'destroy']);

    // Gestion Partenaires
    Route::get('/admin/partenaires', [PartenaireAdminController::class, 'index']);
    Route::post('/admin/partenaires', [PartenaireAdminController::class, 'store']);
    Route::post('/admin/partenaires/{id}', [PartenaireAdminController::class, 'update']);
    Route::delete('/admin/partenaires/{id}', [PartenaireAdminController::class, 'destroy']);

    // Gestion Billetterie
    Route::get('/admin/packs', [PackAdminController::class, 'index']);
    Route::post('/admin/packs', [PackAdminController::class, 'store']);
    Route::put('/admin/packs/{id}', [PackAdminController::class, 'update']);
    Route::delete('/admin/packs/{id}', [PackAdminController::class, 'destroy']);
    Route::get('/admin/billets', [PackAdminController::class, 'billets']);

    // Gestion Messages
    Route::get('/admin/messages', [MessageController::class, 'index']);
    Route::put('/admin/messages/{id}/lire', [MessageController::class, 'markAsRead']);

    // nouvellement ajouter pour les stats détaillées
    Route::get('/stats', [StatsController::class, 'index']);
});
