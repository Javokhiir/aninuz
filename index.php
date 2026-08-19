<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

error_reporting(E_ALL & ~E_DEPRECATED);

// App is deployed in /api/ subdirectory. Prevent Symfony from stripping
// /api from REQUEST_URI when computing path info for route matching.
$_SERVER['SCRIPT_NAME'] = '/index.php';
$_SERVER['PHP_SELF']    = '/index.php';

// Because of the rewrite above, asset() would resolve to the domain root and
// miss the /api directory the build assets actually live in. Point it back,
// unless the environment already says otherwise.
$_SERVER['ASSET_URL'] = $_SERVER['ASSET_URL'] ?? getenv('ASSET_URL') ?: '/api';

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/antares-back-main/storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/antares-back-main/vendor/autoload.php';

// Bootstrap Laravel and handle the request...
(require_once __DIR__.'/antares-back-main/bootstrap/app.php')
    ->handleRequest(Request::capture());
