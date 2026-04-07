@extends('layouts.admin')

@section('breadcrumb')
    @include('admin.partials.breadcrumb', [
        'title' => 'Order Details',
        'list' => [
            [
                'name' => 'Order Details',
                'current' => true
            ]
        ]
    ])
@endsection

@section('content')
    
@endsection