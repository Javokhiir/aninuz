<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Http\Resources\Site\ProductResource;
use App\Models\Brand;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Notifications\ProductInfoNotification;
use Illuminate\Support\Facades\Notification;

class ProductController extends Controller
{
    public function index(Request $request, $brand)
    {
        $products = Product::where('brand', $brand);
        $brand = Brand::where('slug', $brand)->first();
        if ($request->has('category')) {
            $category = $request->input('category');
            $products = $products->whereHas('categories', function($q) use($category) {
                $q->where('slug', $category);
            });
        }
        if ($request->has('expand')) {
            $products = $products->with(explode(', ', $request->input('expand')));
        }
        return (ProductResource::collection($products->paginate($request->input('per_page') ?? 12)))
        ->additional(['meta' => [
            'color' => $brand->color,
            'svg' => $brand->svg
        ]]);
    }

    public function show(Request $request, $slug)
    {
        if ($product = Product::where('slug', $slug)) {
            if ($request->has('expand')) {
                $product = $product->with(explode(', ', $request->input('expand')));
            }
            return new ProductResource($product->first());
        }
        abort(404);
    }

    public function search(Request $request)
    {
        $query = $request->input('query');
        $products = Product::whereTranslationLike('title', "%{$query}%");
        if ($request->has('brand')) {
            $brand = $request->input('brand');
            $products = $products->where('brand', $brand);
        }
        if ($request->has('category')) {
            $category = $request->input('category');
            $products = $products->whereHas('categories', function($q) use($category) {
                $q->where('slug', $category);
            });
        }
        return ProductResource::collection($products->with('images')->get());
    }

    public function getProductInfo(Request $request)
    {
        if ($request->has('product_id')) {
            $data = $request->all();
            Notification::routes([
                'mail' => ['vip.don4ik@gmail.com' => 'Doniyor Rakhimov'],
            ])->notify(new ProductInfoNotification($data));
            return response()->json([
                'message' => __('site.review_thanks')
            ], 200);
        }
    }
}
