<div class="d-flex">
    <div class="col-12 col-md-9 d-flex align-items-center">
        @if (isset($per_page) && $per_page)
        <div class="showing-form">
            <label for="showing">Showing</label>
            <select class="form-control mx-2" id="showing">
                <option>10</option>
                <option>20</option>
                <option>30</option>
            </select>
            <span>entries</span>
        </div>
        @endif
        @if (isset($search) && $search)
        <div class="search-form">
            <input class="form-control" type="text" placeholder="Search here..." id="search">
            <span class="icon"><i class="bi bi-search"></i></span>
        </div>
        @endif
    </div>
    <div class="col-12 col-md-3">
        <div class="d-flex flex-column flex-md-row">
            @if (isset($create) && $create)
            <a href="{{ $create['link'] }}" class="btn btn-lg btn-add ms-auto">
                <span class="icon"><i class="bi bi-plus-lg"></i></span> Add
            </a>
            @endif
            @if (isset($import) && $import)
            <form action="{{ $import['link'] }}" class="import-form ms-1" method="post" enctype="multipart/form-data">
                @csrf
                <input type="file" name="excel" id="excel">
                <label for="excel" class="btn btn-lg btn-import ms-auto">
                    Import
                </label>
            </form>
            @endif
        </div>
    </div>
</div>