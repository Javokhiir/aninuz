<?php

use Illuminate\Support\Facades\Route;

Route::post('/login', 'AuthController@login');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', 'AuthController@logout');
    Route::get('/me', 'AuthController@me');
    Route::post('/auth/request-code', 'AuthController@requestPasswordCode');
    Route::post('/auth/change-password', 'AuthController@changePasswordWithCode');

    Route::apiResource('products', 'ProductController');
    Route::post('products/{product}/delete-image', 'ProductController@deleteImage');
    Route::post('products/import', 'ProductController@import');

    Route::apiResource('categories', 'CategoryController');
    Route::apiResource('brands', 'BrandController');
    Route::apiResource('services', 'ServiceController');
    Route::apiResource('events', 'EventController');

    Route::get('orders', 'OrderController@index');
    Route::get('orders/{order}', 'OrderController@show');
    Route::post('orders', 'OrderController@store');
    Route::post('orders/{order}/complete', 'OrderController@complete');
    Route::post('orders/{order}/cancel', 'OrderController@cancel');

    Route::get('reviews', 'ReviewController@index');
    Route::delete('reviews/{review}', 'ReviewController@destroy');

    Route::apiResource('users', 'UserController');
    Route::post('profile', 'UserController@profileUpdate');
    Route::post('profile/password', 'UserController@updatePassword');
});
