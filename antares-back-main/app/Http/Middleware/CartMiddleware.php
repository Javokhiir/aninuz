<?php

namespace App\Http\Middleware;

use Closure;
use Darryldecode\Cart\Facades\CartFacade;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Str;

class CartMiddleware
{
    const CartHeader = "X-Ecommerce-Cart";
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $defaultCartKey = (string) Str::uuid();
        $key = $request->cookie('cart', $defaultCartKey);
        $cartId = $request->header(
            self::CartHeader,
            $request->query('cart', $key)
        );
        Log::debug($cartId);
        CartFacade::session($cartId);
        $response = $next($request);
        $response->header(self::CartHeader, $cartId);
        return $response;
    }
}
