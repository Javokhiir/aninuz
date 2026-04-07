<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Http\Resources\Site\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $categories = Category::whereNull('parent_id');
        if ($request->has('brand')) {
            $categories = $categories->where('brand', $request->input('brand'));
        }
        if ($request->has('expand')) {
            $categories = $categories->with(explode(', ', $request->input('expand')));
        }
        return CategoryResource::collection($categories->orderBy('order')->paginate($request->input('per_page') ?? 10));
    }

    public function show(Request $request, $slug)
    {
        if ($category = Category::where('slug', $slug)) {
            if ($request->has('expand')) {
                $category = $category->with(explode(', ', $request->input('expand')));
            }
            return new CategoryResource($category->first());
        }
        abort(404);
    }
}
