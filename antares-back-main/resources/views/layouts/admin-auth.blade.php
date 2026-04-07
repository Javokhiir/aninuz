<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    {{ Vite::useBuildDirectory('build/dashboard') }}
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
    @vite('resources/assets/scss/main.scss')
    <title>@yield('title', config('admin.title', 'Simple Admin - SignIn'))</title>
</head>
<body>
    <div id="app">
        <div class="content signin">
            <div class="row row-cols-1 row-cols-md-2 align-items-center h-100">
                <div class="col">
                    <div class="container">
                        @yield('content')
                    </div>
                </div>
                <div class="col h-100">
                    <div class="card">
                        <div class="card-body">
                            <div class="d-flex flex-column justify-content-center align-items-center h-100">
                                <div class="navbar-brand">
                                    <span class="text">{!! config("admin.logo.text") !!}</span>
                                </div>
                                <div class="btn-group social-btns gap-2 mt-2">
                                    <a href="#" class="btn"><i class="bi bi-telegram"></i></a>
                                    <a href="#" class="btn"><i class="bi bi-instagram"></i></a>
                                    <a href="#" class="btn"><i class="bi bi-whatsapp"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js"></script>
</body>
</html>