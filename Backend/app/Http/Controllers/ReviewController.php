<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\EcommerceItem;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index($productId)
    {
        $reviews = Review::with('user:id,name')
            ->where('product_id', $productId)
            ->where('status', 'active')
            ->latest()
            ->get();

        return response()->json($reviews);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:ecommerce_items,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $review = Review::create([
            'user_id' => auth()->id(),
            'product_id' => $request->product_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
            'status' => 'active',
        ]);

        return response()->json($review->load('user:id,name'), 201);
    }

    // Admin Methods
    public function adminIndex()
    {
        $reviews = Review::with(['user', 'product'])
            ->latest()
            ->paginate(20);
            
        return response()->json($reviews);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:active,hidden',
        ]);

        $review = Review::findOrFail($id);
        $review->update(['status' => $request->status]);

        return response()->json($review);
    }

    public function destroy($id)
    {
        $review = Review::findOrFail($id);
        $review->delete();

        return response()->json(['message' => 'Review deleted successfully']);
    }
}
