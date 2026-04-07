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
        Schema::table('product_translations', function (Blueprint $table) {
            $table->text('table_content')->nullable();
            $table->text('table_content_second')->nullable();
        });
        Schema::enableForeignKeyConstraints();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::table('product_translations', function (Blueprint $table) {
            $table->dropColumn(['table_content', 'table_content_second']);
        });
        Schema::enableForeignKeyConstraints();
    }
};
