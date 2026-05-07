<?php

namespace App\Http\Controllers\AdminApi;

use App\Facades\LocaleFacade;
use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Services\ImageUploadService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EventController extends Controller
{
    private $service;

    public function __construct(ImageUploadService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 15);
        $events = Event::paginate($perPage);
        return response()->json($events);
    }

    public function show(Event $event)
    {
        return response()->json($event);
    }

    public function store(Request $request)
    {
        $event = Event::create($this->getMassUpdateFields($request));
        if ($request->hasFile('image')) {
            $pic = $this->service->upload($request->file('image'), "event_config");
            $event->images()->attach($pic->id, ['meta' => Event::LEAD_IMAGE]);
        }
        return response()->json($event, 201);
    }

    public function update(Request $request, Event $event)
    {
        $event->update($this->getMassUpdateFields($request));
        if ($request->hasFile('image')) {
            if ($old = $event->leadImage()) {
                $storage = Storage::disk('common');
                $storage->delete($old->path);
                $storage->delete($old->preview_path);
                $storage->delete($old->thumb_path);
                $storage->delete($old->path_webp);
                $storage->delete($old->preview_path_webp);
                $old->delete();
            }
            $pic = $this->service->upload($request->file('image'), "event_config");
            $event->images()->attach($pic->id, ['meta' => Event::LEAD_IMAGE]);
        }
        return response()->json($event);
    }

    public function destroy(Event $event)
    {
        $event->deleteTranslations();
        if ($event->image) {
            $event->image->delete();
        }
        $event->delete();
        return response()->json(['message' => 'Event deleted']);
    }

    private function getMassUpdateFields($request)
    {
        return array_merge(
            $request->only(
                array_merge(
                    ['title', 'content', 'slug', 'status', 'address', 'date', 'published_at'],
                    LocaleFacade::all()
                )
            ),
            []
        );
    }
}
