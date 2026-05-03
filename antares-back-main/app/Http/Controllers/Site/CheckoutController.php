<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Http\Resources\Site\OrderResource;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Arr;

class CheckoutController extends Controller
{
    public function checkout(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'customer_name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'products' => 'required|array',
            'products.0.quantity' => 'required|integer|min:1',
            'products.0.id' => 'required|exists:products,id',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $order = Order::create([
            'customer_name' => $request->input('customer_name'),
            'phone' => $request->input('phone'),
            'email' => $request->input('email'),
            'address' => $request->input('address'),
        ]);
        $order->hash = md5($order->id . time());
        foreach ($request->input('products') as $p) {
            $product = Product::find(Arr::get($p, 'id'));
            if (!$product || !Arr::get($p, 'quantity')) {
                continue;
            }
            $order->products()->attach(
                $product->id,
                [
                    'quantity' => $p['quantity'],
                    'price' => 0
                ]
            );
        }
        $order->register();
        return new OrderResource($order);
    }
}
