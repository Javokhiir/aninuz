<?php

namespace App\Http\Controllers\AdminApi;

use App\Facades\LocaleFacade;
use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Services\ImageUploadService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    private $service;

    public function __construct(ImageUploadService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 15);
        $categories = Category::paginate($perPage);
        return response()->json($categories);
    }

    public function show(Category $category)
    {
        return response()->json($category);
    }

    public function store(Request $request)
    {
        $category = Category::create($this->getMassUpdateFields($request));
        if ($request->hasFile('image')) {
            $pic = $this->service->upload($request->file('image'), "category_config");
            $category->images()->attach($pic->id, ['meta' => Category::LEAD_IMAGE]);
        }
        return response()->json($category, 201);
    }

    public function update(Request $request, Category $category)
    {
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
        return response()->json($category);
    }

    public function destroy(Category $category)
    {
        $category->deleteTranslations();
        $category->products()->detach();
        $category->delete();
        return response()->json(['message' => 'Category deleted']);
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
                'is_visible' => $request->input('is_visible') == 'on' || $request->input('is_visible') == true,
            ]
        );
    }
}
