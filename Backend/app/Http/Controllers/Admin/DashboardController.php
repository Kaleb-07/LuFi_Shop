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

        return response()->json([
            'stats' => [
                'revenue' => $totalRevenue,
                'orders' => $totalOrders,
                'products' => $totalProducts,
                'customers' => $totalCustomers,
            ],
            'revenueChart' => $revenueChart,
            'orderChart' => $orderChart,
        ]);
    }
}
