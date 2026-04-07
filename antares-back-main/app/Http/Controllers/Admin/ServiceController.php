<?php

namespace App\Http\Controllers\Admin;

use App\Facades\LocaleFacade;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Service\StoreRequest;
use App\Http\Requests\Admin\Service\UpdateRequest;
use App\Models\Service;
use App\Services\ImageUploadService;
use Illuminate\Support\Facades\Storage;

use function Laravel\Prompts\alert;

class ServiceController extends Controller
{
    private $service;
    public function __construct(ImageUploadService $service) {
        $this->service = $service;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $services = Service::paginate(10);
        return view('admin.pages.service.list', [
            'items' => $services
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('admin.pages.service.create', [
            'selected_locale' => config('app.locale'),
            'locales' => LocaleFacade::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        $service = Service::create($this->getMassUpdateFields($request));
        if ($request->hasFile('image')) {
            $pic = $this->service->upload($request->file('image'), "service_config");
            $service->images()->attach($pic->id, ['meta' => Service::LEAD_IMAGE]);
        }
        session()->flash("success", "Service was added");
        return redirect(dashboard_route('dashboard.services.index'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Service $service)
    {
        return view('admin.pages.service.edit', [
            'item' => $service,
            'selected_locale' => config('app.locale'),
            'locales' => LocaleFacade::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, Service $service)
    {
        if ($service) {
            $service->update($this->getMassUpdateFields($request));
            if ($request->hasFile('image')) {
                if ($old = $service->leadImage()) {
                    $storage = Storage::disk('common');
                    $storage->delete($old->path);
                    $storage->delete($old->preview_path);
                    $storage->delete($old->thumb_path);
                    $storage->delete($old->path_webp);
                    $storage->delete($old->preview_path_webp);
                    $old->delete();
                }
                $pic = $this->service->upload($request->file('image'), "service_config");
                $service->images()->attach($pic->id, ['meta' => Service::LEAD_IMAGE]);
            }
            session()->flash("success", "Service was updated");
        } else {
            session()->flash("warning", "Service not found");
        }
        return redirect(dashboard_route('dashboard.services.index'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Service $service)
    {
        if ($service) {
            $service->deleteTranslations();
            if ($service->image) {
                $service->image->delete();
            }
            $service->delete();
            session()->flash("success", "Service was deleted");
        } else {
            session()->flash("warning", "Service not found");
        }
        return redirect(dashboard_route('dashboard.services.index'));
    }

    private function getMassUpdateFields($request)
    {
        return array_merge(
            $request->only(
                array_merge(
                    ['title', 'content', 'slug'],
                    LocaleFacade::all()
                )
            ),
            [
                'is_active' => $request->input('is_active') == 'on' ? true : false,
            ]
        );
    }
}
