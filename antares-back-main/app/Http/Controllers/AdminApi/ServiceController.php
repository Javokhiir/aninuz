<?php

namespace App\Http\Controllers\AdminApi;

use App\Facades\LocaleFacade;
use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Services\ImageUploadService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ServiceController extends Controller
{
    private $service;

    public function __construct(ImageUploadService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 15);
        $services = Service::paginate($perPage);
        return response()->json($services);
    }

    public function show(Service $service)
    {
        return response()->json($service);
    }

    public function store(Request $request)
    {
        $service = Service::create($this->getMassUpdateFields($request));
        if ($request->hasFile('image')) {
            $pic = $this->service->upload($request->file('image'), "service_config");
            $service->images()->attach($pic->id, ['meta' => Service::LEAD_IMAGE]);
        }
        return response()->json($service, 201);
    }

    public function update(Request $request, Service $service)
    {
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
        return response()->json($service);
    }

    public function destroy(Service $service)
    {
        $service->deleteTranslations();
        if ($service->image) {
            $service->image->delete();
        }
        $service->delete();
        return response()->json(['message' => 'Service deleted']);
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
                'is_active' => $request->input('is_active') == 'on' || $request->input('is_active') == true,
            ]
        );
    }
}
