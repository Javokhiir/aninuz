<?php

namespace App\Http\Controllers\AdminApi;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 15);
        $orders = Order::with('products')->paginate($perPage);
        return response()->json($orders);
    }

    public function show(Order $order)
    {
        $order->load('products');
        return response()->json($order);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'customer_name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'products' => 'required|array',
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
            if (!$product || !Arr::get($p, 'quantity')) continue;
            $order->products()->attach($product->id, [
                'quantity' => $p['quantity'],
                'price' => $product->price
            ]);
        }
        $order->register();
        return response()->json($order, 201);
    }

    public function complete(Order $order)
    {
        $order->complete();
        return response()->json(['message' => 'Order completed']);
    }

    public function cancel(Order $order)
    {
        try {
            $order->save();
            $order->cancel();
        } catch (Exception $e) {
            return response()->json(['message' => 'Could not cancel order'], 500);
        }
        return response()->json(['message' => 'Order cancelled']);
    }
}
