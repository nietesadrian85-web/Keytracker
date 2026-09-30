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
        Schema::create('keys', function (Blueprint $table) {
            $table->id();
            $table->string('key_code')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('location');
            $table->string('key_type')->default('Room'); // Room, Master, Cabinet, Padlock, Vehicle
            $table->string('status')->default('available'); // available, borrowed, overdue, lost, damaged
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('keys');
    }
};

