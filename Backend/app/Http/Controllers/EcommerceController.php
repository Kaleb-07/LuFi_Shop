<?php

namespace App\Http\Controllers;

use App\Models\EcommerceItem;
use Illuminate\Http\Request;

class EcommerceController extends Controller
{
    /**
     * Display a listing of visible ecommerce products.
     */
    public function index()
    {
        $items = EcommerceItem::where('is_visible', true)
            ->latest()
            ->get();

        return response()->json($items);
    }

    /**
     * Display the specified product.
     */
    public function show($id)
    {
        $item = EcommerceItem::findOrFail($id);
        
        return response()->json($item);
    }
}
