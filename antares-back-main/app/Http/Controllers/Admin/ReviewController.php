<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reviews = Review::paginate(10);
        return view('admin.pages.reviews', [
            'items' => $reviews
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Review $review)
    {
        if ($review) {
            $review->delete();
            session()->flash("success", "Review was deleted");
        } else {
            session()->flash("warning", "Review not found");
        }
        return redirect(dashboard_route('dashboard.reviews.index'));
    }
}
