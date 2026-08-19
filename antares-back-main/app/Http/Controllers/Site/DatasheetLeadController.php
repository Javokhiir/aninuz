<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\DatasheetLead;
use App\Models\Product;
use Illuminate\Http\Request;

class DatasheetLeadController extends Controller
{
    /**
     * Records the email a visitor gives to unlock a product datasheet.
     *
     * The file itself is served statically by the frontend; this endpoint only
     * captures the lead, so a storage failure must not block the download.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'email' => 'required|email|max:255',
            'product_slug' => 'nullable|string|max:255',
        ]);

        $product = !empty($data['product_slug'])
            ? Product::where('slug', $data['product_slug'])->first()
            : null;

        DatasheetLead::create([
            'email' => $data['email'],
            'product_slug' => $data['product_slug'] ?? null,
            'product_id' => $product?->id,
            'locale' => app()->getLocale(),
        ]);

        return response()->json(['message' => 'Lead recorded'], 201);
    }
}
