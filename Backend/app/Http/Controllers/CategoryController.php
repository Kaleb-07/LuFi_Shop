<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Display a listing of the categories.
     */
    public function index()
    {
        return response()->json(Category::withCount('items')->get());
    }

    /**
     * Display the specified category with its products.
     */
    public function show($slug)
    {
        $category = Category::where('slug', $slug)->firstOrFail();
        $products = $category->items()->where('is_visible', true)->get();

        return response()->json([
            'category' => $category,
            'products' => $products,
        ]);
    }
}
