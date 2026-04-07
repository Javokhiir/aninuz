@extends('layouts.admin')

@section('breadcrumb')
    @include('admin.partials.breadcrumb', [
        'title' => 'Create Service',
        'list' => [
            [
                'name' => 'Create Service',
                'current' => true
            ]
        ]
    ])
@endsection

@section('content')
<form action="{{dashboard_route('dashboard.services.store')}}" class="dropForm" method="post" enctype="multipart/form-data">
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
                            <div>
                                <label for="slug" class="form-label">@lang("admin.slug")</label>
                                <div class="form-floating">
                                    <input type="text" class="form-control" id="slug" name="slug" placeholder="@lang("admin.slug")" value="{{old('slug')}}">
                                    <label for="slug">@lang("admin.slug")</label>
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
                                    <div>
                                        <label for="content_{{$locale}}" class="form-label">@lang("admin.content")</label>
                                        <div class="form-floating">
                                            <textarea class="form-control editor" placeholder="Leave a description here" id="content_{{$locale}}" name="{{$locale}}[content]" style="height: 150px">
                                                {{ old("$locale.content") }}
                                            </textarea>
                                        </div>
                                    </div>
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
                            <h5 class="card-title">@lang("admin.image")</h5>
                        </div>
                        <div class="card-body">
                            <input type="file" id="file" name="file">
                            <div class="col">
                                <label for="file" class="image-drop" id="dropArea">
                                    <div class="wrap">
                                        <span class="icon"><i class="bi bi-cloud-arrow-up"></i></span>
                                        <p>Drop your image here or select <span>click to browse</span></p>
                                        <small>PNG, JPG files are allowed</small>
                                    </div>
                                </label>
                            </div>
                            <div id="fileList"></div>
                        </div>
                    </div>
                </div>
                <div class="col">
                    <div class="card card-form">
                        <div class="card-header">
                            <h5 class="card-title">@lang("admin.extra")</h5>
                        </div>
                        <div class="card-body">
                            <div class="row row-cols-3">
                                <div class="col">
                                    <label for="is_active" class="form-label">@lang('admin.active')</label>
                                    <div class="custom-switch">
                                        <input type="checkbox" name="is_active" id="is_active" value="on" @if(old('is_active')) checked @endif>
                                        <label for="is_active">
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