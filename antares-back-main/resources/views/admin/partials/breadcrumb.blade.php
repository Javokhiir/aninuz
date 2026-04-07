<nav aria-label="breadcrumb">
    <ol class="breadcrumb">
        <li class="breadcrumb-item">Pages</li>
        @foreach ($list as $item)
            @if (isset($item['current']) && $item['current'])
                <li class="breadcrumb-item active " aria-current="page">{{$item['name']}}</li>
            @else
                <li class="breadcrumb-item"><a href="{{dashboard_route($item['route'])}}">{{$item['name']}}</a></li>
            @endif
        @endforeach
    </ol>
</nav>
<h4 class="page-title">{{ $title }}</h4>