@extends('layouts.admin')

@section('breadcrumb')
    @include('admin.partials.breadcrumb', [
        'title' => 'Brands',
        'list' => [
            [
                'name' => 'Brands',
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
                  'create' => [
                    'link' => dashboard_route('dashboard.brands.create'),
                    'target' => "_self",
                    'collapse' => false
                  ]
                ])
            </div>
            <div class="table-responsive">
                <table class="table table-borderless data-table">
                    @include('admin.partials.table.head',[
                        'fields'=>[
                            'id'=>['sortable'=>false,"name"=>"#ID"],
                            'title'=>['sortable'=>false,"name"=>"Title"],
                            'status'=>['sortable'=>false,"name"=>"Status"],
                            'actions'=>['sortable'=>false,"name"=>"",'class'=>'no-sort'],
                        ]
                    ])
                    <tbody>
                        @foreach ($items as $item)
                        <tr>
                            <td>#{{ $item->id }}</td>
                            <td>
                                <div class="d-flex align-items-center">
                                    <div class="flex-shrink-0">
                                        <div class="img-block">
                                            @if($item->svg)
                                                {!!$item->svg!!}
                                            @endif
                                        </div>
                                    </div>
                                    <div class="flex-grow-1">
                                        <a href="{{ dashboard_route('dashboard.brands.edit', ['brand'=>$item->id]) }}">{{ $item->title }}</a>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="badge text-bg-{{$item->is_active ? "success" : "danger"}}">
                                    {{$item->is_active ? __('admin.active'): __('admin.not_active')}}
                                </span>
                            </td>
                            <td>
                                @include('admin.partials.table.actions', [
                                  'item' => $item,
                                  'edit_route' => dashboard_route('dashboard.brands.edit', ['brand'=>$item->id]),
                                  'destroy_route' => dashboard_route('dashboard.brands.destroy', ['brand'=>$item->id]),
                                ])
                            </td>
                        </tr>
                        @endforeach
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