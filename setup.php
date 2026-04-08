<?php
// IMPORTANT: Delete this file after running!

require __DIR__.'/antares-back-main/vendor/autoload.php';
$app = require_once __DIR__.'/antares-back-main/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

echo "<pre>";

echo "Generating app key...\n";
$kernel->call('key:generate', ['--force' => true]);

echo "Running migrations...\n";
$kernel->call('migrate', ['--force' => true]);

echo "Caching config...\n";
$kernel->call('config:cache');

echo "Caching routes...\n";
$kernel->call('route:cache');

echo "Caching views...\n";
$kernel->call('view:cache');

echo "\nDone! DELETE THIS FILE NOW!\n";
echo "</pre>";
