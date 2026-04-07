<div class="modal fade" id="faqModal" tabindex="-1" aria-labelledby="faqModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
            <h1 class="modal-title fs-5" id="faqModalLabel">Modal title</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
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
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
</div>