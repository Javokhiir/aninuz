<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Arr;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // URL::forceScheme('https');
        foreach (config('payment.systems', []) as $system) {
            if (Arr::get($system, 'active', false) && $provider = Arr::get($system, 'provider')) {
                App::register($provider);
            }
        }

        Gate::before(function ($user, $ability) {
            return $user->hasRole('Super Admin') ? true : null;
        });

        View::composer([
            "admin.partials.sidebar"
        ], function ($view) {
            $menu = config('admin.menu');
            $view->with([
                'menu_list' => $menu,
                'current_route' => Route::currentRouteName()
            ]);
        });
    }
}
