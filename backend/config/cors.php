<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:1000',
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:3000',
        'https://goldenvibes-event.com',           
        'https://www.goldenvibes-event.com', 
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];

