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
        Schema::create('reviews', function (Blueprint $user) {
            $user->id();
            $user->foreignId('user_id')->constrained()->onDelete('cascade');
            $user->foreignId('product_id')->constrained('ecommerce_items')->onDelete('cascade');
            $user->integer('rating');
            $user->text('comment')->nullable();
            $user->string('status')->default('active'); // active, hidden
            $user->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
