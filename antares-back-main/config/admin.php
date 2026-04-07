<?php

return [
    'title' => 'Antares Admin',
    'logo' => [
        'img' => 'ginza_icon.png',
        'text' => '<b>Antares</b> Admin',
        'route' => 'dashboard.'
    ],
    'menu' => [
        [
            'text' => 'dashboard',
            'icon' => 'bi bi-house-door-fill',
            'route'  => 'dashboard.',
        ],
        [
            'header' => 'ecommerce',
        ],
        [
            'text' => 'orders',
            'icon' => 'bi bi-file-earmark-plus',
            'route'  => 'dashboard.orders.index',
        ],
        [
            'text' => 'products',
            'icon' => 'bi bi-boxes',
            'route'  => 'dashboard.products.index',
        ],
        [
            'header' => 'extra',
        ],
        [
            'text' => 'services',
            'icon' => 'bi bi-gear-wide-connected',
            'route'  => 'dashboard.services.index',
        ],
        [
            'text' => 'events',
            'icon' => 'bi bi-newspaper',
            'route'  => 'dashboard.events.index',
        ],
        [
            'text' => 'categories',
            'icon' => 'bi bi-list-nested',
            'route'  => 'dashboard.categories.index',
        ],
        [
            'text' => 'brands',
            'icon' => 'bi bi-grid-3x2-gap',
            'route'  => 'dashboard.brands.index',
        ],
        [
            'text' => 'reviews',
            'icon' => 'bi bi-chat-dots',
            'route'  => 'dashboard.reviews.index',
        ],
        [
            'text' => 'catalog',
            'icon' => 'bi bi-file-pdf',
            'route'  => 'dashboard.catalog.index',
        ],
        [
            'header' => 'settings',
        ],
        [
            'text' => 'users',
            'icon' => 'bi bi-people',
            'route'  => 'dashboard.users.index',
            'can' => 'manage-users'
        ],
        [
            'text' => 'profile',
            'icon' => 'bi bi-person-fill',
            'route'  => 'dashboard.profile',
        ],
    ]
];