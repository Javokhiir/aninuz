@extends('layouts.admin')

@section('breadcrumb')
    @include('admin.partials.breadcrumb', [
        'title' => 'Events',
        'list' => [
            [
                'name' => 'Events',
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
                    'link' => dashboard_route('dashboard.events.create'),
                    'target' => "_self"
                  ]
                ])
            </div>
            <div class="table-responsive">
                <table class="table table-borderless data-table">
                    @include('admin.partials.table.head',[
                        'fields'=>[
                            'id'=>['sortable'=>false,"name"=>"#ID"],
                            'title'=>['sortable'=>false,"name"=>"Title"],
                            'content'=>['sortable'=>false,"name"=>"Content"],
                            'status'=>['sortable'=>false,"name"=>"Status"],
                            'date'=>['sortable'=>false,"name"=>"Date"],
                            'published_at'=>['sortable'=>false,"name"=>"Published At"],
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
                                            @if($img = $item->leadImage())
                                                <img src="{{$img->thumb_url}}" 
                                                    width="{{$img->thumb_width}}" 
                                                    height="{{$img->thumb_height}}"
                                                    alt="{{$item->title}}">
                                                @endif
                                        </div>
                                    </div>
                                    <div class="flex-grow-1">
                                        <a href="{{ dashboard_route('dashboard.events.edit', ['event'=>$item->id]) }}">{{ $item->title }}</a>
                                    </div>
                                </div>
                            </td>
                            <td>
                                {!! $item->content !!}
                            </td>
                            <td>
                                {!! $item->statusLabel() !!}
                            </td>
                            <td>{{getDefaultFormat($item->date)}}</td>
                            <td>{{getDefaultFormat($item->published_at)}}</td>
                            <td>
                                @include('admin.partials.table.actions', [
                                  'item' => $item,
                                  'edit_route' => dashboard_route('dashboard.events.edit', ['event'=>$item->id]),
                                  'destroy_route' => dashboard_route('dashboard.events.destroy', ['event'=>$item->id]),
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