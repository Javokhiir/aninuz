<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class LocaleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Accept-Language is client-controlled and not always one of our locales:
        // Node's fetch() defaults to "*", browsers send lists like "en-US,en;q=0.9".
        // Handing those straight to setLocale() throws ("Invalid \"*\" locale"), so
        // only honour a value we actually support.
        $supported = config('translatable.locales', []);
        $requested = trim(strtok((string) $request->header('Accept-Language'), ','));
        $locale = strtolower(strtok($requested, '-'));

        if (in_array($locale, $supported, true)) {
            App::setLocale($locale);
            config(['translatable.locale' => $locale]);
        }

        $request->route()->forgetParameter('locale');
        return $next($request);
    }
}
