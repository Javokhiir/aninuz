@extends('layouts.admin')

@section('title', 'Main')

@section('breadcrumb')
    @include('admin.partials.breadcrumb', [
        'title' => 'Main',
        'list' => [
            [
                'name' => 'Main',
                'current' => true
            ]
        ]
    ])
@endsection

@section('content')
<div class="row g-4 mb-4">
    @foreach ([
        [
            'label' => 'Orders',
            'value' => getPriceFormat($orders['total']),
            'hint' => $orders['this_month'] . ' this month · ' . $orders['open'] . ' open',
            'icon' => 'bi-receipt',
            'route' => 'dashboard.orders.index',
        ],
        [
            'label' => 'Revenue',
            'value' => getPriceFormat($revenue['total']),
            'hint' => getPriceFormat($revenue['this_month']) . ' this month',
            'icon' => 'bi-cash-stack',
            'route' => 'dashboard.orders.index',
        ],
        [
            'label' => 'Products',
            'value' => getPriceFormat($products['total']),
            'hint' => $products['active'] . ' active · ' . $products['out_of_stock'] . ' out of stock',
            'icon' => 'bi-box-seam',
            'route' => 'dashboard.products.index',
        ],
        [
            'label' => 'Requests',
            'value' => getPriceFormat($reviews['total']),
            'hint' => $reviews['this_month'] . ' this month',
            'icon' => 'bi-chat-dots',
            'route' => 'dashboard.reviews.index',
        ],
    ] as $card)
        <div class="col-12 col-sm-6 col-xl-3">
            <a href="{{ dashboard_route($card['route']) }}" class="text-decoration-none">
                <div class="card h-100 border-0 shadow-sm">
                    <div class="card-body d-flex align-items-center gap-3">
                        <span class="dashboard-stat-icon">
                            <i class="bi {{ $card['icon'] }}"></i>
                        </span>
                        <div class="min-w-0">
                            <div class="dashboard-stat-label">{{ $card['label'] }}</div>
                            <div class="dashboard-stat-value">{{ $card['value'] }}</div>
                            <div class="dashboard-stat-hint">{{ $card['hint'] }}</div>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    @endforeach
</div>

<div class="row g-4 mb-4">
    <div class="col-12 col-xl-8">
        <div class="card h-100 border-0 shadow-sm">
            <div class="card-body">
                <h6 class="dashboard-card-title">Orders per month</h6>
                @if (array_sum($orders_chart['values']) > 0)
                    <div class="dashboard-chart">
                        <canvas id="ordersChart"
                                data-labels='@json($orders_chart['labels'])'
                                data-values='@json($orders_chart['values'])'></canvas>
                    </div>
                @else
                    <p class="dashboard-empty">No orders in the last 12 months yet.</p>
                @endif
            </div>
        </div>
    </div>
    <div class="col-12 col-xl-4">
        <div class="card h-100 border-0 shadow-sm">
            <div class="card-body">
                <h6 class="dashboard-card-title">Orders by status</h6>
                @if (array_sum($status_chart['values']) > 0)
                    <div class="dashboard-chart">
                        <canvas id="orderStatusChart"
                                data-labels='@json($status_chart['labels'])'
                                data-values='@json($status_chart['values'])'></canvas>
                    </div>
                @else
                    <p class="dashboard-empty">No orders yet.</p>
                @endif
            </div>
        </div>
    </div>
</div>

