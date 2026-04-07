@extends('layouts.admin-auth')

@section('content')
    <form action="{{route('login')}}" method="POST">
        @csrf
        <div class="mb-3">
            <label for="email" class="form-label">Email*</label>
            <div class="form-floating mb-3">
                <input type="email" class="form-control" id="email" name="email" placeholder="mail@domain.com">
                <label for="email">mail@domain.com</label>
            </div>
        </div>
        <div class="mb-3">
            <label for="password" class="form-label">Password*</label>
            <div class="form-floating mb-3">
                <input type="password" class="form-control" id="password" name="password" placeholder="name@example.com">
                <label for="password">Min. 8 characters</label>
            </div>
        </div>  
        <div class="d-flex justify-content-between">
            <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="keep_logged_in" name="keep_logged_in">
                <label class="form-check-label" for="keep_logged_in">Keep me logged in</label>
            </div>
            <a href="">Forgot password?</a>
        </div>
        <button type="submit" class="btn">Sign In</button>
    </form>
    @error('email')
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>{{ $message }}</strong>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    @enderror
    @error('password')
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>{{ $message }}</strong>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    @enderror
@endsection