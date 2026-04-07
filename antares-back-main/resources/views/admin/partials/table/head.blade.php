<thead>
    <tr>
        @foreach ($fields as $key => $field)
            @if(isset($field['locale']) && $field['locale'])
                @foreach(\LocaleFacade::all() as $l_key)
                    <th class="@if(isset($field['class'])) {{$field['class']}} @endif">{!!$field['name']!!} {{$l_key}}</th>
                @endforeach
            @else
                <th class="@if(isset($field['class'])) {{$field['class']}} @endif">{!!$field['name']!!}</th>
            @endif
        @endforeach
    </tr>
</thead>