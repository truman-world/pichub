<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Storage Configuration
    |--------------------------------------------------------------------------
    */
    'storage' => [
        'default' => env('STORAGE_DEFAULT', 'local'),
        'backup_driver' => env('STORAGE_BACKUP_DRIVER', null),
        'drivers' => [
            'local' => [
                'driver' => \App\Storage\Drivers\LocalDriver::class,
                'root' => storage_path('app/public'),
                'url' => env('APP_URL') . '/storage',
            ],
            's3' => [
                'driver' => \App\Storage\Drivers\S3Driver::class,
                'key' => env('AWS_ACCESS_KEY_ID'),
                'secret' => env('AWS_SECRET_ACCESS_KEY'),
                'region' => env('AWS_DEFAULT_REGION'),
                'bucket' => env('AWS_BUCKET'),
                'url' => env('AWS_URL'),
            ],
        ],
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Upload Configuration
    |--------------------------------------------------------------------------
    */
    'upload' => [
        'max_file_size' => env('STORAGE_MAX_FILE_SIZE', 104857600), // 100MB
        'chunk_size' => 5242880, // 5MB
        'allowed_extensions' => explode(',', env('STORAGE_ALLOWED_EXTENSIONS', 'jpg,jpeg,png,gif,webp,bmp,svg')),
        'allowed_mime_types' => [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/bmp',
            'image/svg+xml',
        ],
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Image Processing Configuration
    |--------------------------------------------------------------------------
    */
    'image' => [
        'driver' => env('IMAGE_DRIVER', 'gd'),
        'quality' => env('IMAGE_QUALITY', 85),
        'max_width' => env('IMAGE_MAX_WIDTH', 4096),
        'max_height' => env('IMAGE_MAX_HEIGHT', 4096),
        'thumbnail_sizes' => [
            'small' => [150, 150],
            'medium' => [300, 300],
            'large' => [600, 600],
        ],
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Security Configuration
    |--------------------------------------------------------------------------
    */
    'security' => [
        'enable_hotlink_protection' => env('ENABLE_HOTLINK_PROTECTION', false),
        'allowed_domains' => explode(',', env('ALLOWED_DOMAINS', '')),
        'clamav_enabled' => env('CLAMAV_ENABLED', false),
        'clamav_socket' => env('CLAMAV_SOCKET', '/var/run/clamav/clamd.ctl'),
    ],
    
    /*
    |--------------------------------------------------------------------------
    | Content Moderation Configuration
    |--------------------------------------------------------------------------
    */
    'moderation' => [
        'enabled' => env('CONTENT_MODERATION_ENABLED', false),
        'provider' => env('CONTENT_MODERATION_PROVIDER', null),
        'threshold' => env('CONTENT_MODERATION_THRESHOLD', 0.8),
    ],
    
    /*
    |--------------------------------------------------------------------------
    | CDN Configuration
    |--------------------------------------------------------------------------
    */
    'cdn' => [
        'enabled' => env('CDN_ENABLED', false),
        'provider' => env('CDN_PROVIDER', null),
        'url' => env('CDN_URL', null),
    ],
];
