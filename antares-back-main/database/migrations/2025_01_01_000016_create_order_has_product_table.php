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
        Schema::create('order_has_products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')
                ->unsigned()
                ->constrained()
                ->onDelete('cascade');
            $table->foreignId('product_id')
                ->unsigned()
                ->constrained()
                ->onDelete('cascade');
            $table->bigInteger('quantity')->unsigned()->default(0);
            $table->double("price", 10, 2)->default(0);
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
        Schema::dropIfExists('order_has_products');
        Schema::enableForeignKeyConstraints();
    }
};
