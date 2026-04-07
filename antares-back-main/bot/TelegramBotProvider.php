<?php

namespace TelegramBot;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class TelegramBotProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        Route::group(["namespace" => "TelegramBot\Http", "prefix" => "telegram-bot"], function() {
            Route::get('/set-hook', 'TelegramBotController@setWebHook');
            Route::get('/del-hook', 'TelegramBotController@delWebHook');
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        $this->loadViewsFrom(__DIR__ . '/views', 'telegram-bot');
    }
}
