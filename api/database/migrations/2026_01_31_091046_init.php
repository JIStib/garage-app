<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('t_utilisateur_role', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
        });

        Schema::create('t_utilisateur', function (Blueprint $table) {
            $table->id();
            $table->string('identifiant');
            $table->string('mdp');
            $table->foreignId('id_utilisateur_role')->constrained('t_utilisateur_role')->onDelete('cascade');
        });

        Schema::create('t_type_reparation', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->integer('duree');
            $table->decimal('prix', 10, 2);
        });

        Schema::create('t_reparation', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('id_utilisateur_firebase');
        });

        Schema::create('t_reparation_detail', function (Blueprint $table) {
            $table->id();
            $table->string('id_reparation');
            $table->foreignId('id_type_reparation')
                ->constrained('t_type_reparation')
                ->onDelete('cascade');

            $table->foreign('id_reparation')
                ->references('id')
                ->on('t_reparation')
                ->onDelete('cascade');

            $table->boolean('est_termine')->default(false);
            $table->decimal('prix', 10, 2);
        });


        Schema::create('t_reparation_statut', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
        });


        Schema::create('t_reparation_reparation_statut', function (Blueprint $table) {
            $table->id();
            $table->string('id_reparation');

            $table->foreign('id_reparation')
                ->references('id')
                ->on('t_reparation')
                ->onDelete('cascade');

            $table->foreignId('id_reparation_statut')
                ->constrained('t_reparation_statut')
                ->onDelete('cascade');
            $table->timestamp('date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_reparation_reparation_statut');
        Schema::dropIfExists('t_reparation_statut');
        Schema::dropIfExists('t_reparation_detail');
        Schema::dropIfExists('t_reparation');
        Schema::dropIfExists('t_type_reparation');
        Schema::dropIfExists('t_utilisateur');
        Schema::dropIfExists('t_utilisateur_role');
    }
};
