@lang('admin.feedback.first-text')


<b>@lang('admin.feedback.author'):</b> {{$message['review']['name']}}
<b>@lang('admin.feedback.email'):</b> {{$message['review']['email']}}
<b>@lang('admin.feedback.phone'):</b> {{$message['review']['phone']}}

<b>@lang('admin.feedback.message')</b>
<blockquote>{{$message['review']['message']}}</blockquote>

@lang('admin.feedback.first-text')