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

    public function settings()
    {
        $filePath = storage_path('app/settings.json');
        if (!file_exists($filePath)) {
            return response()->json([
                'shop_name' => 'LuFi Shop',
                'currency' => 'ETB',
                'tax_rate' => '0',
                'shipping_fee' => '0'
            ]);
        }
        $settings = json_decode(file_get_contents($filePath), true);
        return response()->json($settings);
    }
}
