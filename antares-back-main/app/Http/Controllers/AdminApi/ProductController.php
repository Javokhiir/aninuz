<?php

namespace App\Http\Controllers\AdminApi;

use App\Facades\LocaleFacade;
use App\Http\Controllers\Controller;
use App\Imports\ProductImport;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\Attribute;
use App\Models\ProductFaq;
use App\Services\ImageUploadService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;

class ProductController extends Controller
{
    private $service;

    public function __construct(ImageUploadService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 15);
        $products = Product::paginate($perPage);
        return response()->json($products);
    }

    public function show(Product $product)
    {
        $product->load('images', 'categories', 'faqs');
        return response()->json($product);
    }

    public function store(Request $request)
    {
        $product = Product::create($this->getMassUpdateFields($request));
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $key => $file) {
                $pic = $this->service->upload($file, "product_config");
                $product->images()->attach($pic->id, ['meta' => $key == 0 ? Product::LEAD_IMAGE : null]);
            }
        }
        $categories = Category::whereIn('id', $request->input('categories', []))->get();
        $category_ids = $categories->map->parents()->flatten()->unique()->values()->toArray();
        $product->categories()->sync($category_ids);

        return response()->json($product, 201);
    }

    public function update(Request $request, Product $product)
    {
        $product->update($this->getMassUpdateFields($request));
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $pic = $this->service->upload($file, "product_config");
                $product->images()->attach($pic->id);
            }
        }
        $categories = Category::whereIn('id', $request->input('categories', []))->get();
        $category_ids = $categories->map->parents()->flatten()->unique()->values()->toArray();
        $product->categories()->sync($category_ids);

        return response()->json($product);
    }

    public function destroy(Product $product)
    {
        $product->deleteTranslations();
        $product->images()->delete();
        $product->forceDelete();
        return response()->json(['message' => 'Product deleted']);
    }

    public function deleteImage(Request $request, Product $product)
    {
        $image = $product->images()->where('id', $request->input('image_id'))->first();
        if ($image) {
            $storage = Storage::disk('common');
            $storage->delete($image->path);
            $storage->delete($image->preview_path);
            $storage->delete($image->thumb_path);
            $storage->delete($image->path_webp);
            $storage->delete($image->preview_path_webp);
            $image->delete();
        }
        return response()->json(['message' => 'Image deleted']);
    }

    public function import(Request $request)
    {
        Excel::import(new ProductImport, $request->file('excel'));
        return response()->json(['message' => 'Import completed']);
    }

    private function getMassUpdateFields($request)
    {
        return array_merge(
            $request->only(
                array_merge(
                    ['slug', 'articul', 'status', 'brand', 'quantity'],
                    LocaleFacade::all()
                )
            ),
            [
                'is_featured' => $request->input('is_featured') == 'on' || $request->input('is_featured') == true,
                'is_new' => $request->input('is_new') == 'on' || $request->input('is_new') == true,
            ]
        );
    }
}
