<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\EcommerceItem;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function stats()
    {
        $totalRevenue = Order::where('status', 'delivered')->sum('total_amount');
        $totalOrders = Order::count();
        $totalProducts = EcommerceItem::count();
        $totalCustomers = User::where('role', 'user')->count();

        // Time series data for charts (Last 7 days)
        $revenueChart = Order::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(total_amount) as total')
            )
            ->where('status', 'delivered')
            ->where('created_at', '>=', now()->subDays(7))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $orderChart = Order::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as count')
            )
            ->where('created_at', '>=', now()->subDays(7))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $recentOrders = Order::latest()->take(5)->get();

        return response()->json([
            'stats' => [
                'revenue' => $totalRevenue,
                'orders' => $totalOrders,
                'products' => $totalProducts,
                'customers' => $totalCustomers,
            ],
            'revenueChart' => $revenueChart,
            'orderChart' => $orderChart,
            'recentOrders' => $recentOrders,
        ]);
    }

    public function reports(Request $request)
    {
        $period = $request->query('period', 'month'); // day, week, month, year
        
        $startDate = match($period) {
            'day' => now()->startOfDay(),
            'week' => now()->subDays(7),
            'year' => now()->startOfYear(),
            default => now()->startOfMonth(),
        };

        $chartData = Order::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(CASE WHEN status = "delivered" THEN total_amount ELSE 0 END) as revenue'),
                DB::raw('COUNT(*) as orders')
            )
            ->where('created_at', '>=', $startDate)
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $topProducts = DB::table('order_items')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->join('ecommerce_items', 'ecommerce_items.id', '=', 'order_items.product_id')
            ->select(
                'ecommerce_items.id',
                'ecommerce_items.item_name',
                DB::raw('SUM(order_items.quantity) as total_quantity'),
                DB::raw('SUM(order_items.quantity * order_items.price) as total_revenue')
            )
            ->where('orders.status', 'delivered')
            ->where('orders.created_at', '>=', $startDate)
            ->groupBy('ecommerce_items.id', 'ecommerce_items.item_name')
            ->orderByDesc('total_revenue')
            ->take(5)
            ->get();

        $summary = [
            'total_revenue' => $chartData->sum('revenue'),
            'total_orders' => $chartData->sum('orders'),
            'avg_order_value' => $chartData->sum('orders') > 0 ? $chartData->sum('revenue') / $chartData->sum('orders') : 0,
        ];

        return response()->json([
            'summary' => $summary,
            'chartData' => $chartData,
            'topProducts' => $topProducts,
        ]);
    }
}
