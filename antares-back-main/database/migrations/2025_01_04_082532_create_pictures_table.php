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
        Schema::create('pictures', function (Blueprint $table) {
            $table->id();
            $table->string("path")->nullable();
            $table->string("path_webp")->nullable();
            $table->string("preview_path")->nullable();
            $table->string("preview_path_webp")->nullable();
            $table->string("thumb_path")->nullable();
            $table->integer('width');
            $table->integer("height");
            $table->integer('preview_width');
            $table->integer("preview_height");
            $table->integer("thumb_width");
            $table->integer("thumb_height");
            $table->string("extra")->nullable();
            $table->timestamp("processed_at")->nullable();
            $table->string('extension')->default('jpeg');
            $table->string('tmp')->nullable();
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
        Schema::dropIfExists('pictures');
        Schema::enableForeignKeyConstraints();
    }
};
