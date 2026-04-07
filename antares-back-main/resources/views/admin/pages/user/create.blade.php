@extends('layouts.admin')

@section('breadcrumb')
    @include('admin.partials.breadcrumb', [
        'title' => 'Create User',
        'list' => [
            [
                'name' => 'Create User',
                'current' => true
            ]
        ]
    ])
@endsection

@section('content')
<form action="{{dashboard_route('dashboard.users.store')}}" method="post" enctype="multipart/form-data">
    @csrf
    <div class="col">
        <div class="card">
            <div class="card-body">
                <div class="d-flex justify-content-end">
                    <div class="btn-group gap-2" role="group">
                        <button type="submit" class="btn btn-form">@lang('admin.save')</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row row-cols-1 row-cols-md-2">
        <div class="col">
            <div class="row row-cols-1 mt-0 g-4">
                <div class="col">
                    <div class="card card-form">
                        <div class="card-body text-center">
                            <div class="card-bg"></div>
                            <div class="card-info">
                                <label>
                                    <div class="avatar-block"><span class="icon"><i class="bi bi-person"></i></span></div>
                                    <input type="file" name="image">
                                </label>
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
                            <div class="row g-3 mb-3">
                                <div class="col">
                                    <label for="name" class="form-label">@lang('admin.name')</label>
                                    <div class="form-floating">
                                        <input type="text" class="form-control" id="name" name="name" placeholder="@lang('admin.name')" value="{{old('name')}}">
                                        <label for="name">@lang('admin.name')</label>
                                    </div>
                                </div>
                                <div class="col">
                                    <label for="email" class="form-label">@lang('admin.email')</label>
                                    <div class="form-floating">
                                        <input type="email" class="form-control" id="email" name="email" placeholder="@lang('admin.email')" value="{{old('email')}}">
                                        <label for="email">@lang('admin.email')</label>
                                    </div>
                                </div>
                            </div>
                            <div class="row g-3 mb-3">
                                <div class="col">
                                    <label for="phone" class="form-label">@lang('admin.phone')</label>
                                    <div class="form-floating">
                                        <input type="text" class="form-control" id="phone" name="phone" placeholder="@lang('admin.phone')" value="{{old('phone')}}">
                                        <label for="phone">@lang('admin.phone')</label>
                                    </div>
                                </div>
                                <div class="col">
                                    <label for="role" class="form-label">@lang('admin.role')</label>
                                    <div class="form-floating">
                                        <select class="form-select" id="role" name="role" aria-label="Floating label select example">
                                            <option selected>Open this select menu</option>
                                            @foreach ($roles as $role)
                                                <option value="{{$role}}">{{$role}}</option>
                                            @endforeach
                                        </select>
                                        <label for="role">@lang('admin.role')</label>
                                    </div>
                                </div>
                            </div>
                            <div class="row row-cols-3 mb-3">
                                <div class="col">
                                    <label for="is_active" class="form-label">@lang('admin.status')</label>
                                    <div class="custom-switch">
                                        <input type="checkbox" name="is_active" id="is_active">
                                        <label for="is_active">
                                            <div class="custom-switch-ball"><i class="bi bi-check2"></i></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div class="col">
                                <label for="about" class="form-label">@lang('admin.about')</label>
                                <div class="form-floating">
                                    <textarea class="form-control" placeholder="Leave a comment here" id="about" name="about" style="height: 100px">
                                        {{old('about')}}
                                    </textarea>
                                    <label for="about">@lang('admin.about')</label>
                                </div>
                            </div>
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
                            <div class="col mb-3">
                                <label for="password" class="form-label">@lang('admin.pass')</label>
                                <div class="form-floating">
                                    <input type="password" class="form-control" id="password" name="password" placeholder="@lang('admin.pass')">
                                    <label for="password">@lang('admin.pass')</label>
                                </div>
                            </div>
                            <div class="col">
                                <label for="password_confirmation" class="form-label">@lang('admin.confirm_pass')</label>
                                <div class="form-floating">
                                    <input type="password" class="form-control" id="password_confirmation" name="password_confirmation" placeholder="@lang('admin.confirm_pass')">
                                    <label for="password_confirmation">@lang('admin.confirm_pass')</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</form>
@endsection