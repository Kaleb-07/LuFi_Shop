<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Review;
use App\Models\User;
use App\Models\EcommerceItem;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Review::truncate();
        $products = EcommerceItem::all();
        $users = User::all();

        if ($products->isEmpty() || $users->isEmpty()) {
            return;
        }

        $comments = [
            'Absolutely amazing product! Build quality is top‑notch and shipping was super fast.',
            'Great value for money. Fits perfectly and feels premium. Would definitely buy again.',
            'Exceeded my expectations. The color is exactly as shown in the photos.',
            'Very good quality, but the shipping took a bit longer than expected.',
            'Excellent service and product. I highly recommend LuFi Shop!',
            'The packaging was beautiful and the item itself is stunning.',
        ];

        foreach ($products as $product) {
            // Always add exactly 5 reviews per product
            for ($i = 0; $i < 5; $i++) {
                // Cycle through users using modulo to avoid running out
                $user = $users[$i % $users->count()];
                
                Review::create([
                    'user_id' => $user->id,
                    'product_id' => $product->id,
                    'rating' => rand(4, 5), // Keep them positive for the mockup
                    'comment' => $comments[array_rand($comments)],
                    'status' => 'active',
                ]);
            }
        }
    }
}
