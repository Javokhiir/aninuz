<?php

namespace App\Http\Controllers\Admin;

use App\Facades\LocaleFacade;
use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;

class BrandController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brands = Brand::paginate(10);
        return view('admin.pages.brand.list', [
            'items' => $brands
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('admin.pages.brand.create', [
            'selected_locale' => config('app.locale'),
            'locales' => LocaleFacade::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Brand::create($this->getMassUpdateFields($request));
        session()->flash("success", "Brand was added");
        return redirect(dashboard_route('dashboard.brands.index'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Brand $brand)
    {
        return view('admin.pages.brand.edit', [
            'item' => $brand,
            'selected_locale' => config('app.locale'),
            'locales' => LocaleFacade::all()
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Brand $brand)
    {
        if ($brand) {
            $brand->update($this->getMassUpdateFields($request));
            session()->flash("success", "Brand was updated");
        } else {
            session()->flash("warning", "Brand not found");
        }
        return redirect(dashboard_route('dashboard.brands.index'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Brand $brand)
    {
        if ($brand) {
            $brand->deleteTranslations();
            $brand->delete();
            session()->flash("success", "Brand was deleted");
        } else {
            session()->flash("warning", "Brand not found");
        }
        return redirect(dashboard_route('dashboard.brands.index'));
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
                'is_active' => $request->input('is_active') == 'on' ? true : false,
            ]
        );
    }
}
