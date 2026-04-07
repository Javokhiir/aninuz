@extends('layouts.admin')

@section('breadcrumb')
    @include('admin.partials.breadcrumb', [
        'title' => 'Words',
        'list' => [
            [
                'name' => 'Words',
                'current' => true
            ]
        ]
    ])
@endsection

@section('content')
    
@endsection