<?php

namespace App\Http\Controllers\Admin;

use App\Facades\LocaleFacade;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Product\StoreRequest;
use App\Http\Requests\Admin\Product\UpdateRequest;
use App\Imports\ProductImport;
use App\Imports\ProductJsonImport;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\Attribute;
use App\Models\ProductFaq;
use App\Services\ImageUploadService;
use App\View\Components\FaqComponent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Excel as ExcelFormat;
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

    public function importJson(Request $request, ProductJsonImport $import)
    {
        $request->validate([
            'json' => 'required|file',
        ]);

        // Checked by extension on purpose: the mimes/mimetypes rules go through
        // Symfony's guesser, which needs ext-fileinfo and is often off on shared
        // hosting.
        if (strtolower($request->file('json')->getClientOriginalExtension()) !== 'json') {
            return redirect(dashboard_route('dashboard.products.index'))
                ->with('error', 'Please upload a .json file. Use the Import button for CSV/Excel.');
        }

        // A large catalogue still takes a while to write, and shared hosting caps
        // the request; re-running the import updates rows in place, so a timed-out
        // run can simply be repeated.
        @set_time_limit(0);
        @ini_set('memory_limit', '512M');

        $entries = json_decode(file_get_contents($request->file('json')->getRealPath()), true);
        if (!is_array($entries)) {
            return redirect(dashboard_route('dashboard.products.index'))
                ->with('error', 'The uploaded file is not a valid JSON array.');
        }

        // A products key keeps the door open for a wrapped payload.
        $entries = array_is_list($entries) ? $entries : ($entries['products'] ?? []);

        $import->import($entries);

        session()->flash('success', sprintf(
            'JSON import finished: %d added, %d updated, %d skipped.',
            $import->created,
            $import->updated,
            $import->skipped
        ));

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
        $request->validate([
            'excel' => 'required|file',
        ]);

        $extension = strtolower($request->file('excel')->getClientOriginalExtension());
        if (!in_array($extension, ['csv', 'txt', 'xlsx', 'xls'], true)) {
            return redirect(dashboard_route('dashboard.products.index'))->with(
                'error',
                $extension === 'json'
                    ? 'That is a JSON file — use the Import JSON button instead.'
                    : 'Please upload a CSV or Excel file.'
            );
        }

        // Naming the reader keeps PhpSpreadsheet off its auto-detect path, which
        // calls mime_content_type() and fatals where ext-fileinfo is missing.
        $readerType = match ($extension) {
            'xlsx' => ExcelFormat::XLSX,
            'xls' => ExcelFormat::XLS,
            default => ExcelFormat::CSV,
        };

        $import = new ProductImport;

        try {
            Excel::import($import, $request->file('excel'), null, $readerType);
        } catch (\Throwable $e) {
            report($e);

            $message = str_contains($e->getMessage(), 'mime_content_type')
                ? 'Spreadsheet import needs the PHP fileinfo extension, which is disabled on this server. Enable it, or use Import JSON.'
                : 'Import failed: ' . $e->getMessage();

            return redirect(dashboard_route('dashboard.products.index'))->with('error', $message);
        }

        session()->flash('success', sprintf(
            'Import was completed: %d added, %d updated, %d skipped.',
            $import->created,
            $import->updated,
            $import->skipped
        ));

        return redirect(dashboard_route('dashboard.products.index'));
    }
}
