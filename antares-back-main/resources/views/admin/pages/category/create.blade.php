@extends('layouts.admin')

@section('breadcrumb')
    @include('admin.partials.breadcrumb', [
        'title' => 'Create Category',
        'list' => [
            [
                'name' => 'Create Category',
                'current' => true
            ]
        ]
    ])
@endsection

@section('content')
<form action="{{dashboard_route('dashboard.categories.store')}}" method="post" enctype="multipart/form-data">
    @csrf
    <div class="col">
        <div class="card">
            <div class="card-body">
                <div class="d-flex justify-content-end">
                    <div class="btn-group gap-2" role="group">
                        <button type="submit" class="btn btn-form">@lang("admin.save")</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row row-cols-1 row-cols-md-2">
        <div class="col">
            <div class="row row-cols-1 mt-0 g-4">
                <div class="col">
                    <div class="card card-form">
                        <div class="card-header">
                            <h5 class="card-title">@lang("admin.info")</h5>
                            <p class="card-subtitle">Here you can change your project information</p>
                        </div>
                        <div class="card-body">
                            <div class="row row-cols-1 row-cols-md-2">
                                <div class="col">
                                    <label for="slug" class="form-label">@lang("admin.slug")</label>
                                    <div class="form-floating">
                                        <input type="text" class="form-control" id="slug" name="slug" placeholder="@lang("admin.slug")" value="{{old('slug')}}">
                                        <label for="slug">@lang("admin.slug")</label>
                                    </div>
                                </div>
                                <div class="col">
                                    <label for="brand" class="form-label">@lang('admin.brand')</label>
                                    <div class="form-floating">
                                        <select class="form-select custom-select" id="brand" name="brand">
                                            <option selected disabled>@lang('admin.brand')</option>
                                            @foreach ($brands as $brand)
                                                <option value="{{$brand->slug}}" @if(old('brand') == $brand) selected @endif>{{$brand->title}}</option>
                                            @endforeach
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card card-form">
                        <div class="card-header">
                            <h5 class="card-title">@lang("admin.details")</h5>
                            <p class="card-subtitle">Here you can change your project details</p>
                        </div>
                        <div class="card-body">
                            <nav>
                                <div class="nav nav-tabs" id="nav-tab" role="tablist">
                                    @foreach ($locales as $locale)
                                    <button class="nav-link @if($selected_locale === $locale) active @endif" id="nav-{{$locale}}-tab" data-bs-toggle="tab" 
                                        data-bs-target="#nav-{{$locale}}" type="button" role="tab" aria-controls="nav-{{$locale}}" 
                                        aria-selected="true">@lang("admin.$locale")</button>
                                    @endforeach
                                </div>
                            </nav>
                            <div class="tab-content" id="nav-tabContent">
                                @foreach ($locales as $locale)
                                <div class="tab-pane fade @if($selected_locale === $locale) show active @endif " id="nav-{{$locale}}" role="tabpanel" aria-labelledby="nav-{{$locale}}-tab" tabindex="0">
                                    <div class="my-3">
                                        <label for="title_{{$locale}}" class="form-label">@lang("admin.title") <span class="important">*</span></label>
                                        <div class="form-floating">
                                            <input type="text" class="form-control" id="title_{{$locale}}" 
                                                name="{{$locale}}[title]" placeholder="@lang("admin.title")" value="{{ old("$locale.title") }}" >
                                            <label for="title_{{$locale}}">@lang("admin.title")</label>
                                        </div>
                                    </div>
                                    {{-- <div>
                                        <label for="content_{{$locale}}" class="form-label">@lang("admin.content")</label>
                                        <div class="form-floating">
                                            <textarea class="form-control editor" placeholder="Leave a description here" id="content_{{$locale}}" name="{{$locale}}[content]" style="height: 150px">
                                                {{ old("$locale.content") }}
                                            </textarea>
                                        </div>
                                    </div> --}}
                                </div>
                                @endforeach
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col">
            <div class="row row-cols-1 mt-0 g-4">
                <div class="col">
                    <div class="card card-form">
                        <div class="card-header">
                            <h5 class="card-title">@lang("admin.extra")</h5>
                        </div>
                        <div class="card-body">
                            <div class="mb-3">
                                <label for="parent_id" class="form-label">@lang('admin.parent')</label>
                                <select class="form-select custom-select" id="parent_id" name="parent_id">
                                    <option selected disabled>@lang('admin.select_menu')</option>
                                    @foreach ($categories as $cat)
                                        <option value="{{$cat->id}}" @if(old('parent_id')) selected @endif>
                                            {{$cat->title}}
                                        </option>
                                    @endforeach
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="order" class="form-label">@lang('admin.order')</label>
                                <div class="form-floating">
                                    <input type="number" class="form-control" id="order" name="order" value="1" placeholder="order">
                                    <label for="order">@lang('admin.order')</label>
                                </div>
                            </div>
                            <div class="row row-cols-3">
                                <div class="col">
                                    <label for="is_visible" class="form-label">@lang('admin.visible')</label>
                                    <div class="custom-switch">
                                        <input type="checkbox" name="is_visible" id="is_visible" value="on" @if(old('is_visible')) checked @endif>
                                        <label for="is_visible">
                                            <div class="custom-switch-ball"><i class="bi bi-check2"></i></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</form>
@endsection

@section('css')
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" />
@endsection

@section('js')
<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
@endsection