@extends('layouts.admin')

@section('breadcrumb')
    @include('admin.partials.breadcrumb', [
        'title' => 'Settings',
        'list' => [
            [
                'name' => 'Settings',
                'current' => true
            ]
        ]
    ])
@endsection

@section('content')
    
@endsection