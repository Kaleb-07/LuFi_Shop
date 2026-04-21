<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        return response()->json(Order::with('items.product')->latest()->get());
    }

    public function updateStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $request->validate([
            'status' => 'required|string|in:pending,processing,shipped,delivered,cancelled',
            'payment_status' => 'nullable|string|in:pending,paid,failed',
        ]);

        $order->update($request->only(['status', 'payment_status']));

        return response()->json([
            'message' => 'Order status updated successfully',
            'order' => $order->load('items.product')
        ]);
    }

    public function show($id)
    {
        return response()->json(Order::with(['items.product', 'user'])->findOrFail($id));
    }
}
