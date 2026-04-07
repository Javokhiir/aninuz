<?php

return [
    'default' => env("DEFAULT_PAYMENT", "Cash"),
    'systems' => [
        'Cash' => [
            'active' => env("CASH_ACTIVE", false),
            'img' => 'assets/images/cash_logo.png',
            'footer_img' => null,
            'min' => 0,
            'max' => INF,
        ],
    ]
];