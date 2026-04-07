<?php

use Illuminate\Support\Facades\Route;

Route::group(['middleware' => 'guest'], function() {
    Route::get('login', 'AuthenticatedSessionController@create')->name('login');
    Route::get('forgot-password', 'PasswordResetLinkController@create')->name('password.request');
    Route::get('reset-password/{token}', 'NewPasswordController@create')->name('password.reset');

    Route::post('login', 'AuthenticatedSessionController@store');
    Route::post('forgot-password', 'PasswordResetLinkController@store')->name('password.email');
    Route::post('reset-password', 'NewPasswordController@store')->name('password.store');
});

Route::group(['middleware' => 'auth'], function() {
    Route::get('verify-email', 'EmailVerificationPromptController')->name('verification.notice');
    Route::get('verify-email/{id}/{hash}', 'VerifyEmailController')->middleware(['signed', 'throttle:6,1']);
    Route::get('confirm-password', 'ConfirmablePasswordController@show')->name('password.confirm');

    Route::post('email/verification-notification', 'EmailVerificationNotificationController@store')
        ->middleware('throttle:6,1')
        ->name('verification.send');
    Route::post('confirm-password', 'ConfirmablePasswordController@store');
    Route::post('logout', 'AuthenticatedSessionController@destroy')->name('logout');

    Route::put('password', 'PasswordController@update')->name('password.update');
});
