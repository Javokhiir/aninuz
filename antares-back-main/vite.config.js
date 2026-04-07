import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            buildDirectory: 'build/dashboard',
            input: [
                'resources/assets/js/main.js',
                'resources/assets/js/editor.js',
                'resources/assets/scss/main.scss',
            ],
            refresh: true,
        }),
    ],
    resolve: {
        alias: {
            '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
            '~bootstrap-icons': path.resolve(__dirname, 'node_modules/bootstrap-icons'),
        },
    },
    build: {
        chunkSizeWarningLimit: 2048,
    }
});
