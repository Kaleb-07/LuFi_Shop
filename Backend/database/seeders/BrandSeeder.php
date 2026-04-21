<?php

namespace Database\Seeders;

use App\Models\Brand;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BrandSeeder extends Seeder
{
    public function run(): void
    {
        $brands = [
            'Sony', 'Samsung', 'LG', 'Asus', 'JBL', 'Anker', 'Apple', 'Huawei',
            'Zara', 'H&M', 'Levi\'s', 'Uniqlo', 'Nike', 'Adidas', 'Mango', 'Lacoste',
            'North Face', 'Samsonite', 'Gucci', 'Fossil', 'Coach', 'Clarks', 'Timberland', 'Vans',
        ];

        foreach ($brands as $brandName) {
            Brand::firstOrCreate(
                ['slug' => Str::slug($brandName)],
                ['name' => $brandName]
            );
        }
    }
}
