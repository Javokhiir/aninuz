<?php

namespace App\Http\Controllers\Admin;

use App\Exports\ParseExport;
use App\Http\Controllers\Controller;
use App\Imports\CompanyImport;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Event;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use App\Models\Service;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;

class PageController extends Controller
{
    public function dashboard()
    {
        $monthStart = Carbon::now()->startOfMonth();

        return view('admin.pages.dashboard', [
            'orders' => [
                'total' => Order::count(),
                'this_month' => Order::where('created_at', '>=', $monthStart)->count(),
                'open' => Order::whereNotIn('status', [Order::COMPLETED, Order::CANCELLED])->count(),
            ],
            'revenue' => [
                'total' => (float) Order::where('status', '!=', Order::CANCELLED)->sum('subtotal'),
                'this_month' => (float) Order::where('status', '!=', Order::CANCELLED)
                    ->where('created_at', '>=', $monthStart)
                    ->sum('subtotal'),
            ],
            'products' => [
                'total' => Product::count(),
                'active' => Product::where('status', Product::STATUS_ACTIVE)->count(),
                'out_of_stock' => Product::where('quantity', '<=', 0)->count(),
            ],
            'reviews' => [
                'total' => Review::count(),
                'this_month' => Review::where('created_at', '>=', $monthStart)->count(),
            ],
            'catalog' => [
                'categories' => Category::count(),
                'brands' => Brand::count(),
                'services' => Service::count(),
                'events' => Event::count(),
                'users' => User::count(),
            ],
            'orders_chart' => $this->ordersPerMonth(),
            'status_chart' => $this->ordersByStatus(),
            'recent_orders' => Order::latest('id')->limit(8)->get(),
            'recent_reviews' => Review::latest('id')->limit(5)->get(),
            'low_stock' => Product::with('translations')
                ->where('quantity', '<=', 0)
                ->latest('id')
                ->limit(5)
                ->get(),
        ]);
    }

    /**
     * Order counts for the last 12 months, oldest first, with empty months
     * filled in so the chart keeps a steady 12-point axis.
     */
    private function ordersPerMonth(): array
    {
        $start = Carbon::now()->startOfMonth()->subMonths(11);

        $counts = Order::where('created_at', '>=', $start)
            ->get(['created_at'])
            ->groupBy(fn ($order) => $order->created_at->format('Y-m'))
            ->map->count();

        $labels = [];
        $values = [];
        for ($i = 0; $i < 12; $i++) {
            $month = (clone $start)->addMonths($i);
            $labels[] = $month->format('M');
            $values[] = $counts->get($month->format('Y-m'), 0);
        }

        return ['labels' => $labels, 'values' => $values];
    }

    private function ordersByStatus(): array
    {
        $counts = Order::selectRaw('status, count(*) as aggregate')
            ->groupBy('status')
            ->pluck('aggregate', 'status');

        $labels = [];
        $values = [];
        foreach ($counts as $status => $count) {
            $labels[] = ucfirst(strtolower(str_replace('_', ' ', $status)));
            $values[] = $count;
        }

        return ['labels' => $labels, 'values' => $values];
    }

    public function settings()
    {
        return view('admin.pages.settings');
    }

    public function profile()
    {
        $user = Auth::user();
        return view('admin.pages.profile', [
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'about' => $user->about,
            'role' => $user->getRoleNames()->first()
        ]);
    }

    public function parse()
    {
        $ch = curl_init("https://tritorc.com/tsf-series-pipe-cutting-machine");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $html = curl_exec($ch);
        curl_close($ch);
        if ($html) {
            preg_match('/<h1>(.*?)<\/h1>/', $html, $title);
            preg_match_all('/<p>(.*?)<\/p>/', $html, $desc);
            preg_match_all('/<li style="list-style:square">(.*?)<\/li>/', $html, $features);
            dd($desc);
        }
        dd($html);
    }
}
