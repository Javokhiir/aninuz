@extends('layouts.admin')

@section('breadcrumb')
    @include('admin.partials.breadcrumb', [
        'title' => 'Catalog',
        'list' => [
            [
                'name' => 'Catalog',
                'current' => true
            ]
        ]
    ])
@endsection

@section('content')
<div class="card mb-3">
    <div class="card card-form">
        <div class="card-body">
            <form action="{{dashboard_route('dashboard.catalog.store')}}" class="catalogForm" method="POST" enctype="multipart/form-data">
                @csrf
                <input type="file" id="file" name="files[]" multiple>
                <div class="col">
                    <label for="file" class="image-drop" id="dropArea">
                        <div class="wrap">
                            <span class="icon"><i class="bi bi-cloud-arrow-up"></i></span>
                            <p>Drop your file here or select <span>click to browse</span></p>
                        </div>
                    </label>
                </div>
                <div class="col mt-3">
                    <div class="d-flex justify-content-center">
                        <div class="btn-group" role="group">
                            <button type="submit" class="btn btn-form">Upload</button>
                        </div>
                    </div>
                </div>
            </form>
            <div id="fileList"></div>
        </div>
    </div>
</div>
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
                            'title'=>['sortable'=>false,"name"=>"Title"],
                            'status'=>['sortable'=>false,"name"=>"Status"],
                            'actions'=>['sortable'=>false,"name"=>"",'class'=>'no-sort'],
                        ]
                    ])
                    <tbody>
                        @foreach ($items as $item)
                        <tr>
                            <td>#{{ $item->id }}</td>
                            <td><a href="{{$item->file->url}}">{{ $item->title }}</a></td>
                            <td>
                                <span class="badge text-bg-{{$item->is_active ? "success" : "danger"}}">
                                    {{$item->is_active ? __('admin.active'): __('admin.not_active')}}
                                </span>
                            </td>
                            <td>
                                @include('admin.partials.table.actions', [
                                  'item' => $item,
                                  'destroy_route' => dashboard_route('dashboard.catalog.destroy', ['catalog'=>$item->id]),
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