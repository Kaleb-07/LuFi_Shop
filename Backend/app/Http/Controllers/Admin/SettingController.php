<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    private $filePath;

    public function __construct()
    {
        $this->filePath = storage_path('app/settings.json');
    }

    public function index()
    {
        if (!file_exists($this->filePath)) {
            return response()->json([]);
        }
        $settings = json_decode(file_get_contents($this->filePath), true);
        return response()->json($settings);
    }

    public function update(Request $request)
    {
        $data = $request->all();
        $existing = [];
        
        if (file_exists($this->filePath)) {
            $existing = json_decode(file_get_contents($this->filePath), true);
        }

        $newSettings = array_merge($existing, $data);
        file_put_contents($this->filePath, json_encode($newSettings, JSON_PRETTY_PRINT));

        return response()->json(['message' => 'Settings updated successfully']);
    }
}
