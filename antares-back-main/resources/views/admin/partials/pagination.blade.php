@if ($paginator->hasPages())
<div class="row">
    @if ($results)
    <div class="col-6 d-flex align-items-center">
        <div class="showing-info">
            Showing
            {{ $paginator->firstItem() }}
            to 
            {{ $paginator->lastItem() }} 
            of 
            {{ $paginator->total() }} 
            entries
        </div>
    </div>
    @endif
    
    <div class="col-6">
        <ul class="pagination justify-content-end">
            @if (!$paginator->onFirstPage())
                <li class="page-item">
                    <a class="page-link prev-link" href="{{ $paginator->previousPageUrl() }}" rel="prev">
                        <span class="icon"><i class="bi bi-chevron-left"></i></span>
                    </a>
                </li>
            @endif
            @foreach ($elements as $element)
                @if (is_string($element))
                    <li class="page-item disabled"><span class="page-link">{{ $element }}</span></li>
                @endif

                @if (is_array($element))
                    @foreach ($element as $page => $url)
                        @if ($page == $paginator->currentPage())
                            <li class="page-item active" aria-current="page"><span class="page-link">{{ $page }}</span></li>
                        @else
                            <li class="page-item"><a class="page-link" href="{{ $url }}">{{ $page }}</a></li>
                        @endif
                    @endforeach
                @endif
            @endforeach
            
            @if ($paginator->hasMorePages())
                <li class="page-item">
                    <a class="page-link next-link" href="{{ $paginator->nextPageUrl() }}" rel="next">
                        <span class="icon"><i class="bi bi-chevron-right"></i></span>
                    </a>
                </li>
            @endif
        </ul>
    </div>
</div>
@endif