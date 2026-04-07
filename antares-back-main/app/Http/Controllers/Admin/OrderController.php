<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::paginate(10);
        return view('admin.pages.order.list', [
            'items' => $orders
        ]);
    }

    public function create()
    {
        return view('admin.pages.order.create', [
            'products' => Product::active()->get(),
            'payment_method' => config("payment.default")
        ]);
    }

    public function store(Request $request)
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
            return redirect()->back()->withErrors($validator);
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
                    'price' => $product->price
                ]
            );
        }
        $order->register();

        session()->flash("success", "Order was created");
        return redirect(dashboard_route('dashboard.orders.index'));
    }

    public function show(Order $order)
    {
        return view('admin.pages.order.show', [
            'item' => $order
        ]);
    }

    public function complete(Order $order) 
    {
        if ($order) {
            $order->complete();
            session()->flash("success", "Order was marked as complete");
        } else {
            session()->flash("warning", "Order not found");
        }
        return redirect(dashboard_route('dashboard.orders.index'));
    }

    public function cancel(Request $request, Order $order) 
    {
        if ($order) {
            try {
                $order->save();
                $order->cancel();
            } catch (Exception $e) {
                report($e);
                session()->flash("warning", "Products could not be returned to stock");
            }
            session()->flash("success", "COD Order was cancelled");
        } else {
            session()->flash("warning", "Order not found");
        }
        return redirect(dashboard_route('dashboard.orders.index'));
    }

    public function products(Request $request)
    {
        $product = Product::active()->where('id', $request->input('product_id'))->first();
        if (!$product) {
            return response()->json(['error' => "product_not_found"], 200);
        }
        return response()->json([
            'price' => getPriceFormat($product->price),
            'available' => $product->quantity,
            'id' => $product->id,
            'name' => $product->name,
            'img' => '',
            'url' => '',
            'sku' => $product->sku,
        ], 200);
    }
}
