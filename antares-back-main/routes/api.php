<?php

// deploy test v6

use Illuminate\Support\Facades\Route;

Route::get('/services', ['as' => 'events', 'uses' => 'PageController@services']);
Route::get('/services/{slug}', ['as' => 'services', 'uses' => 'PageController@serviceShow']);
Route::get('/events', ['as' => 'services', 'uses' => 'PageController@events']);
Route::get('/events/{slug}', ['as' => 'services', 'uses' => 'PageController@eventShow']);
Route::get('/brands', ['as' => 'services', 'uses' => 'PageController@brands']);
Route::get('/catalog', ['as' => 'catalog', 'uses' => 'PageController@catalog']);
Route::get('/orders/{hash}', ['as' => 'orders', 'uses' => 'OrderController@show']);

Route::post('/review', ['as' => 'review', 'uses' => 'PageController@review']);
Route::post('/checkout', ['as' => 'checkout', 'uses' => 'CheckoutController@checkout']);

Route::group(["prefix" => "categories", 'as' => "categories."], function () {
    Route::get('/', ['as' => 'index', 'uses' => 'CategoryController@index']);
    Route::get('{slug}', ['as' => 'show', 'uses' => 'CategoryController@show']);
});

Route::group(["prefix" => "products", 'as' => "products."], function () {
    Route::get('/{brand}', ['as' => 'index', 'uses' => 'ProductController@index']);
    Route::get('/detail/{slug}', ['as' => 'show', 'uses' => 'ProductController@show']);
    Route::post('/search', ['as' => 'search', 'uses' => 'ProductController@search']);
    Route::post('/getinfo', ['as' => 'getinfo', 'uses' => 'ProductController@getProductInfo']);
});