<?php
// IMPORTANT: Delete this file immediately after use!

echo "<pre style='font-family:monospace;font-size:13px'>";

// 1. PHP Version
echo "=== PHP ===\n";
echo "Version: " . PHP_VERSION . "\n";
echo "Extensions: pdo=" . (extension_loaded('pdo') ? 'YES' : 'NO');
echo ", pdo_mysql=" . (extension_loaded('pdo_mysql') ? 'YES' : 'NO');
echo ", mbstring=" . (extension_loaded('mbstring') ? 'YES' : 'NO');
echo ", fileinfo=" . (extension_loaded('fileinfo') ? 'YES' : 'NO') . "\n\n";

// 2. .env file check
echo "=== .env file ===\n";
$envPath = __DIR__ . '/antares-back-main/.env';
if (file_exists($envPath)) {
    echo ".env EXISTS\n";
    $env = parse_ini_file($envPath);
    echo "APP_KEY: " . (isset($env['APP_KEY']) && !empty($env['APP_KEY']) ? 'SET' : 'MISSING!') . "\n";
    echo "DB_CONNECTION: " . ($env['DB_CONNECTION'] ?? 'not set') . "\n";
    echo "DB_HOST: " . ($env['DB_HOST'] ?? 'not set') . "\n";
    echo "DB_DATABASE: " . ($env['DB_DATABASE'] ?? 'not set') . "\n";
    echo "DB_USERNAME: " . ($env['DB_USERNAME'] ?? 'not set') . "\n";
    echo "DB_PASSWORD: " . (isset($env['DB_PASSWORD']) ? (empty($env['DB_PASSWORD']) ? 'EMPTY!' : 'SET') : 'MISSING!') . "\n";
    echo "APP_DEBUG: " . ($env['APP_DEBUG'] ?? 'not set') . "\n\n";
} else {
    echo ".env MISSING! This is probably the problem.\n";
    echo "Expected at: $envPath\n\n";
}

// 3. Vendor check
echo "=== vendor ===\n";
$vendorPath = __DIR__ . '/antares-back-main/vendor/autoload.php';
echo "vendor/autoload.php: " . (file_exists($vendorPath) ? 'EXISTS' : 'MISSING!') . "\n\n";

// 4. Storage writable check
echo "=== storage ===\n";
$storageDirs = [
    'storage/logs',
    'storage/framework/sessions',
    'storage/framework/cache',
    'storage/framework/views',
    'bootstrap/cache',
];
foreach ($storageDirs as $dir) {
    $fullPath = __DIR__ . '/antares-back-main/' . $dir;
    $exists = is_dir($fullPath);
    $writable = $exists && is_writable($fullPath);
    echo "$dir: " . ($exists ? ($writable ? 'OK' : 'NOT WRITABLE!') : 'MISSING!') . "\n";
}
echo "\n";

// 5. DB connection test
echo "=== DB connection ===\n";
if (file_exists($envPath)) {
    $env = parse_ini_file($envPath);
    try {
        $dsn = "mysql:host={$env['DB_HOST']};port={$env['DB_PORT']};dbname={$env['DB_DATABASE']}";
        $pdo = new PDO($dsn, $env['DB_USERNAME'], $env['DB_PASSWORD']);
        echo "DB connection: SUCCESS\n";
    } catch (Exception $e) {
        echo "DB connection: FAILED!\n";
        echo "Error: " . $e->getMessage() . "\n";
    }
} else {
    echo "Skipped (no .env)\n";
}

echo "\n=== DONE. DELETE THIS FILE! ===\n";
echo "</pre>";
