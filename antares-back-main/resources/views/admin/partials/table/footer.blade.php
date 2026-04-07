@if (isset($pagination) && $pagination)
    {!! $items->links('admin.partials.pagination', ['results' => $results]) !!}
@endif