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
        Schema::create('product_has_attribute_option', function (Blueprint $table) {
            $table->id();
            $table->foreignId('attribute_option_id')
                ->unsigned()
                ->constrained()
                ->onDelete('cascade');
            $table->foreignId('product_id')
                ->unsigned()
                ->constrained()
                ->onDelete('cascade');
            $table->timestamps();
        });
        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('product_has_attribute_option');
        Schema::enableForeignKeyConstraints();
    }
};
