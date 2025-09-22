<?php
/**
 * Blitz config.php
 *
 * This file exists only as a template for the Blitz settings.
 * It does nothing on its own.
 *
 * Don't edit this file, instead copy it to 'craft/config' as 'blitz.php'
 * and make your changes there to override default settings.
 *
 * Once copied to 'craft/config', this file will be multi-environment aware as
 * well, so you can have different settings groups for each environment, just as
 * you do for 'general.php'
 */

use craft\helpers\App;

return [
    // Default settings for all environments (dev, staging, etc.)
    '*' => [
        // Disable caching by default for non-production environments
        'cachingEnabled' => false,

        // Disable automatically refreshing cache after editing globals
        'refreshCacheAutomaticallyForGlobals' => false,

        // Other default settings (can be overridden in production)
        'refreshCacheEnabled' => true,

    	//'refreshMode' => \putyourlightson\blitz\models\SettingsModel::REFRESH_MODE_CLEAR_AND_GENERATE,
    	'refreshMode' => \putyourlightson\blitz\models\SettingsModel::REFRESH_MODE_EXPIRE,

        // The storage type to use
        'cacheStorageType' => 'putyourlightson\blitz\drivers\storage\YiiCacheStorage',

        // The storage settings
        'cacheStorageSettings' => [
            'compressCachedValues' => false,
        ],

        // The generator type to use
        'cacheGeneratorType' => 'putyourlightson\blitz\drivers\generators\HttpGenerator',

        // The generator settings
        'cacheGeneratorSettings' => ['concurrency' => 3],

        // The purger type to use
        'cachePurgerType' => 'putyourlightson\blitz\drivers\purgers\CloudflarePurger',

        // Whether an X-Powered-By: Blitz header should be added to the response
        'sendPoweredByHeader' => false,

        // Query string caching behavior
        'queryStringCaching' => \putyourlightson\blitz\models\SettingsModel::QUERY_STRINGS_DO_NOT_CACHE_URLS,

        // URI patterns to include in caching
        'includedUriPatterns' => [
            [
                'siteId' => '',
                'uriPattern' => '.*',
            ],
        ],

        // URI patterns to exclude from caching
        'excludedUriPatterns' => [
            [
                'siteId' => '', // Apply to all sites
                'uriPattern' => 'actions/*',
            ],
            [
                'siteId' => '', // Apply to all sites
                'uriPattern' => 'dynamic/*',
            ],
            [
                'siteId' => '', // Apply to all sites
                'uriPattern' => 'forms/*',
            ],
        ],

        // Cloudflare purger settings (zone ID keys are site UIDs)
        'cachePurgerSettings' => [
            'zoneIds' => [
                'af56b8d4-e8df-4952-96c3-24e39909380c' => [
                    'zoneId' => '0cdd48133f3329ccea70446de6285439', // IJMTracker.org
                ],
            ],
            'authenticationMethod' => 'apiToken',
            'apiToken' => App::env('CF_TOKEN'),
        ],

        // Disable SSI and ESI
        'ssiEnabled' => false,
        'detectSsiEnabled' => false,
        'esiEnabled' => false,        
    ],

    // Staging-specific settings
    'staging' => [
        // Enable caching only in production
        'cachingEnabled' => true,
    ],    

    // Production-specific settings
    'production' => [
        // Enable caching only in production
        'cachingEnabled' => true,
    ],
];
