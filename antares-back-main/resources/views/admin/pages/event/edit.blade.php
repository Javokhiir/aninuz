@extends('layouts.admin')

@section('breadcrumb')
    @include('admin.partials.breadcrumb', [
        'title' => 'Edit Event',
        'list' => [
            [
                'name' => 'Edit Event',
                'current' => true
            ]
        ]
    ])
@endsection

@section('content')
<form action="{{dashboard_route('dashboard.events.update', ['event' => $item->id])}}"class="dropForm" method="post" enctype="multipart/form-data">
    @csrf
    @method('PUT')
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
                            <div class="mb-3">
                                <label for="slug" class="form-label">@lang("admin.slug")</label>
                                <div class="form-floating">
                                    <input type="text" class="form-control" id="slug" name="slug" placeholder="@lang("admin.slug")" value="{{old('slug', $item->slug)}}">
                                    <label for="slug">@lang("admin.slug")</label>
                                </div>
                            </div>
                            <div>
                                <label for="address" class="form-label">@lang("admin.address")</label>
                                <div class="form-floating">
                                    <input type="text" class="form-control" id="address" name="address" placeholder="@lang("admin.address")"  value="{{old('address', $item->address)}}">
                                    <label for="address">@lang("admin.address")</label>
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
                                                name="{{$locale}}[title]" placeholder="@lang("admin.title")"
                                                value="{{ old($locale.'.title',$item->{'title:'.$locale }) }}" 
                                                required>
                                            <label for="title_{{$locale}}">@lang("admin.title")</label>
                                        </div>
                                    </div>
                                    <div>
                                        <label for="content_{{$locale}}" class="form-label">@lang("admin.content")</label>
                                        <div class="form-floating">
                                            <textarea class="form-control editor" placeholder="Leave a description here" id="content_{{$locale}}" name="{{$locale}}[content]" style="height: 150px">
                                                {{ old($locale.'.content',$item->{'content:'.$locale }) }}
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
                            <div class="mb-3">
                                <label for="status" class="form-label">@lang("admin.status")</label>
                                <select class="form-select custom-select" id="status" name="status" aria-label="Floating label select example">
                                    <option selected disabled>@lang('admin.status')</option>
                                    @foreach ($statuses as $status)
                                        <option value="{{$status}}" @if(old('status',$selected_status) == $status) selected @endif>@lang("admin.$status")</option>
                                    @endforeach
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="datepicker" class="form-label">@lang("admin.date")</label>
                                <div class="form-floating">
                                    <input type="text" class="form-control" id="datepicker" name="date" placeholder="@lang("admin.date")" value="{{old('date', $item->date)}}">
                                    <label for="datepicker">@lang("admin.date")</label>
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
<script src="https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.1/dist/index.umd.min.js"></script>
@endsection