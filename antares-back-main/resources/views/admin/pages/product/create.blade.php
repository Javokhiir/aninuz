@extends('layouts.admin')

@section('breadcrumb')
    @include('admin.partials.breadcrumb', [
        'title' => 'Create Product',
        'list' => [
            [
                'name' => 'Create Product',
                'current' => true
            ]
        ]
    ])
@endsection

@section('content')
<form action="{{dashboard_route('dashboard.products.store')}}" method="post" class="productForm" enctype="multipart/form-data">
    @csrf
    <div class="col">
        <div class="card">
            <div class="card-body">
                <div class="d-flex justify-content-between">
                    <nav>
                        <div class="nav nav-tabs" id="nav-tab" role="tablist">
                          <button class="nav-link active" id="nav-main-tab" data-bs-toggle="tab" data-bs-target="#nav-main" type="button" role="tab" aria-controls="nav-main" aria-selected="true">Main</button>
                          <button class="nav-link" id="nav-addon-tab" data-bs-toggle="tab" data-bs-target="#nav-addon" type="button" role="tab" aria-controls="nav-addon" aria-selected="false">Additional</button>
                        </div>
                    </nav>
                    <div class="btn-group gap-2" role="group">
                        <button type="submit" class="btn btn-form">@lang('admin.save')</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="tab-content" id="nav-tabContent">
        <div class="tab-pane fade show active" id="nav-main" role="tabpanel" aria-labelledby="nav-main-tab" tabindex="0">
            <div class="row row-cols-1 row-cols-md-2">
                <div class="col">
                    <div class="row row-cols-1 mt-0 g-4">
                        <div class="col">
                            <div class="card card-form">
                                <div class="card-header">
                                    <h5 class="card-title">@lang('admin.info')</h5>
                                    <p class="card-subtitle">Here you can change your product information</p>
                                </div>
                                <div class="card-body">
                                    <div class="row row-cols-1 row-cols-md-3 g-3">
                                        <div class="col">
                                            <label for="slug" class="form-label">@lang('admin.slug')</label>
                                            <div class="form-floating">
                                                <input type="text" class="form-control" id="slug" name="slug" placeholder="slug" value="{{old('slug')}}">
                                                <label for="slug">@lang('admin.slug')</label>
                                            </div>
                                        </div>
                                        <div class="col">
                                            <label for="articul" class="form-label">@lang('admin.articul')</label>
                                            <div class="form-floating">
                                                <input type="text" class="form-control" id="model" name="articul" placeholder="articul" value="{{old('articul')}}">
                                                <label for="model">@lang('admin.articul')</label>
                                            </div>
                                        </div>
                                        <div class="col">
                                            <label for="brand" class="form-label">@lang('admin.brand')</label>
                                            <div class="form-floating">
                                                <select class="form-select custom-select" id="brand" name="brand" aria-label="Floating label select example">
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
                                    <h5 class="card-title">@lang('admin.details')</h5>
                                    <p class="card-subtitle">Here you can change your product details</p>
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
                                            <div class="my-3">
                                                <label for="content_{{$locale}}" class="form-label">@lang("admin.content")</label>
                                                <div class="form-floating">
                                                    <textarea class="form-control editor" placeholder="Leave a description here" id="content_{{$locale}}" name="{{$locale}}[content]" style="height: 150px">
                                                        {{ old("$locale.content") }}
                                                    </textarea>
                                                </div>
                                            </div>
                                            <div class="my-3">
                                                <label for="table_content_{{$locale}}" class="form-label">@lang("admin.table_content")</label>
                                                <div class="form-floating">
                                                    <textarea class="form-control editor" placeholder="Leave a description here" id="table_content_{{$locale}}" name="{{$locale}}[table_content]" style="height: 150px">
                                                        {{ old("$locale.table_content") }}
                                                    </textarea>
                                                </div>
                                            </div>
                                            <div>
                                                <label for="table_content_second_{{$locale}}" class="form-label">@lang("admin.table_content")</label>
                                                <div class="form-floating">
                                                    <textarea class="form-control editor" placeholder="Leave a description here" id="table_content_second_{{$locale}}" name="{{$locale}}[table_content_second]" style="height: 150px">
                                                        {{ old("$locale.table_content_second") }}
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
                                    <h5 class="card-title">@lang('admin.images')</h5>
                                </div>
                                <div class="card-body">
                                    <input type="file" id="file" name="images[]" multiple>
                                    <div class="col">
                                        <label for="file" class="image-drop" id="dropArea">
                                            <div class="wrap">
                                                <span class="icon"><i class="bi bi-cloud-arrow-up"></i></span>
                                                <p>Drop your images here or select <span>click to browse</span></p>
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
                                    <h5 class="card-title">@lang('admin.extra')</h5>
                                </div>
                                <div class="card-body">
                                    <div class="mb-3">
                                        <label for="categories" class="form-label">@lang('admin.categories')</label>
                                        <div class="form-floating">
                                            <select class="form-select custom-select" id="categories" name="categories[]" multiple>
                                                @foreach ($categories as $category)
                                                    <option value="{{$category->id}}">{{$category->title}}</option>
                                                @endforeach
                                            </select>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label for="quantity" class="form-label">@lang('admin.quantity')</label>
                                        <div class="form-floating">
                                            <input type="text" class="form-control" id="quantity" name="quantity" placeholder="quantity" value="{{old('quantity')}}">
                                            <label for="model">@lang('admin.quantity')</label>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label for="status" class="form-label">@lang('admin.status')</label>
                                        <div class="form-floating">
                                            <select class="form-select custom-select" id="status" name="status" aria-label="Floating label select example">
                                                <option selected disabled>@lang('admin.status')</option>
                                                @foreach ($statuses as $status)
                                                    <option value="{{$status}}">@lang("admin.$status")</option>
                                                @endforeach
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="tab-pane fade" id="nav-addon" role="tabpanel" aria-labelledby="nav-addon-tab" tabindex="0">
            <div class="row row-cols-1 row-cols-md-2 mt-0 g-4">
                <div class="col">
                    <div class="card card-form">
                        <div class="card-header">
                            <div class="d-flex justify-content-between">
                                <h5 class="card-title">@lang('admin.faq')</h5>
                                <button type="button" class="btn btn-primary" id="addFaq" 
                                    data-row="0" data-url="{{dashboard_route('dashboard.products.faq_component')}}">
                                    Add
                                </button>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="accordion" id="accordionFAQ">
                                <div class="accordion-item">
                                    <h2 class="accordion-header">
                                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFAQ_0" aria-expanded="true" aria-controls="collapseFAQ_0">
                                            FAQ #1
                                        </button>
                                    </h2>
                                    <div id="collapseFAQ_0" class="accordion-collapse collapse show" data-bs-parent="#accordionFAQ">
                                        <div class="accordion-body">
                                            <nav>
                                                <div class="nav nav-tabs" id="nav-tab" role="tablist">
                                                    @foreach ($locales as $locale)
                                                    <button class="nav-link @if($selected_locale === $locale) active @endif" id="nav-faq-{{$locale}}-tab_0" data-bs-toggle="tab" 
                                                        data-bs-target="#nav-faq-{{$locale}}_0" type="button" role="tab" aria-controls="nav-faq-{{$locale}}_0" 
                                                        aria-selected="true">@lang("admin.$locale")</button>
                                                    @endforeach
                                                </div>
                                            </nav>
                                            <div class="tab-content" id="nav-tabContent">
                                                @foreach ($locales as $locale)
                                                <div class="tab-pane fade @if($selected_locale === $locale) show active @endif" id="nav-faq-{{$locale}}_0" role="tabpanel" aria-labelledby="nav-faq-{{$locale}}-tab_0" tabindex="0">
                                                    <div class="my-3">
                                                        <label for="title_{{$locale}}" class="form-label">@lang("admin.title") <span class="important">*</span></label>
                                                        <div class="form-floating">
                                                            <input type="text" class="form-control" id="title_{{$locale}}" 
                                                                name="faqs[0][{{$locale}}][title]" placeholder="@lang("admin.title")" value="{{ old("$locale.title") }}" data-locale="{{$locale}}">
                                                            <label for="title_{{$locale}}">@lang("admin.title")</label>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label for="content_{{$locale}}" class="form-label">@lang("admin.content")</label>
                                                        <div class="form-floating">
                                                            <textarea class="form-control" placeholder="Leave a description here" id="content_{{$locale}}"
                                                                name="faqs[0][{{$locale}}][content]" data-locale="{{$locale}}" style="height: 150px">
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
                    </div>
                </div>
                <div class="col"></div>
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