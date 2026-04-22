<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EcommerceItem;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index()
    {
        return response()->json(EcommerceItem::latest()->get());
    }

    public function store(Request $request)
    {
        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'item_name' => 'required|string|max:255',
            'item_code' => 'required|string|unique:ecommerce_items,item_code',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'is_visible' => 'sometimes|required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();

        // Handle image uploads
        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('products', 'public');
                $imagePaths[] = asset('storage/' . $path);
            }
        }
        $validated['images'] = $imagePaths;

        // Sync names for backward compatibility
        if ($request->category_id) {
            $validated['category_name'] = \App\Models\Category::find($request->category_id)?->name;
        }
        if ($request->brand_id) {
            $validated['brand_name'] = \App\Models\Brand::find($request->brand_id)?->name;
        }

        $product = EcommerceItem::create($validated);

        return response()->json([
            'message' => 'Product created successfully',
            'product' => $product->load(['category', 'brand'])
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $product = EcommerceItem::findOrFail($id);

        $validated = $request->validate([
            'item_name' => 'string|max:255',
            'item_code' => 'string|unique:ecommerce_items,item_code,' . $id,
            'price' => 'numeric|min:0',
            'stock_quantity' => 'integer|min:0',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'is_visible' => 'boolean',
            'remove_images' => 'nullable|array', // List of URLs to remove
        ]);

        $currentImages = $product->images ?? [];
        
        // Remove specified images
        if ($request->has('remove_images')) {
            $currentImages = array_values(array_diff($currentImages, $request->remove_images));
        }

        // Add new images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('products', 'public');
                $currentImages[] = asset('storage/' . $path);
            }
        }

        $validated['images'] = $currentImages;

        // Sync names for backward compatibility
        if ($request->category_id) {
            $validated['category_name'] = \App\Models\Category::find($request->category_id)?->name;
        }
        if ($request->brand_id) {
            $validated['brand_name'] = \App\Models\Brand::find($request->brand_id)?->name;
        }

        $product->update($validated);

        return response()->json([
            'message' => 'Product updated successfully',
            'product' => $product->load(['category', 'brand'])
        ]);
    }

    public function destroy($id)
    {
        $product = EcommerceItem::findOrFail($id);

        try {
            $product->delete();
            return response()->json(['message' => 'Product deleted successfully']);
        } catch (\Illuminate\Database\QueryException $e) {
            // Check for foreign key constraint violation (SQLSTATE[23000])
            if ($e->getCode() == "23000") {
                return response()->json([
                    'message' => 'This product cannot be deleted because it is linked to existing orders. Please delete the associated orders first or hide the product.'
                ], 422);
            }
            return response()->json(['message' => 'Server error: ' . $e->getMessage()], 500);
        }
    }
}
