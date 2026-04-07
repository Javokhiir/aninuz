<div class="btn-group">
    @isset($edit_route)
    <a href="{{ $edit_route }}" class="btn link-secondary"><i class="bi bi-pen"></i></a>
    @endisset
    @isset($destroy_route)
    <form action="{{ $destroy_route }}" method="POST">
        @csrf
        @method('DELETE')
        <button type="submit" class="btn link-secondary">
            <i class="bi bi-trash"></i>
        </button>
    </form>
    @endisset
</div>