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
@section('content')
<form action="{{dashboard_route('dashboard.brands.update', ['brand' => $item->id])}}" method="post" enctype="multipart/form-data">
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
                                    <div>
                                        <label for="title_{{$locale}}" class="form-label">@lang("admin.title") <span class="important">*</span></label>
                                        <div class="form-floating">
                                            <input type="text" class="form-control" id="title_{{$locale}}" 
                                                name="{{$locale}}[title]" placeholder="@lang("admin.title")"
                                                value="{{ old($locale.'.title',$item->{'title:'.$locale }) }}" 
                                                required>
                                            <label for="title_{{$locale}}">@lang("admin.title")</label>
                                        </div>
                                    </div>
                                    {{-- <div>
                                        <label for="content_{{$locale}}" class="form-label">@lang("admin.content")</label>
                                        <div class="form-floating">
                                            <textarea class="form-control editor" placeholder="Leave a description here" id="content_{{$locale}}" name="{{$locale}}[content]" style="height: 150px">
                                                {{ old($locale.'.content',$item->{'content:'.$locale }) }}
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
                                <label for="color" class="form-label">@lang("admin.color")</label>
                                <div class="form-floating">
                                    <input type="text" class="form-control" id="color" name="color" placeholder="@lang("admin.color")" value="{{old('color', $item->color)}}" data-jscolor="">
                                    <label for="color">@lang("admin.color")</label>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="svg" class="form-label">@lang("admin.svg")</label>
                                <div class="form-floating">
                                    <input type="text" class="form-control" id="svg" name="svg" placeholder="@lang("admin.svg")" value="{{old('svg', $item->svg)}}">
                                    <label for="svg">@lang("admin.svg")</label>
                                </div>
                            </div>
                            <div class="row row-cols-3">
                                <div class="col">
                                    <label for="is_active" class="form-label">@lang('admin.active')</label>
                                    <div class="custom-switch">
                                        <input type="checkbox" name="is_active" id="is_active" value="on" @if(old('is_active', $item->is_active)) checked @endif>
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

@section('js')
<script src="https://cdnjs.cloudflare.com/ajax/libs/jscolor/2.5.2/jscolor.min.js"></script>
<script>
    jscolor.presets.default = { // Defaults for all pickers on page
      palette: [
        '#000000', '#7d7d7d', '#870014', '#ec1c23', '#ff7e26',
      ],
    };
</script>
@endsection