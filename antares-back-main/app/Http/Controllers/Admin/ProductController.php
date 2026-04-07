<?php

namespace App\Http\Controllers\Admin;

use App\Facades\LocaleFacade;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Product\StoreRequest;
use App\Http\Requests\Admin\Product\UpdateRequest;
use App\Imports\ProductImport;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\Attribute;
use App\Models\ProductFaq;
use App\Services\ImageUploadService;
use App\View\Components\FaqComponent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;

class ProductController extends Controller
{
    private $service;
    public function __construct(ImageUploadService $service) {
        $this->service = $service;
    }

    /** Display a listing of the resource. */
    public function index()
    {
        $products = Product::paginate(10);
        return view('admin.pages.product.list', [
            'items' => $products
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $brands = Brand::get();
        $categories = Category::get();
        return view('admin.pages.product.create', [
            'selected_locale' => config('app.locale'),
            'locales' => LocaleFacade::all(),
            'statuses' => Product::STATUSES,
            'types' => Attribute::TYPES,
            'brands' => $brands,
            'categories' => $categories
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
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
        if ($request->has('faqs')) {
            foreach ($request->input('faqs') as $faqs) {
                $data = [
                    'product_id' => $product->id,
                    'is_active' => true
                ];
                foreach ($faqs as $faq_locale => $faq_value) {
                    $data[$faq_locale] = $faq_value;
                }
                ProductFaq::create($data);
            }
        }
        session()->flash("success", "Product was added");
        return redirect(dashboard_route('dashboard.products.index'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        $brands = Brand::get();
        $categories = Category::get();
        return view('admin.pages.product.edit', [
            'item' => $product,
            'selected_status' => $product->status,
            'statuses' => Product::STATUSES,
            'types' => Attribute::TYPES,
            'selected_locale' => config('app.locale'),
            'locales' => LocaleFacade::all(),
            'brands' => $brands,
            'categories' => $categories,
            'faqs' => $product->faqs()->get(),
            'faq_count' => count($product->faqs()->get()),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, Product $product)
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
        if ($request->has('faqs')) {
            $data = [];
            foreach ($request->input('faqs') as $faqs) {
                foreach ($faqs as $faq_locale => $faq_value) {
                    if (LocaleFacade::has($faq_locale)) {
                        $data[$faq_locale] = $faq_value;
                    }
                }
                $question = isset($faqs['id']) ? ProductFaq::where('id', $faqs['id'])->first() : null;
                if (!$question) {
                    $data = array_merge($data, [
                        'product_id' => $product->id,
                        'is_active' => true
                    ]);
                    ProductFaq::create($data);
                } else {
                    if (empty($data['en']['title'])) {
                        $question->deleteTranslations();
                        $question->forceDelete();
                    } else {
                        $question->update($data);
                    }
                }
            }
        }
        session()->flash("success", "Product was updated");
        return redirect(dashboard_route('dashboard.products.index'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        if ($product) {
            $product->deleteTranslations();
            $product->images()->delete();
            $product->forceDelete();
            session()->flash("success", "Product was deleted");
        } else {
            session()->flash("warning", 'Product not found');
        }
        return redirect(dashboard_route('dashboard.products.index'));
    }

    public function deleteImage(Request $request)
    {
        if ($product = Product::where('id', $request->input('product_id'))->first()) {
            $image = $product->images()->where('id', $request->input('image_id'))->first();
            $storage = Storage::disk('common');
            $storage->delete($image->path);
            $storage->delete($image->preview_path);
            $storage->delete($image->thumb_path);
            $storage->delete($image->path_webp);
            $storage->delete($image->preview_path_webp);
            $image->delete();

            return response()->json([
                "message" => "Image was updated",
            ], 200);
        }
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
                'is_featured' => $request->input('is_featured') == 'on' ? true : false,
                'is_new' => $request->input('is_new') == 'on' ? true : false,
            ]
        );
    }

    function getFAQComponent(Request $request)
    {
        $component = new FaqComponent($request->input('count'));
        return $component->render()->with($component->data());
    }

    public function import(Request $request)
    {
        Excel::import(new ProductImport, $request->file('excel'));
        return response()->json([
            "message" => "Import was completed",
        ], 200);
    }
}
