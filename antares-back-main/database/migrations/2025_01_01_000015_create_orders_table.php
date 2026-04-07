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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string("customer_name");
            $table->string("address")->nullable();
            $table->string("phone")->nullable();
            $table->string("email")->nullable();
            $table->string("status")->default("CREATED"); // CREATED | APPROVED | PROCESSING | COMPLETED
            $table->text("note")->nullable();
            $table->string("hash")->nullable();
            $table->double("subtotal")->unsigned()->default(0);
            $table->string("preferred_payment")->nullable();
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
        Schema::dropIfExists('orders');
        Schema::enableForeignKeyConstraints();
    }
};
