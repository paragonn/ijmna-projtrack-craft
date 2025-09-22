<?php
return [
    // Global defaults
    'requireResponseToBeSigned' => false,
    'entityId' => getenv('SSO_ENTITY_ID'),
    'enablePlugin' => true, // Default to enabled for other environments

    // Environment-specific overrides
    'staging' => function($config) {
        // Disable the plugin in staging
        $config['enablePlugin'] = false;
        return $config;
    },

    // Optional: Explicitly enable for production
    'production' => function($config) {
        $config['enablePlugin'] = true;
        return $config;
    },
];
