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
        'category_id',
        'brand_id',
        'is_visible',
        'part_number',
    ];

    protected $casts = [
        'images' => 'array',
        'is_visible' => 'boolean',
        'price' => 'float',
        'stock_quantity' => 'integer',
        'category_id' => 'integer',
        'brand_id' => 'integer',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }
}
