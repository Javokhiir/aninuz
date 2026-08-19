<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('datasheet_leads', function (Blueprint $table) {
            $table->id();
            $table->string('email');
            // The product is recorded by slug as well as id: the slug survives a
            // product being deleted, so the lead still says what was asked for.
            $table->string('product_slug')->nullable();
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
            $table->string('locale', 8)->nullable();
            $table->timestamps();

            $table->index('email');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('datasheet_leads');
    }
};
