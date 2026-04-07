<?php

namespace App\Http\Controllers\Admin;

use App\Facades\LocaleFacade;
use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Picture;
use App\Services\ImageUploadService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    private $service;
    public function __construct(ImageUploadService $service) {
        $this->service = $service;
    }
    /**
     * Display a listing of the resource.
    */
    public function index(Request $request)
    {
        $categories = Category::paginate($request->input('per_page') ?? 10);
        return view('admin.pages.category.list', [
            'items' => $categories
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $brands = Brand::get();
        return view('admin.pages.category.create', [
            'selected_locale' => config('app.locale'),
            'locales' => LocaleFacade::all(),
            'categories' => Category::orderByTranslation('title')->get(),
            'brands' => $brands,
        ]);
    }

    /**
     * Store a newly created resource in storage.
    */
    public function store(Request $request)
    {
        $category = Category::create($this->getMassUpdateFields($request));
        if ($request->hasFile('image')) {
            $pic = $this->service->upload($request->file('image'), "category_config");
            $category->images()->attach($pic->id, ['meta' => Category::LEAD_IMAGE]);
        }
        session()->flash("success", "Category was added");
        return redirect(dashboard_route('dashboard.categories.index'));
    }

    /**
     * Display the specified resource.
    */
    public function show(Category $category)
    {
        return response()->json([
            "item" => $category
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        $brands = Brand::get();
        return view('admin.pages.category.edit', [
            'item' => $category,
            'categories' => Category::where('categories.id', "<>", $category->id)->get(),
            'brands' => $brands,
            'selected_locale' => config('app.locale'),
            'locales' => LocaleFacade::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
    */
    public function update(Request $request, Category $category)
    {
        if ($category) {
            $category->update($this->getMassUpdateFields($request));
            if ($request->hasFile('image')) {
                if ($old = $category->leadImage()) {
                    $storage = Storage::disk('common');
                    $storage->delete($old->path);
                    $storage->delete($old->preview_path);
                    $storage->delete($old->thumb_path);
                    $storage->delete($old->path_webp);
                    $storage->delete($old->preview_path_webp);
                    $old->delete();
                }
                $pic = $this->service->upload($request->file('image'), "category_config");
                $category->images()->attach($pic->id, ['meta' => Category::LEAD_IMAGE]);
            }
            session()->flash("success", "Category was updated");
        } else {
            session()->flash("warning", "Category not found");
        }
        return redirect(dashboard_route('dashboard.categories.index'));
    }

    /**
     * Remove the specified resource from storage.
    */
    public function destroy(Category $category)
    {
        if ($category) {
            $category->deleteTranslations();
            $category->products()->detach();
            $category->delete();
            session()->flash("success", "Category was deleted");
        } else {
            session()->flash("warning", "Category not found");
        }
        return redirect(dashboard_route('dashboard.categories.index'));
    }

    private function getMassUpdateFields($request)
    {
        return array_merge(
            $request->only(
                array_merge(
                    ['title', 'content', 'slug', 'parent_id', 'order', 'brand'],
                    LocaleFacade::all()
                )
            ),
            [
                'is_visible' => $request->input('is_visible') == 'on' ? true : false,
            ]
        );
    }
}
