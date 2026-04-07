@extends('layouts.admin')

@section('breadcrumb')
    @include('admin.partials.breadcrumb', [
        'title' => 'Profile',
        'list' => [
            [
                'name' => 'Profile',
                'current' => true
            ]
        ]
    ])
@endsection

@section('content')
<div class="row row-cols-1 row-cols-md-2">
    <div class="col">
        <div class="row row-cols-1 mt-0 g-4">
            <div class="col">
                <div class="card card-form">
                    <div class="card-body text-center">
                        <div class="card-bg"></div>
                        <div class="card-info">
                            <form action="" method="post">
                                @csrf
                                <label>
                                    <div class="avatar-block"><span class="icon"><i class="bi bi-person"></i></span></div>
                                    <input type="file" name="image">
                                </label>
                            </form>
                            <p class="member-name">{{$name}}</p>
                            <p class="member-type">{{$role}}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="card card-form">
                    <div class="card-header">
                        <h5 class="card-title">@lang('admin.account')</h5>
                        <p class="card-subtitle">Here you can change user account information</p>
                    </div>
                    <div class="card-body">
                        <form action="{{dashboard_route('dashboard.profile.update', ['user' => auth()->user()->id])}}" method="post" enctype="multipart/form-data">
                            @csrf
                            <div class="row g-3 mb-3">
                                <div class="col">
                                    <label for="name" class="form-label">@lang('admin.name')</label>
                                    <div class="form-floating">
                                        <input type="text" class="form-control" id="name" name="name" placeholder="@lang('admin.name')" value="{{old('name', $name)}}">
                                        <label for="name">@lang('admin.name')</label>
                                    </div>
                                </div>
                                <div class="col">
                                    <label for="email" class="form-label">@lang('admin.email')</label>
                                    <div class="form-floating">
                                        <input type="email" class="form-control" id="email" name="email" placeholder="@lang('admin.email')" value="{{old('email', $email)}}">
                                        <label for="email">@lang('admin.email')</label>
                                    </div>
                                </div>
                            </div>
                            <div class="col mb-3">
                                <label for="phone" class="form-label">@lang('admin.phone')</label>
                                <div class="form-floating">
                                    <input type="text" class="form-control" id="phone" name="phone" placeholder="@lang('admin.phone')" {{old('phone', $phone)}}>
                                    <label for="phone">@lang('admin.phone')</label>
                                </div>
                            </div>
                            <div class="col mb-4">
                                <label for="about" class="form-label">@lang('admin.about')</label>
                                <div class="form-floating">
                                    <textarea class="form-control" placeholder="Leave a comment here" id="about" name="about" style="height: 100px">
                                        {{old('about', $about)}}
                                    </textarea>
                                    <label for="about">@lang('admin.about')</label>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-submit">@lang('admin.save')</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col">
        <div class="row row-cols-1 mt-0 g-4">
            <div class="col">
                <div class="card card-form">
                    <div class="card-header">
                        <h5 class="card-title">@lang('admin.change_pass')</h5>
                        <p class="card-subtitle">Here you can set your new password</p>
                    </div>
                    <div class="card-body">
                        <form action="{{dashboard_route('dashboard.users.update_pass', ['user' => auth()->user()->id])}}" method="post" enctype="multipart/form-data">
                            @csrf
                            <div class="col mb-3">
                                <label for="current_password" class="form-label">@lang('admin.old_pass')</label>
                                <div class="form-floating">
                                    <input type="password" class="form-control" id="current_password" name="current_password" placeholder="@lang('admin.old_pass')">
                                    <label for="current_password">@lang('admin.old_pass')</label>
                                </div>
                            </div>
                            <div class="col mb-3">
                                <label for="password" class="form-label">@lang('admin.pass')</label>
                                <div class="form-floating">
                                    <input type="password" class="form-control" id="password" name="password" placeholder="@lang('admin.pass')">
                                    <label for="password">@lang('admin.pass')</label>
                                </div>
                            </div>
                            <div class="col mb-4">
                                <label for="password_confirmation" class="form-label">@lang('admin.confirm_pass')</label>
                                <div class="form-floating">
                                    <input type="password" class="form-control" id="password_confirmation" name="password_confirmation" placeholder="@lang('admin.confirm_pass')">
                                    <label for="password_confirmation">@lang('admin.confirm_pass')</label>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-submit">@lang('admin.save')</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection