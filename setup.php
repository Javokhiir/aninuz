<?php
// IMPORTANT: Delete this file after first-time setup!

http_response_code(200);
header('Content-Type: text/plain; charset=utf-8');

require __DIR__ . '/antares-back-main/vendor/autoload.php';
$app    = require_once __DIR__ . '/antares-back-main/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$errors = [];

function run(string $label, Closure $fn, array &$errors): void
{
    echo "[RUN] {$label}...\n";
    flush();
    try {
        $fn();
        echo "[OK]  {$label}\n";
        flush();
    } catch (Throwable $e) {
        $msg = "[ERR] {$label}: " . $e->getMessage();
        echo $msg . "\n";
        flush();
        $errors[] = $msg;
    }
}

// Generate APP_KEY directly in PHP — artisan cannot bootstrap without a key (chicken-and-egg)
$envPath = __DIR__ . '/antares-back-main/.env';
$envContent = file_exists($envPath) ? file_get_contents($envPath) : '';
$hasKey = (bool) preg_match('/^APP_KEY=base64:.+$/m', $envContent);

if (!$hasKey) {
    echo "[RUN] Generating app key (first time only)...\n";
    flush();
    try {
        $newKey = 'base64:' . base64_encode(random_bytes(32));
        if (preg_match('/^APP_KEY=/m', $envContent)) {
            $envContent = preg_replace('/^APP_KEY=.*$/m', "APP_KEY={$newKey}", $envContent);
        } else {
            $envContent = rtrim($envContent) . "\nAPP_KEY={$newKey}\n";
        }
        file_put_contents($envPath, $envContent);
        echo "[OK]  App key generated\n";
        flush();
    } catch (Throwable $e) {
        $msg = "[ERR] Generating app key: " . $e->getMessage();
        echo $msg . "\n";
        flush();
        $errors[] = $msg;
    }
} else {
    echo "[SKIP] App key already set — skipping key:generate\n";
    flush();
}

run('Running migrations', function () use ($kernel) {
    $kernel->call('migrate', ['--force' => true]);
}, $errors);

run('Caching config', function () use ($kernel) {
    $kernel->call('config:cache');
}, $errors);

run('Caching routes', function () use ($kernel) {
    $kernel->call('route:cache');
}, $errors);

run('Caching views', function () use ($kernel) {
    $kernel->call('view:cache');
}, $errors);

echo "\n";
flush();
if (empty($errors)) {
    echo "=== Done! All steps completed successfully. ===\n";
} else {
    echo "=== Completed with " . count($errors) . " error(s): ===\n";
    foreach ($errors as $err) {
        echo "  " . $err . "\n";
    }
    http_response_code(500);
}
flush();
