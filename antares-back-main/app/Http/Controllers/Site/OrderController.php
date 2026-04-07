<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Http\Resources\Site\OrderResource;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function show($hash)
    {
        if ($order = Order::where('hash', $hash)->first()) {
            return new OrderResource($order);
        }
        abort(404);
    }
}
