<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use App\Models\EcommerceItem;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = [];

        // 1. All Pending Orders
        $newOrders = Order::where('status', 'pending')
            ->latest()
            ->take(10)
            ->get();
        
        foreach ($newOrders as $order) {
            $notifications[] = [
                'id' => 'order_' . $order->id,
                'type' => 'order',
                'title' => 'Pending Order',
                'message' => "Order #{$order->order_number} by {$order->customer_name}",
                'time' => $order->created_at->diffForHumans(),
                'link' => '/admin/orders',
                'is_read' => false
            ];
        }

        // 2. Low Stock Items (less than 5)
        $lowStock = EcommerceItem::where('stock_quantity', '<', 5)
            ->where('is_visible', true)
            ->take(5)
            ->get();

        foreach ($lowStock as $item) {
            $notifications[] = [
                'id' => 'stock_' . $item->id,
                'type' => 'stock',
                'title' => 'Low Stock Alert',
                'message' => "{$item->item_name} has only {$item->stock_quantity} left",
                'time' => 'Just now',
                'link' => '/admin/products',
                'is_read' => false
            ];
        }

        // 3. New Customers (last 24 hours)
        $newCustomers = User::where('role', 'user')
            ->where('created_at', '>=', now()->subDay())
            ->latest()
            ->take(3)
            ->get();

        foreach ($newCustomers as $customer) {
            $notifications[] = [
                'id' => 'user_' . $customer->id,
                'type' => 'user',
                'title' => 'New Customer',
                'message' => "{$customer->name} has joined the shop",
                'time' => $customer->created_at->diffForHumans(),
                'link' => '/admin/customers',
                'is_read' => false
            ];
        }

        return response()->json($notifications);
    }
}
