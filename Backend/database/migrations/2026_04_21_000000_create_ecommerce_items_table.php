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
        Schema::create('ecommerce_items', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->string('item_code')->unique();
            $blueprint->string('item_name');
            $blueprint->decimal('price', 10, 2);
            $blueprint->integer('stock_quantity')->default(0);
            $blueprint->text('description')->nullable();
            $blueprint->json('images')->nullable();
            $blueprint->string('category_name')->nullable();
            $blueprint->string('brand_name')->nullable();
            $blueprint->boolean('is_visible')->default(true);
            $blueprint->string('part_number')->nullable();
            $blueprint->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ecommerce_items');
    }
};
