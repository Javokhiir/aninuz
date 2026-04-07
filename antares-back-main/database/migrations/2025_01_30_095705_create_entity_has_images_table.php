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
        Schema::create('entity_has_images', function (Blueprint $table) {
            $table->foreignId('picture_id')
                ->unsigned()
                ->constrained()
                ->onDelete("cascade");
            $table->morphs("entity");
            $table->string("meta")->nullable();
        });
        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('entity_has_images');
        Schema::enableForeignKeyConstraints();
    }
};
