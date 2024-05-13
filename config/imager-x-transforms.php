<?php

$transforms['jpg'] = [
    'transforms' => [
        ['width' => 576],
        ['width' => 768],
        ['width' => 992],
        ['width' => 1280],
        ['width' => 1600],
    ],
    'defaults' => [
        'position'      => '100% 100%',
        'mode'          => 'crop',
        'jpegQuality'   => 80,
    ],
    'configOverrides' => [
        'fillTransforms' => true,
        'fillInterval'   => 300,
    ]
];

$transforms['webp'] = $transforms['jpg'];
$transforms['webp']['defaults']['format'] = 'webp';

return $transforms;