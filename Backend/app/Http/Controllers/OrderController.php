<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\EcommerceItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    /**
     * Display a listing of orders.
     */
    public function index()
    {
        return response()->json(Order::with('items.product')->latest()->get());
    }

    /**
     * Place a new order.
     */
    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:ecommerce_items,id',
            'items.*.quantity' => 'required|integer|min:1',
            'shipping_address' => 'required|string',
            'phone' => 'required|string',
            'email' => 'required|email',
            'payment_method' => 'string',
        ]);

        return DB::transaction(function () use ($request) {
            // Generate a unique order number (e.g., TS-2026-XXXX)
            $orderNumber = 'TS-' . date('Ymd') . '-' . strtoupper(Str::random(4));

            $order = Order::create([
                'order_number' => $orderNumber,
                'user_id' => $request->user()?->id,
                'status' => 'pending',
                'total_amount' => 0, // Will update after calculating items
                'shipping_address' => $request->shipping_address,
                'phone' => $request->phone,
                'email' => $request->email,
                'payment_method' => $request->payment_method ?? 'cod',
            ]);

            $totalAmount = 0;

            foreach ($request->items as $itemData) {
                $product = EcommerceItem::findOrFail($itemData['product_id']);
                $price = $product->price;
                $subtotal = $price * $itemData['quantity'];
                
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $itemData['quantity'],
                    'price' => $price,
                ]);

                $totalAmount += $subtotal;
                
                // Update stock if needed
                $product->decrement('stock_quantity', $itemData['quantity']);
            }

            $order->update(['total_amount' => $totalAmount]);

            return response()->json([
                'message' => 'Order placed successfully',
                'order_number' => $order->order_number,
                'order' => $order->load('items.product'),
            ], 201);
        });
    }

    /**
     * Track an order by its number.
     */
    public function show($orderNumber)
    {
        $order = Order::with('items.product')
            ->where('order_number', $orderNumber)
            ->firstOrFail();

        return response()->json($order);
    }
}
