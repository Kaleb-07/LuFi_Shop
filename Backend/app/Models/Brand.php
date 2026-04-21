<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Brand extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug', 'description', 'website'];

    public function items()
    {
        return $this->hasMany(EcommerceItem::class);
    }
}
