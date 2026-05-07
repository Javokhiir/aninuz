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
    try {
        $fn();
        echo "[OK]  {$label}\n";
    } catch (Throwable $e) {
        $msg = "[ERR] {$label}: " . $e->getMessage();
        echo $msg . "\n";
        $errors[] = $msg;
    }
}

// Only generate key if APP_KEY is not set yet
$envPath = __DIR__ . '/antares-back-main/.env';
$envContent = file_exists($envPath) ? file_get_contents($envPath) : '';
$hasKey = preg_match('/^APP_KEY=base64:.+$/m', $envContent);

if (!$hasKey) {
    run('Generating app key (first time only)', function () use ($kernel) {
        $kernel->call('key:generate', ['--force' => true]);
    }, $errors);
} else {
    echo "[SKIP] App key already set — skipping key:generate\n";
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
if (empty($errors)) {
    echo "=== Done! All steps completed successfully. ===\n";
} else {
    echo "=== Completed with " . count($errors) . " error(s): ===\n";
    foreach ($errors as $err) {
        echo "  " . $err . "\n";
    }
    http_response_code(500);
}
