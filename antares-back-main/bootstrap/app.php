<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Route;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
        using: function() {
            $namespace = 'App\Http\Controllers';

            Route::middleware(['web', 'locale'])
                ->prefix('api')
                ->as('api.')
                ->namespace($namespace.'\Site')
                ->group(base_path('routes/api.php'));

            Route::middleware(['web'])
                ->namespace($namespace . "\Auth")
                ->prefix('auth')
                ->group(base_path("routes/auth.php"));

            Route::middleware(['web', 'auth'])
                ->prefix('dashboard')
                ->as('dashboard.')
                ->namespace($namespace.'\Admin')
                ->group(base_path('routes/dashboard.php'));

            Route::domain(config('app.site_url'))
                ->middleware(['web', 'locale'])
                ->as('site.')
                ->namespace($namespace.'\Site')
                ->group(base_path('routes/web.php'));
        }
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'Excel' => Maatwebsite\Excel\Facades\Excel::class,
            'Cart' => Darryldecode\Cart\Facades\CartFacade::class,
            'CartSession' => App\Http\Middleware\CartMiddleware::class,
            'locale' => App\Http\Middleware\LocaleMiddleware::class,
        ])
        ->use([
            \Illuminate\Http\Middleware\HandleCors::class,
        ])
        ->validateCsrfTokens(except: [
            'api/products/search',
            'api/products/getinfo',
            'api/review',
            'api/checkout',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