<div class="row g-4 mb-4">
    <div class="col-12 col-xl-7">
        <div class="card h-100 border-0 shadow-sm">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="dashboard-card-title mb-0">Recent orders</h6>
                    <a href="{{ dashboard_route('dashboard.orders.index') }}" class="dashboard-card-link">View all</a>
                </div>
                @forelse ($recent_orders as $order)
                    @if ($loop->first)
                        <div class="table-responsive">
                        <table class="table table-borderless align-middle mb-0">
                            <thead>
                                <tr class="dashboard-thead">
                                    <th>#ID</th>
                                    <th>Customer</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                </tr>
                            </thead>
                            <tbody>
                    @endif
                            <tr>
                                <td>
                                    <a href="{{ dashboard_route('dashboard.orders.show', ['order' => $order->id]) }}">#{{ $order->id }}</a>
                                </td>
                                <td>
                                    <div class="dashboard-strong">{{ $order->customer_name ?: '—' }}</div>
                                    <small class="dashboard-muted">{{ $order->getPhone() ?: $order->email }}</small>
                                </td>
                                <td class="dashboard-strong">{{ getPriceFormat($order->subtotal) }}</td>
                                <td>{!! $order->statusLabel() !!}</td>
                                <td class="dashboard-muted">{{ $order->created_at?->diffForHumans() }}</td>
                            </tr>
                    @if ($loop->last)
                            </tbody>
                        </table>
                        </div>
                    @endif
                @empty
                    <p class="dashboard-empty">No orders yet.</p>
                @endforelse
            </div>
        </div>
    </div>

    <div class="col-12 col-xl-5">
        <div class="card h-100 border-0 shadow-sm">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="dashboard-card-title mb-0">Latest requests</h6>
                    <a href="{{ dashboard_route('dashboard.reviews.index') }}" class="dashboard-card-link">View all</a>
                </div>
                @forelse ($recent_reviews as $review)
                    <div class="dashboard-feed-item">
                        <div class="d-flex justify-content-between gap-2">
                            <span class="dashboard-strong">{{ $review->name ?: '—' }}</span>
                            <small class="dashboard-muted text-nowrap">{{ $review->created_at?->diffForHumans() }}</small>
                        </div>
                        <div class="dashboard-muted">{{ $review->phone ?: $review->email }}</div>
                        @if ($review->message)
                            <p class="dashboard-feed-text">{{ Str::limit($review->message, 90) }}</p>
                        @endif
                    </div>
                @empty
                    <p class="dashboard-empty">No requests from the contact form yet.</p>
                @endforelse
            </div>
        </div>
    </div>
</div>

<div class="row g-4">
    <div class="col-12 col-xl-5">
        <div class="card h-100 border-0 shadow-sm">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="dashboard-card-title mb-0">Out of stock</h6>
                    <a href="{{ dashboard_route('dashboard.products.index') }}" class="dashboard-card-link">Products</a>
                </div>
                @forelse ($low_stock as $product)
                    <div class="dashboard-feed-item d-flex justify-content-between gap-2">
                        <a href="{{ dashboard_route('dashboard.products.edit', ['product' => $product->id]) }}">
                            {{ $product->title ?: $product->slug }}
                        </a>
                        <span class="badge text-bg-danger align-self-start">0</span>
                    </div>
                @empty
                    <p class="dashboard-empty">Every product is in stock.</p>
                @endforelse
            </div>
        </div>
    </div>

    <div class="col-12 col-xl-7">
        <div class="card h-100 border-0 shadow-sm">
            <div class="card-body">
                <h6 class="dashboard-card-title">Catalog</h6>
                <div class="row g-3">
                    @foreach ([
                        ['label' => 'Categories', 'value' => $catalog['categories'], 'route' => 'dashboard.categories.index'],
                        ['label' => 'Brands', 'value' => $catalog['brands'], 'route' => 'dashboard.brands.index'],
                        ['label' => 'Services', 'value' => $catalog['services'], 'route' => 'dashboard.services.index'],
                        ['label' => 'Events', 'value' => $catalog['events'], 'route' => 'dashboard.events.index'],
                        ['label' => 'Users', 'value' => $catalog['users'], 'route' => 'dashboard.users.index'],
                    ] as $tile)
                        <div class="col-6 col-md-4">
                            <a href="{{ dashboard_route($tile['route']) }}" class="dashboard-tile">
                                <span class="dashboard-tile-value">{{ $tile['value'] }}</span>
                                <span class="dashboard-tile-label">{{ $tile['label'] }}</span>
                            </a>
                        </div>
                    @endforeach
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
