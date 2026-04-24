<?php

use App\Http\Controllers\EcommerceController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\SettingController as AdminSettingController;
use App\Http\Controllers\Admin\NotificationController as AdminNotificationController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ChapaController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Auth Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public Routes
Route::get('/ecommerce', [EcommerceController::class, 'index']);
Route::get('/ecommerce/settings', [EcommerceController::class, 'settings']);
Route::get('/ecommerce/{id}', [EcommerceController::class, 'show']);
Route::get('/ecommerce/{id}/related', [EcommerceController::class, 'related']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{slug}', [CategoryController::class, 'show']);
Route::get('/brands', [BrandController::class, 'index']);
Route::get('/orders', [OrderController::class, 'index']);
Route::post('/orders', [OrderController::class, 'store']);
Route::get('/orders/{order_number}', [OrderController::class, 'show']);
Route::get('/track-order/{orderNumber}', [OrderController::class, 'trackOrder']);
Route::get('/products/{id}/reviews', [ReviewController::class, 'index']);

// Payment Routes
Route::post('/payments/initialize', [ChapaController::class, 'initialize']);
Route::get('/payments/verify/{tx_ref}', [ChapaController::class, 'verify']);

// Protected Routes (Requires Login)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user/orders', [OrderController::class, 'userOrders']);
    Route::post('/reviews', [ReviewController::class, 'store']);
    
    // Admin Routes (Requires Admin Role)
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/stats', [DashboardController::class, 'stats']);
        Route::get('/reports', [DashboardController::class, 'reports']);
        
        Route::get('/reviews', [ReviewController::class, 'adminIndex']);
        Route::put('/reviews/{id}/status', [ReviewController::class, 'updateStatus']);
        Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);
        
        Route::get('/products', [ProductController::class, 'index']);
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{id}', [ProductController::class, 'update']);
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);
        
        Route::get('/orders', [AdminOrderController::class, 'index']);
        Route::get('/orders/{id}', [AdminOrderController::class, 'show']);
        Route::put('/orders/{id}/status', [AdminOrderController::class, 'updateStatus']);

        Route::get('/users', [AdminUserController::class, 'index']);
        Route::get('/staff', [AdminUserController::class, 'indexStaff']);
        Route::post('/staff', [AdminUserController::class, 'storeStaff']);
        Route::put('/staff/{id}', [AdminUserController::class, 'updateStaff']);
        Route::delete('/staff/{id}', [AdminUserController::class, 'destroy']);
        Route::get('/users/{id}', [AdminUserController::class, 'show']);
        Route::delete('/users/{id}', [AdminUserController::class, 'destroy']);
        Route::get('/users/stats', [AdminUserController::class, 'stats']);

        Route::get('/settings', [AdminSettingController::class, 'index']);
        Route::post('/settings', [AdminSettingController::class, 'update']);
        Route::get('/notifications', [AdminNotificationController::class, 'index']);
    });
});
