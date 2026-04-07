<?php

use Illuminate\Support\Facades\Route;

Route::get('/', 'PageController@dashboard');
Route::get('/profile', 'PageController@profile')->name('profile');
Route::get('/settings', 'PageController@settings')->name('settings');
Route::get('/parse', 'PageController@parse')->name('parse');

Route::post('/profile/{user}', 'UserController@profileUpdate')->name('profile.update');
Route::post('/users/{user}/update-pass', 'UserController@userUpdatePassword')->name('users.update_pass');

Route::resource('categories', 'CategoryController');
Route::resource('brands', 'BrandController');
Route::resource('services', 'ServiceController');
Route::resource('events', 'EventController');
Route::resource('products', 'ProductController');
Route::resource('reviews', 'ReviewController');
Route::resource('orders', 'OrderController');
Route::resource('users', 'UserController');
Route::resource('catalog', 'CatalogController');

Route::group(["prefix" => "orders", 'as' => 'orders.'], function () {
    Route::post('complete', 'OrderController@complete')->name('complete');
    Route::post('cancel', 'OrderController@cancel')->name('cancel');
});

Route::group(["prefix" => "products", 'as' => 'products.'], function () {
    Route::get('components/faq', 'ProductController@getFAQComponent')->name('faq_component');
    Route::post('import', 'ProductController@import')->name('import');
    Route::post('deleteimage', 'ProductController@deleteImage')->name('delete_image');
});