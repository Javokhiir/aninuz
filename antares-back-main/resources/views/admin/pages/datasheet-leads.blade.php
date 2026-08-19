@extends('layouts.admin')

@section('breadcrumb')
    @include('admin.partials.breadcrumb', [
        'title' => 'Datasheet leads',
        'list' => [
            [
                'name' => 'Datasheet leads',
                'current' => true
            ]
        ]
    ])
@endsection

@section('content')
<div class="card">
    <div class="card-body">
        <div class="table-wrap">
            <div class="table-header">
                @include('admin.partials.table.header', [
                  'per_page' => true,
                  'search' => true,
                ])
            </div>
            <div class="table-responsive">
                <table class="table table-borderless data-table">
                    @include('admin.partials.table.head',[
                        'fields'=>[
                            'id'=>['sortable'=>false,"name"=>"#ID"],
                            'email'=>['sortable'=>false,"name"=>"Email"],
                            'product'=>['sortable'=>false,"name"=>"Product"],
                            'locale'=>['sortable'=>false,"name"=>"Locale"],
                            'created_at'=>['sortable'=>false,"name"=>"Requested at"],
                            'actions'=>['sortable'=>false,"name"=>"",'class'=>'no-sort'],
                        ]
                    ])
                    <tbody>
                        @forelse ($items as $item)
                        <tr>
                            <td>#{{ $item->id }}</td>
                            <td><a href="mailto:{{ $item->email }}">{{ $item->email }}</a></td>
                            <td>
                                @if ($item->product)
                                    <a href="{{ dashboard_route('dashboard.products.edit', ['product' => $item->product->id]) }}">
                                        {{ $item->product->title ?? $item->product_slug }}
                                    </a>
                                @else
                                    {{ $item->product_slug ?? '—' }}
                                @endif
                            </td>
                            <td>{{ strtoupper($item->locale ?? '—') }}</td>
                            <td>{{ $item->created_at?->format('d.m.Y H:i') }}</td>
                            <td>
                                @include('admin.partials.table.actions', [
                                  'item' => $item,
                                  'destroy_route' => dashboard_route('dashboard.datasheet-leads.destroy', ['datasheet_lead'=>$item->id]),
                                ])
                            </td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="6" class="text-center py-4">No datasheet requests yet</td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
            @if (count($items))
                <div class="table-footer">
                    @include('admin.partials.table.footer', [
                        'pagination' => true,
                        'results' => true,
                        'items' => $items,
                    ])
                </div>
            @endif
        </div>
    </div>
</div>
@endsection
