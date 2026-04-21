<?php

namespace Database\Seeders;

use App\Models\EcommerceItem;
use App\Models\Category;
use App\Models\Brand;
use Illuminate\Database\Seeder;

class EcommerceItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'item_code' => 'P-1',
                'item_name' => 'Wireless Headphones Pro',
                'category_name' => 'Electronics',
                'brand_name' => 'Sony',
                'price' => 120.00,
                'stock_quantity' => 45,
                'description' => 'Professional grade wireless headphones with noise cancellation.',
                'images' => ['https://picsum.photos/seed/p1/800/800'],
                'is_visible' => true,
                'part_number' => ''
            ],
            [
                'item_code' => 'P-2',
                'item_name' => 'Smartphone Ultra X',
                'category_name' => 'Electronics',
                'brand_name' => 'Samsung',
                'price' => 899.00,
                'stock_quantity' => 20,
                'description' => 'Latest flagship smartphone with stunning display and camera.',
                'images' => ['https://picsum.photos/seed/p2/800/800'],
                'is_visible' => true,
                'part_number' => ''
            ],
            [
                'item_code' => 'P-21',
                'item_name' => 'Travel Backpack Pro',
                'category_name' => 'Bags',
                'brand_name' => 'North Face',
                'price' => 120.00,
                'stock_quantity' => 25,
                'description' => 'Rugged and spacious backpack for your travel adventures.',
                'images' => ['https://picsum.photos/seed/p21/800/800'],
                'is_visible' => true,
                'part_number' => 'Backpack'
            ],
            [
                'item_code' => 'P-31',
                'item_name' => 'Running Shoes Pro',
                'category_name' => 'Shoes',
                'brand_name' => 'Nike',
                'price' => 120.00,
                'stock_quantity' => 40,
                'description' => 'Lightweight running shoes designed for speed and comfort.',
                'images' => ['https://picsum.photos/seed/p31/600/600'],
                'is_visible' => true,
                'part_number' => ''
            ],
            [
                'item_code' => 'P-41',
                'item_name' => 'Luxury Wrist Watch',
                'category_name' => 'Accessories',
                'brand_name' => 'Rolex',
                'price' => 8500.00,
                'stock_quantity' => 5,
                'description' => 'Elegant luxury watch crafted with precision engineering.',
                'images' => ['https://picsum.photos/seed/p41/600/600'],
                'is_visible' => true,
                'part_number' => ''
            ],
        ];

        foreach ($products as $productData) {
            $category = Category::where('name', $productData['category_name'])->first();
            $brand = Brand::where('name', $productData['brand_name'])->first();

            $productData['category_id'] = $category?->id;
            $productData['brand_id'] = $brand?->id;

            EcommerceItem::create($productData);
        }
    }
}
