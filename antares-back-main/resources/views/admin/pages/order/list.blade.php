@extends('layouts.admin')

@section('breadcrumb')
    @include('admin.partials.breadcrumb', [
        'title' => 'Orders',
        'list' => [
            [
                'name' => 'Orders',
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
                    'link' => dashboard_route('dashboard.orders.create'),
                    'target' => "_self"
                  ]
                ])
            </div>
            <div class="table-responsive">
                <table class="table table-borderless data-table">
                    @include('admin.partials.table.head',[
                        'fields'=>[
                            'id'=>['sortable'=>false,"name"=>"#ID"],
                            'customer'=>['sortable'=>false,"name"=>"Customer"],
                            'address'=>['sortable'=>false,"name"=>"Address"],
                            'total'=>['sortable'=>false,"name"=>"Total"],
                            'status'=>['sortable'=>false,"name"=>"Status"],
                            'created_at'=>['sortable'=>false,"name"=>"Created At"],
                            'actions'=>['sortable'=>false,"name"=>"",'class'=>'no-sort'],
                        ]
                    ])
                    <tbody>
                        @foreach ($items as $item)
                            <tr>
                                <td>#{{$item->id}}</td>
                                <td>
                                    <small>{{ $item->customer_name }}</small>
                                    <a href="mailto:{{$item->email}}">{{$item->email}}</a>
                                    <br />
                                    <b>{{ $item->getPhone() }}</b>
                                </td>
                                <td>{{ $item->address }}</td>
                                <td>
                                    <b>${{getPriceFormat($item->subtotal)}}</b>
                                </td>
                                <td>
                                    {!! $item->statusLabel() !!}
                                </td>
                                <td>{{ $item->created_at->diffForHumans() }}</td>
                                <td>
                                    <div class="btn-group">
                                        {{-- @include('admin.partials.order.actions', [
                                            'complete_route' => dashboard_route('dashboard.orders.complete',['order'=>$item->id]),
                                            'cancel_route' => dashboard_route('dashboard.orders.cancel',['order'=>$item->id]),
                                        ]) --}}
                                    </div>
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
@endsection