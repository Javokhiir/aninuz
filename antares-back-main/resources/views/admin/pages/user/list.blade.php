@extends('layouts.admin')

@section('breadcrumb')
    @include('admin.partials.breadcrumb', [
        'title' => 'Users',
        'list' => [
            [
                'name' => 'Users',
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
                    'link' => dashboard_route('dashboard.users.create'),
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
                            'email'=>['sortable'=>false,"name"=>"Email"],
                            'registered'=>['sortable'=>false,"name"=>"Registered"],
                            'status'=>['sortable'=>false,"name"=>"Status"],
                            'actions'=>['sortable'=>false,"name"=>"",'class'=>'no-sort'],
                        ]
                    ])
                    <tbody>
                        @foreach ($items as $item)
                        <tr>
                            <td>#{{ $item->id }}</td>
                            <td>{{ $item->name }}</td>
                            <td>
                                {{ $item->email }}
                                <br>
                                @if($item->api_token)
                                <b>Token:</b> <small><i>{{$item->api_token}}</i></small>
                                @endif
                            </td>
                            <td>{{ getDefaultFormat($item->created_at, "Y/m/d H:i:s") }}</td>
                            <td>
                                <span class="badge text-bg-{{$item->is_active ? "success" : "danger"}}">
                                    {{$item->is_active ? __('admin.active'): __('admin.not_active')}}
                                </span>
                            </td>
                            <td>
                                @include('admin.partials.table.actions', [
                                  'item' => $item,
                                  'edit_route' => dashboard_route('dashboard.users.edit', ['user'=>$item->id]),
                                  'destroy_route' => dashboard_route('dashboard.users.destroy', ['user'=>$item->id]),
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