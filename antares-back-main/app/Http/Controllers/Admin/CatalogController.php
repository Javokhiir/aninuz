<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Catalog;
use App\Services\FileUploadService;
use Illuminate\Http\Request;

class CatalogController extends Controller
{
    private $service;
    public function __construct(FileUploadService $service) {
        $this->service = $service;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $catalogs = Catalog::paginate(10);
        return view('admin.pages.catalog', [
            'items' => $catalogs
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $key => $file) {
                $f = $this->service->upload($file);
                $catalog = Catalog::create([
                    'title' => pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME),
                    'is_active' => true
                ]);
                $catalog->files()->attach($f->id);
            }
        }
        session()->flash("success", "Catalog was added");
        return redirect(dashboard_route('dashboard.catalog.index'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Catalog $catalog)
    {
        if ($catalog) {
            $catalog->files()->delete();
            $catalog->delete();
            session()->flash("success", "Catalog was deleted");
        } else {
            session()->flash("warning", "Catalog not found");
        }
        return redirect(dashboard_route('dashboard.catalog.index'));
    }
}
