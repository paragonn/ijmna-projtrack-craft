<?php

return [
    'extraDeleteButton' => true,
    'experimentalFeatures' => true,
    'enableDragDrop' => false,
    'expandMenu' => true,
    'expandUngrouped' => false,
    'ungroupedPosition' => 'start',
    'fields' => [
        'contentBuilder' => [
            'groups' => [
                [
                    'label' => \Craft::t('app', 'Basic'),
                    'types' => ['basicContent', 'image'],
                ],
                [
                    'label' => \Craft::t('app', 'Components'),
                    'types' => ['imageContent', 'infoBox', 'iconCards', 'cards', 'statsBox', 'checklist', 'featuredBanner', 'cta'],
                ],
                [
                    'label' => \Craft::t('app', 'Layout'),
                    'types' => ['twoColumns', 'container'],
                ]
            ],
        ]
    ]
];
