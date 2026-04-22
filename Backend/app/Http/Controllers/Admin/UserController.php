<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function index()
    {
        // Get users with their order counts and total spent
        $users = User::where('role', 'user')
            ->withCount('orders')
            ->get()
            ->map(function ($user) {
                $user->total_spent = Order::where('user_id', $user->id)
                    ->where('status', 'delivered')
                    ->sum('total_amount');
                return $user;
            });

        return response()->json($users);
    }

    public function indexStaff()
    {
        // For now, let's say staff are users with role 'staff' or 'admin'
        $staff = User::whereIn('role', ['staff', 'admin'])
            ->get();
        
        return response()->json($staff);
    }

    public function show($id)
    {
        $user = User::findOrFail($id);
        $orders = Order::where('user_id', $id)->latest()->get();

        return response()->json([
            'user' => $user,
            'orders' => $orders
        ]);
    }

    public function storeStaff(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'role' => 'required|in:admin,staff',
        ]);

        $validated['password'] = bcrypt($validated['password']);
        $user = User::create($validated);

        return response()->json([
            'message' => 'Staff member created successfully',
            'user' => $user
        ], 201);
    }

    public function updateStaff(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'string|max:255',
            'email' => 'email|unique:users,email,' . $id,
            'role' => 'in:admin,staff',
            'password' => 'nullable|min:6',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = bcrypt($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'message' => 'Staff member updated successfully',
            'user' => $user
        ]);
    }

    public function stats()
    {
        $totalCustomers = User::where('role', 'user')->count();
        $newCustomersThisMonth = User::where('role', 'user')
            ->where('created_at', '>=', now()->startOfMonth())
            ->count();

        return response()->json([
            'total' => $totalCustomers,
            'new_this_month' => $newCustomersThisMonth,
        ]);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        try {
            // Delete associated orders if any (or you can keep them by setting user_id to null if the DB allows)
            // For this project, let's allow deletion if there are no constraints or handle them
            $user->delete();
            return response()->json(['message' => 'User deleted successfully']);
        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->getCode() == "23000") {
                return response()->json([
                    'message' => 'This customer cannot be deleted because they have order history. Consider deactivating them instead.'
                ], 422);
            }
            throw $e;
        }
    }
}
