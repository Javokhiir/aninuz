<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::create('word_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('word_id')
                ->unsigned()
                ->constrained()
                ->onDelete('cascade');
            $table->string('locale')->index();
            $table->text('value')->nullable();
        });
        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('word_translations');
        Schema::enableForeignKeyConstraints();
    }
};
