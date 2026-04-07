<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Image Driver
    |--------------------------------------------------------------------------
    |
    | Intervention Image supports “GD Library” and “Imagick” to process images
    | internally. Depending on your PHP setup, you can choose one of them.
    |
    | Included options:
    |   - \Intervention\Image\Drivers\Gd\Driver::class
    |   - \Intervention\Image\Drivers\Imagick\Driver::class
    |
    */

    'driver' => \Intervention\Image\Drivers\Gd\Driver::class,

    /*
    |--------------------------------------------------------------------------
    | Configuration Options
    |--------------------------------------------------------------------------
    |
    | These options control the behavior of Intervention Image.
    |
    | - "autoOrientation" controls whether an imported image should be
    |    automatically rotated according to any existing Exif data.
    |
    | - "decodeAnimation" decides whether a possibly animated image is
    |    decoded as such or whether the animation is discarded.
    |
    | - "blendingColor" Defines the default blending color.
    */

    'options' => [
        'autoOrientation' => true,
        'decodeAnimation' => true,
        'blendingColor' => 'ffffff',
        'product_config' => [
            'main_strict' => true,
            'main_width' => 1200,
            'main_height' => 720,
            'preview_strict' => true,
            'preview_width' => 1200,
            'preview_height' => 630,
            'thumb_strict' => true,
            'thumb_width' => 150,
            'thumb_height' => 150,
            'extension' => "jpeg"
        ],
        'service_config' => [
            'main_strict' => true,
            'main_width' => 1200,
            'main_height' => 720,
            'preview_strict' => true,
            'preview_width' => 1200,
            'preview_height' => 630,
            'thumb_strict' => true,
            'thumb_width' => 150,
            'thumb_height' => 150,
            'extension' => "jpeg"
        ],
        'event_config' => [
            'main_strict' => true,
            'main_width' => 1200,
            'main_height' => 720,
            'preview_strict' => true,
            'preview_width' => 1200,
            'preview_height' => 630,
            'thumb_strict' => true,
            'thumb_width' => 150,
            'thumb_height' => 150,
            'extension' => "jpeg"
        ]
    ]
];
