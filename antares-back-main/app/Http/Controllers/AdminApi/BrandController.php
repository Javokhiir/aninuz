<?php

namespace App\Http\Controllers\AdminApi;

use App\Facades\LocaleFacade;
use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;

class BrandController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 15);
        $brands = Brand::paginate($perPage);
        return response()->json($brands);
    }

    public function show(Brand $brand)
    {
        return response()->json($brand);
    }

    public function store(Request $request)
    {
        $brand = Brand::create($this->getMassUpdateFields($request));
        return response()->json($brand, 201);
    }

    public function update(Request $request, Brand $brand)
    {
        $brand->update($this->getMassUpdateFields($request));
        return response()->json($brand);
    }

    public function destroy(Brand $brand)
    {
        $brand->deleteTranslations();
        $brand->delete();
        return response()->json(['message' => 'Brand deleted']);
    }

    private function getMassUpdateFields($request)
    {
        return array_merge(
            $request->only(
                array_merge(
                    ['title', 'content', 'slug', 'color', 'svg'],
                    LocaleFacade::all()
                )
            ),
            [
                'is_active' => $request->input('is_active') == 'on' || $request->input('is_active') == true,
            ]
        );
    }
}
