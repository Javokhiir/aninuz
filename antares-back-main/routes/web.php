<?php

use Illuminate\Support\Facades\Route;

Route::group(["prefix" => "products", 'as' => "products."], function () {
    Route::get('/detail/{slug}', ['as' => 'show', 'uses' => 'ProductController@show']);
});