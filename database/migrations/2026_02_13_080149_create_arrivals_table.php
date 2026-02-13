<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('arrivals', function (Blueprint $table) {
            $table->id();
            $table->string('date')->nullable();
            $table->string('arrival_time')->nullable();
            $table->string('brand');
            $table->string('receipt_no');
            $table->string('po_no');
            $table->integer('po_qty')->default(0);
            $table->string('operator')->nullable();
            $table->text('note')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('arrivals');
    }
};
