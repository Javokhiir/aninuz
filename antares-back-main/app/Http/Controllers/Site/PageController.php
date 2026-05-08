<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Http\Requests\Site\ReviewRequest;
use App\Http\Resources\Site\BrandResource;
use App\Http\Resources\Site\CatalogResource;
use App\Http\Resources\Site\EventResource;
use App\Http\Resources\Site\ServiceResource;
use App\Mail\ContactForm;
use App\Models\Brand;
use App\Models\Catalog;
use App\Models\Event;
use App\Models\Review;
use App\Models\Service;
use App\Notifications\ContactFormNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;

class PageController extends Controller
{
    public function services(Request $request)
    {
        $services = Service::active();
        if ($request->has('expand')) {
            $services = $services->with(explode(', ', $request->input('expand')));
        }
        return ServiceResource::collection($services->paginate($request->input('per_page') ?? 12));
    }

    public function serviceShow(Request $request, $slug)
    {
        if ($service = Service::where('slug', $slug)) {
            if ($request->has('expand')) {
                $service = $service->with(explode(', ', $request->input('expand')));
            }
            return new ServiceResource($service->first());
        }
        abort(404);
    }

    public function events(Request $request)
    {
        $events = Event::orderBy('date')->published();
        if ($request->has('expand')) {
            $events = $events->with(explode(', ', $request->input('expand')));
        }
        return EventResource::collection($events->paginate($request->input('per_page') ?? 10));
    }

    public function eventShow(Request $request, $slug)
    {
        if ($event = Event::where('slug', $slug)) {
            if ($request->has('expand')) {
                $event = $event->with(explode(', ', $request->input('expand')));
            }
            return new EventResource($event->first());
        }
        abort(404);
    }

    public function brands()
    {
       $brands = Brand::active()->paginate(10);
       return BrandResource::collection($brands);
    }

    public function catalog(Request $request)
    {
        $catalog = Catalog::active();
        if ($request->has('expand')) {
            $catalog = $catalog->with(explode(', ', $request->input('expand')));
        }
        return CatalogResource::collection($catalog->paginate($request->input('per_page') ?? 10));
    }

    public function review(ReviewRequest $request)
    {
        $review = Review::create($request->all());
        try {
            Notification::routes([
                'mail' => ['vip.don4ik@gmail.com' => 'Doniyor Rakhimov'],
            ])->notify(new ContactFormNotification($review));
        } catch (\Throwable $e) {
            \Log::error('ContactForm notification failed: ' . $e->getMessage());
        }
        return response()->json([
            'message' => __('site.review_thanks')
        ], 200);
    }
}
