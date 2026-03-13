<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// use App\Models\Billet;
// use Illuminate\Support\Facades\Mail;
// use App\Mail\BilletConfirmation;

// Route::get('/test-email', function () {
//     $billet = Billet::with('pack')->first();
    
//     if (!$billet) {
//         return 'Aucun billet en BDD';
//     }
    
//     Mail::to('ngounerayan25@gmail.com')->send(new BilletConfirmation($billet));
    
//     return 'Email envoyé ! Vérifie ta boîte mail.';
// });

