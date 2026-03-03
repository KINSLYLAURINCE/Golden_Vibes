<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('billets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pack_id')->constrained()->onDelete('cascade');
            $table->string('nom_client');
            $table->string('email');
            $table->string('telephone');
            $table->integer('quantite');
            $table->integer('montant_total');
            $table->enum('mode_paiement', ['orange', 'mtn', 'notchpay']); // 
            $table->string('transaction_id')->unique();
            $table->string('qr_code')->unique();
            $table->enum('statut_paiement', ['en_attente', 'valide', 'echoue'])->default('en_attente');
            $table->enum('statut_billet', ['valide', 'utilise', 'annule'])->default('valide');
            $table->unsignedBigInteger('validated_by')->nullable();
            $table->timestamp('validated_at')->nullable();
            $table->timestamps();
            
            $table->foreign('validated_by')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('billets');
    }
};
