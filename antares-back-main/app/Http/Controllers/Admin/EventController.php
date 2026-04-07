<?php

namespace App\Http\Controllers\Admin;

use App\Facades\LocaleFacade;
use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Services\ImageUploadService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

use function Laravel\Prompts\alert;

class EventController extends Controller
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
        $events = Event::paginate(10);
        return view('admin.pages.event.list', [
            'items' => $events
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('admin.pages.event.create', [
            'statuses' => Event::STATUSES,
            'selected_locale' => config('app.locale'),
            'locales' => LocaleFacade::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $event = Event::create($this->getMassUpdateFields($request));
        if ($request->hasFile('image')) {
            $pic = $this->service->upload($request->file('image'), "event_config");
            $event->images()->attach($pic->id, ['meta' => Event::LEAD_IMAGE]);
        }
        session()->flash("success", "Event was added");
        return redirect(dashboard_route('dashboard.events.index'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Event $event)
    {
        return view('admin.pages.event.edit', [
            'item' => $event,
            'selected_locale' => config('app.locale'),
            'locales' => LocaleFacade::all(),
            'statuses' => Event::STATUSES,
            'selected_status' => $event->status,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Event $event)
    {
        if ($event) {
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
            session()->flash("success", "Event was updated");
        } else {
            session()->flash("warning", "Event not found");
        }
        return redirect(dashboard_route('dashboard.events.index'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Event $event)
    {
        if ($event) {
            $event->deleteTranslations();
            if ($event->image) {
                $event->image->delete();
            }
            $event->delete();
            session()->flash("success", "Event was deleted");
        } else {
            session()->flash("warning", "Event not found");
        }
        return redirect(dashboard_route('dashboard.events.index'));
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
