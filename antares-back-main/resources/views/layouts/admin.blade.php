<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    @php Vite::useBuildDirectory('build/dashboard'); @endphp
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
    <link href="https://cdn.datatables.net/v/bs5/dt-2.2.1/datatables.min.css" rel="stylesheet">
    @yield('css')
    @vite('resources/assets/scss/main.scss')
    <title>@yield('title', config('admin.title', 'Simple Admin'))</title>
</head>
<body>
    <div id="app">
        @include('admin.partials.sidebar')
        <div class="content">
            <div class="container-fluid">
                @include('admin.partials.header') 
                <main class="main">
                    @include('admin.partials.alert')
                    @yield('content')
                </main>
            </div>
        </div>
    </div>
    @yield('modals')
    @include('admin.partials.script')
</body>
</html>