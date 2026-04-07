@extends('layouts.admin')

@section('breadcrumb')
    @include('admin.partials.breadcrumb', [
        'title' => 'Products',
        'list' => [
            [
                'name' => 'Products',
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
                  'import' => [
                    'link' => dashboard_route('dashboard.products.import')
                  ],
                  'create' => [
                    'link' => dashboard_route('dashboard.products.create'),
                    'target' => "_self"
                  ]
                ])
            </div>
            <div class="table-responsive">
                <table class="table table-borderless data-table">
                    @include('admin.partials.table.head',[
                        'fields'=>[
                            'id'=>['sortable'=>false,"name"=>"#ID"],
                            'name'=>['sortable'=>false,"name"=>"Name"],
                            'articul'=>['sortable'=>false,"name"=>"Articul"],
                            'brand'=>['sortable'=>false,"name"=>"Brand"],
                            'status'=>['sortable'=>false,"name"=>"Status"],
                            'created_at'=>['sortable'=>false,"name"=>"Created At"],
                            'actions'=>['sortable'=>false,"name"=>"",'class'=>'no-sort'],
                        ]
                    ])
                    <tbody>
                        @foreach ($items as $item)
                            <tr>
                                <td>{{ $item->id }}</td>
                                <td>
                                    <a href="{{dashboard_route('dashboard.products.edit',['product'=>$item->id])}}" style="font-size:13px">
                                        {{$item->title}}
                                    </a>
                                </td>
                                <td>{{ $item->articul }}</td>
                                <td>{{ $item->brand }}</td>
                                <td>
                                    {!! $item->statusLabel() !!}
                                </td>
                                <td>
                                    {{ getDefaultFormat($item->created_at, "Y-m-d") }}
                                </td>
                                <td>
                                    @include('admin.partials.table.actions', [
                                        'item' => $item,
                                        'edit_route' => dashboard_route('dashboard.products.edit', ['product'=>$item->id]),
                                        'destroy_route' => dashboard_route('dashboard.products.destroy', ['product'=>$item->id]),
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