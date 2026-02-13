<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vas', function (Blueprint $table) {
            $table->id();
            $table->string('date')->nullable();
            $table->string('start_time')->nullable();
            $table->string('end_time')->nullable();
            $table->string('duration')->nullable();
            $table->string('brand')->nullable();
            $table->string('sku')->nullable();
            $table->string('vas_type')->nullable();
            $table->integer('qty')->default(0);
            $table->string('operator')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vas');
    }
};
