<?php
/**
 * General Configuration
 *
 * All of your system's general configuration settings go in here. You can see a
 * list of the available settings in vendor/craftcms/cms/src/config/GeneralConfig.php.
 *
 * @see \craft\config\GeneralConfig
 */

use craft\config\GeneralConfig;
use craft\helpers\App;

return GeneralConfig::create()
    // Set the default week start day for date pickers (0 = Sunday, 1 = Monday, etc.)
    ->defaultWeekStartDay(1)

    // Prevent generated URLs from including "index.php"
    ->omitScriptNameInUrls()

    // Enable Dev Mode (see https://craftcms.com/guides/what-dev-mode-does)
    ->devMode(App::env('DEV_MODE') ?? false)

    // Preload Single entries as Twig variables
    ->preloadSingles()

    // Allow administrative changes
    ->allowAdminChanges(App::env('ALLOW_ADMIN_CHANGES') ?? false)

    ->cpTrigger(App::env('CP_TRIGGER') ?: 'control')

    // Disallow robots
    ->disallowRobots(App::env('DISALLOW_ROBOTS') ?? false)

    ->enableTemplateCaching(App::env('ALLOW_CACHE') ?? false)

    // Prevent user enumeration attacks
    ->preventUserEnumeration()

    ->errorTemplatePrefix("_messages/")

    // Login SSO entityId
    // ->entityId(App::env('SSO_ENTITY_ID') ?? false)

    // Set the @webroot alias so the clear-caches command knows where to find CP resources
    ->aliases([
        '@web' => App::env('PRIMARY_SITE_URL'),
        '@webroot' => dirname(__DIR__) . '/web',
    ])

    ->generateTransformsBeforePageLoad(true)

    ->maxUploadFileSize(52428800)

    // Environment-specific configurations
    ->merge([
        '*' => [
            'loginPath' => App::env('CP_TRIGGER') . '/login', // Default to native login for non-specified environments
        ],
        'production' => [
            'loginPath' => App::env('SSO_LOGIN_PATH') ?: App::env('CP_TRIGGER') . '/login', // Use SSO in production
        ],
    ])
;
