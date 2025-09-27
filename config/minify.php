<?php

use craft\helpers\App;

$isDev = App::env('CRAFT_ENVIRONMENT') === 'dev';
$isProd = App::env('CRAFT_ENVIRONMENT') === 'production';

return [
    'disableTemplateMinifying' => $isDev,
    'disableDevModeMinifying' => true,
];

