<div class="accordion-item">
    <h2 class="accordion-header">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFAQ_{{$count}}" aria-expanded="true" aria-controls="collapseFAQ_{{$count}}">
            FAQ #{{$count+1}}
        </button>
    </h2>
    <div id="collapseFAQ_{{$count}}" class="accordion-collapse collapse" data-bs-parent="#accordionFAQ">
        <div class="accordion-body">
            <nav>
                <div class="nav nav-tabs" id="nav-faq-tab" role="tablist">
                    @foreach ($locales as $locale)
                    <button class="nav-link @if($selected_locale === $locale) active @endif" id="nav-faq-{{$locale}}-tab" data-bs-toggle="tab" 
                        data-bs-target="#nav-faq-{{$locale}}-{{$count}}" type="button" role="tab" aria-controls="nav-faq-{{$locale}}-{{$count}}" 
                        aria-selected="true">@lang("admin.$locale")</button>
                    @endforeach
                </div>
            </nav>
            <div class="tab-content" id="nav-tabContent">
                @foreach ($locales as $locale)
                <div class="tab-pane fade @if($selected_locale === $locale) show active @endif" id="nav-faq-{{$locale}}-{{$count}}" role="tabpanel" aria-labelledby="nav-{{$locale}}-tab" tabindex="0">
                    <div class="my-3">
                        <label for="title_{{$locale}}" class="form-label">@lang("admin.title") <span class="important">*</span></label>
                        <div class="form-floating">
                            <input type="text" class="form-control" id="title_{{$locale}}" 
                                name="faqs[{{$count}}][{{$locale}}][title]" placeholder="@lang("admin.title")" value="{{ old("$locale.title") }}" >
                            <label for="title_{{$locale}}">@lang("admin.title")</label>
                        </div>
                    </div>
                    <div>
                        <label for="content_{{$locale}}" class="form-label">@lang("admin.content")</label>
                        <div class="form-floating">
                            <textarea class="form-control" placeholder="Leave a description here" id="content_{{$locale}}" name="faqs[{{$count}}][{{$locale}}][content]" style="height: 150px">
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