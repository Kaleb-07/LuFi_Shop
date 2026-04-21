<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class EcommerceItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_code',
        'item_name',
        'price',
        'stock_quantity',
        'description',
        'images',
        'category_name',
        'brand_name',
        'is_visible',
        'part_number',
    ];

    protected $casts = [
        'images' => 'array',
        'is_visible' => 'boolean',
        'price' => 'float',
        'stock_quantity' => 'integer',
    ];
}
