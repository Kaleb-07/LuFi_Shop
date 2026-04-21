<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Electronics', 'icon_name' => 'Smartphone'],
            ['name' => 'Fashion', 'icon_name' => 'Shirt'],
            ['name' => 'Bags', 'icon_name' => 'ShoppingBag'],
            ['name' => 'Shoes', 'icon_name' => 'Footprints'],
            ['name' => 'Accessories', 'icon_name' => 'Watch'],
            ['name' => 'Home & Living', 'icon_name' => 'Home'],
            ['name' => 'Beauty', 'icon_name' => 'Sparkles'],
            ['name' => 'Sports', 'icon_name' => 'Trophy'],
            ['name' => 'Gadgets', 'icon_name' => 'Cpu'],
            ['name' => 'Lifestyle', 'icon_name' => 'Map'],
        ];

        foreach ($categories as $cat) {
            Category::firstOrCreate(
                ['slug' => Str::slug($cat['name'])],
                [
                    'name' => $cat['name'],
                    'icon_name' => $cat['icon_name'],
                ]
            );
        }
    }
}
