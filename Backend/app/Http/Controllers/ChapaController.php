<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChapaController extends Controller
{
    /**
     * Initialize Chapa Payment
     */
    public function initialize(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
        ]);

        $order = Order::findOrFail($request->order_id);
        
        // Chapa Secret Key from .env
        $chapaKey = env('CHAPA_SECRET_KEY');
        
        if (!$chapaKey) {
            return response()->json(['message' => 'Chapa API key not configured'], 500);
        }

        // Generate a unique transaction reference
        $tx_ref = 'LUFI-' . $order->order_number . '-' . time();
        $order->update(['payment_status' => 'pending']); // Update if needed

        // Prepare Chapa payload
        $payload = [
            'amount' => (string) $order->total_amount,
            'currency' => 'ETB',
            'email' => $order->email,
            'first_name' => explode(' ', $order->customer_name ?? 'Customer')[0],
            'last_name' => explode(' ', $order->customer_name ?? 'Customer')[1] ?? 'Name',
            'tx_ref' => $tx_ref,
            'callback_url' => env('CHAPA_CALLBACK_URL') . '/' . $tx_ref,
            'return_url' => env('CHAPA_RETURN_URL') . '?order_id=' . $order->id,
            'customization' => [
                'title' => 'LuFi Shop Order',
                'description' => "Payment for Order #{$order->order_number}",
            ]
        ];

        try {
            $response = Http::withToken($chapaKey)->post('https://api.chapa.co/v1/transaction/initialize', $payload);

            if ($response->successful()) {
                $data = $response->json();
                return response()->json([
                    'status' => 'success',
                    'checkout_url' => $data['data']['checkout_url']
                ]);
            }

            $errorData = $response->json();
            return response()->json([
                'message' => $errorData['message'] ?? 'Chapa initialization failed',
                'error' => $errorData
            ], 400);

        } catch (\Exception $e) {
            Log::error('Chapa initialization error: ' . $e->getMessage());
            return response()->json(['message' => 'Internal Server Error during payment initialization'], 500);
        }
    }

    /**
     * Verify Chapa Payment (Callback or Manual Check)
     */
    public function verify($tx_ref)
    {
        $chapaKey = env('CHAPA_SECRET_KEY');

        try {
            $response = Http::withToken($chapaKey)->get("https://api.chapa.co/v1/transaction/verify/{$tx_ref}");

            if ($response->successful()) {
                $data = $response->json();
                
                if ($data['status'] === 'success') {
                    // Find the order by reference in the tx_ref (We embedded order_number in it)
                    // Format: LUFI-TS-YYYYMMDD-XXXX-TIME
                    $parts = explode('-', $tx_ref);
                    $orderNumber = $parts[1] . '-' . $parts[2] . '-' . $parts[3];
                    
                    $order = Order::where('order_number', $orderNumber)->first();
                    
                    if ($order) {
                        $order->update([
                            'payment_status' => 'completed',
                            'status' => 'processing' // Move to processing after payment
                        ]);
                    }

                    return response()->json(['message' => 'Payment verified successfully']);
                }
            }

            return response()->json(['message' => 'Payment verification failed'], 400);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Error verifying payment'], 500);
        }
    }
}
