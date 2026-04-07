@extends('layouts.admin')

@section('title', 'Main')

@section('breadcrumb')
    @include('admin.partials.breadcrumb', [
        'title' => 'Main',
        'list' => [
            [
                'name' => 'Main',
                'current' => true
            ]
        ]
    ])
@endsection

@section('content')
<p class="fs-1 text-center">Welcome to {!! config("admin.logo.text") !!}</p>
@endsection